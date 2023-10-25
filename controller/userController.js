const User = require("../Models/userModel");
const bcrypt = require('bcrypt');
const secure = require('../bcript/bcript')
const Notification = require('../Models/notification.js');
const { ObjectId } = require("mongodb");
const createtoken = require('../token/authToken')
const fs = require('fs')
const { generateOTP, sendOTP } = require('../email/mail');

// register api

const authRegister = async (req, res) => {

  try {
    const { firstName, lastName, phoneNumber, email, age, dob, address, password, confirmPassword } = req.body;

    if(!firstName || !lastName || !phoneNumber || !email || !age || !dob || !address || !password || !confirmPassword)
    {
      return res.status(401).json({message:"Please fill the field properly"})
    }
    // generate OTP
    const OTP = generateOTP();
    const profilePic = req.files?.["profilePic"]?.[0]?.path;
    const identity = req.files?.["identity"]?.[0]?.path;
    
    const spassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      firstName, lastName, phoneNumber, email, age, dob, address, password: spassword,
      confirmPassword: spassword, profilePic, identity, otp: OTP,
      otpExpires : Date.now() + 30000 // Set OTP expiry time to 30 seconds from now
    });

    const userdata = await User.findOne({ email: req.body.email });

    if (userdata) {
      return res.status(400).send({ error: "user already exist" });
    }

    if (password != confirmPassword) {
      return res.status(422).send({ error: "passwords do not match" });
    } else {
      const userdatas = await user.save();

      // send OTP via email
      sendOTP(email, OTP);

      setTimeout(async () => {
        // Expire OTP after 30 seconds
        const user = await User.findOneAndUpdate({ email }, { otp: null, otpExpires: null });
        if (!user) {
          return res.status(404).send({ error: "User not found" });
        }
        console.log("OTP Expired");
      }, 30000);

      res.status(200).json({
        status: "success",
        message: "register successfully",
      });
    }

  } catch (error) {
    res.status(401).json({ message: error.message });
  }

};






// login api

const authLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "please fill the proper field " });
    } else {
      let user = await User.findOne({ email: req.body.email });
// console.log(user.otp);
   
    ///  Check if user is verified
      if (!user.isVerified) {
        return res.status(401).json({ error: "unverified account" });
      }

      if (user.isAdmin === false) {
        const checkpassword = await bcrypt.compare(
          req.body.password,
          user.password
        );

        if (!checkpassword) {
          return res.status(404).json({ error: "invalid password" });
        }

        const token = await createtoken(user._id);
        user.token = token;
        const login = await user.save();
        let Id = user._id;
        return res.status(200).json({ success: "Welcome user..!!", token, Id });
      } else {
        const checkpassword = await bcrypt.compare(
          req.body.password,
          user.password
        );

        if (!checkpassword) {
          return res.status(404).json({ error: "invalid password" });
        }

        const token = await createtoken(user._id);
        user.token = token;
        const login = await user.save();
        let Id = user._id;
        return res.status(200).json({ success: "Welcome admin..!!", token, Id });
      }
      
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}


const allAuthDetails = async (req, res) => {
  try {

    const userExits = await User.find({})
    if (userExits.length === 0) {
      return res.status(404).json({
        status: "bad-request",
        message: "auth not found"
      })
    } else {
      res.status(200).json({
        message: "success",
        allUsers: userExits
      })
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}

const authDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const authExits = await User.findById(id)
    if (authExits) {
      res.status(200).json({
        status: "success",
        authDetail: authExits
      })
    } else {
      res.status(400).json({
        status: "bad-request",
        message: "auth not found"
      })
    }
  }
  catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}

const updateAuth = async (req, res) => {
  try {
    const { id } = req.params;
    const authExits = await User.findByIdAndUpdate(id, req.body, { new: true })
    authExits.profilePic = req.files['profilePic'][0].path
    authExits.identity = req.files['identity'][0].path
    if (authExits) {
      res.status(200).json({
        status: "success",
        updated: authExits
      })
    } else {
      res.status(400).json({
        status: "failed",
        message: "auth not found"
      })
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const Deleteduser = await User.findByIdAndDelete(id)

    if (Deleteduser) {
      const oldImageUrl = ('../public/assets/images', Deleteduser.profilePic);
      const oldImage = ('../public/assets/images', Deleteduser.identity);
      const file = fs.unlinkSync(oldImageUrl)
      const file2 = fs.unlinkSync(oldImage)
      res.status(200).json({ message: "User data deleted" })
    }
    else {
      res.status(400).json({ message: "user not found" })
    }
  } catch (error) {
    res.status(401).json(error.message)
  }
}

// get notification 

const getNotification = async (req, res) => {

    const user = res.locals.user;
  
    try {
      const notification = await Notification.aggregate([
        {
          $match: { receiver: ObjectId(user._id) },
        },
        {
          $sort: { date: -1 }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'sender',
            foreignField: '_id',
            as: 'sender'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'receiver',
            foreignField: '_id',
            as: 'receiver'
          },
        },
        {
          $unwind: '$sender',
        },
        {
          $unwind: '$receiver',
        },
        {
          $project: {
            read: true,
            notificationType: true,
            date: true,
            notificationData: true,
            'sender.firstName': true,
            'sender.profilePic': true,
            'sender._id': true,
            'receiver._id': true
          },
        },
  
      ]);
      
      res.json(notification);
    } catch (error) {
      res.status(401).json(error.message)
    }
  } 

// read notification
const readNotication = async (req, res) => {
  const user = res.locals.user
  try {
    await Notification.updateMany({ receiver: user._id }), { read: true }
    return res.send()
  } catch (error) {
    res.status(401).json(error.msg)
  }
}

const authChangePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body
    const { id } = req.params
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(404).json({
        message: "please fill all fields"
      })
    } if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        message: "newPassword and confirmNewPassword is not match"
      })
    } else {
      const data = await User.findByIdAndUpdate(id, req.body, { new: true })
      const isMatch = await bcrypt.compare(oldPassword, data.password)
      if (isMatch) {
        data.password = await secure(newPassword)
        data.save()
        res.status(200).json({
          status: "success",
          message: "password changed ssuccessfully"
        })

      } else {
        return res.status(400).json({
          message: "please enter old password"
        })
      }
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}

const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    if(!otp){
      return res.status(401).json({ message: "Please provide otp" });
    }

    const user = await User.findOne({ otp });

    if (!user) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}


const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(401).json({ message: "Please provide email" });
    }
    const OTP = generateOTP();
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }
    user.otp = OTP;
    user.otpTries = 0;
    user.otpExpires = Date.now() + 30000; // otp will expire after 30 second
    await user.save();
    
    sendOTP(email, OTP);
    res.status(201).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};


module.exports = {
  authRegister,
  authLogin,
  allAuthDetails,
  authDetail,
  updateAuth,
  deleteUser,
  authChangePassword,
  getNotification,
  readNotication,
  resendOtp,
  verifyOtp
};
