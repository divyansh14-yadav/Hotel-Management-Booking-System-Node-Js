const multer = require('multer')
const path = require('path')

const multerStorage = multer.diskStorage({   
    destination: 'public/assets/images',
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
      }
   });
   const upload = multer({
        storage: multerStorage,
        fileFilter:  (req,file, cb)=> {
            const filetypes = /jpeg|jpg|png|pdf/; 
            const mimetype = filetypes.test(file.mimetype);
            const extname = filetypes.test(path.extname(file.originalname));        
            if(mimetype && extname){
                return cb(null, true);
            }
          
            return cb("this file type not supported, please upload jpeg/jpg/png/pdf  only ");
        },
        limits: {
                     fileSize: 5000000 * 960,
                },
            
            })

module.exports = {upload};