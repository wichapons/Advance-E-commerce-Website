//NOT WORKING WILL FIX THIS IN FUTURE // I will use express file upload instead

//
const uuid = require('uuid').v4; //for generating unique ID

function uploadFile(req, res, next) {
    try{
        const upload = multer({
            //set path to save file
            storage: multer.diskStorage({
                destination:'product-data/image',
                filename: (req,file,callback)=>{
                    callback(null, uuid()+'-'+file.originalname)
                }
            }),
            limits:{
                fileSize: 1024*1024
            },
            onError: function (err, next) {
                next(err);
            },
            fileFilter: (req, file, cb) => {
                if (
                  file.mimetype === "image/jpeg" ||
                  file.mimetype === "image/png" ||
                  file.mimetype === "image/webp"
                ) {
                  cb(null, true);
                } else {
                  cb(new Error("Not an image! Please upload an image.", 400), false);
                }
            }
        });    
        upload.array('images', 4); // Create an array of images by getting from input named "images" in the submitted form, maximum of 3 images
        console.log(req.files); 
    }catch(err){
        next(err)
    }
}

module.exports = uploadFile;
