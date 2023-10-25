const nodemailer = require('nodemailer');
const User = require('../Models/userModel');

// create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
});

// generate OTP function
const generateOTP = () => {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

function sendOTP(email, otp) {
  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: 'WELCOME TO HOTEL SAYAJI',
    text: 'This Email Is For Your Registration Request On Our Hotel And Your Otp for Registration is: ' + otp + ' Use This Otp For Verification'
  };
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Email sent successfully");
    }
  });
};

module.exports = {
  generateOTP,
  sendOTP
}