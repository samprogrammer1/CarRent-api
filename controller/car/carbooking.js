const route = require('express').Router();
const authUser = require('../../middleware/user');

const multer = require('multer');
const path = require('path');
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const mongoose = require('mongoose');

//model
const carBooking = require('./../../model/car_booking');
const bookingImage = require('./../../model/booking_image');


route.get('/',authUser.user,(req, res, next) => {
    carBooking.find({}).populate('car_id user_id front_id_img back_id_img').populate({
        path : 'car_id',
        populate : {
            path : 'image',
            model : 'car_image',
        },
    }).populate({
        path : 'car_id',
        populate : {
            path : 'category_id',
            model : 'car_model'
        }
    }).populate({
        path : 'car_id',
        populate : {
            path : 'price_id',
            model : 'car_prices'
        }
    }).then((result)=>{
        return res.status(200).json({
            status_code : 200,
            response : {
                data : result
            }
        })
    })
});



// Multer setup
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

var upload = multer({ storage: storage });

async function uploadToCloudinary(locaFilePath) {
    return cloudinary.uploader
        .upload(locaFilePath, { folder: "main/id" })
        .then((result) => {
            fs.unlinkSync(locaFilePath);
            return {
                message: "Success",
                url: result.url,
                id: result.public_id,
            };
        })
        .catch((error) => {
            // Remove file from local uploads folder
            fs.unlinkSync(locaFilePath);
            return { message: "Fail" };
        });
}

route.post('/' ,upload.fields([{ name: 'front_id', maxCount: 1 }, { name: 'back_id', maxCount: 1 }]), async (req, res, next) => {
  
    if(req.files != undefined){
        if(req.files.front_id && req.files.back_id){
             const front_id = req.files.front_id[0].path;
        const back_id = req.files.back_id[0].path;
    
        //booking id
        const booking_id = new mongoose.Types.ObjectId;
        //cloudinary Image Data
        let localfront_id;
        let localback_id;
    
        const front_id_upload = uploadToCloudinary(front_id).then((result) => {
           bookingImage.create({
               _id : new mongoose.Types.ObjectId,
               booking_id : booking_id,
               image_id : result.id,
               image_url : result.url
           }).then((frontResult)=>{
            localfront_id = frontResult._id;
            const front_id_upload = uploadToCloudinary(back_id).then((result) => {
                bookingImage.create({
                    _id : new mongoose.Types.ObjectId,
                    booking_id : booking_id,
                    image_id : result.id,
                    image_url : result.url
                }).then((backResult)=>{
                     localback_id = backResult._id;
                }).then(()=>{
                    const carBookingData = new carBooking({
                        _id : booking_id,
                        car_id : req.body.car_id,
                        user_id : req.body.user_id,
                        total_time : req.body.total_time,
                        total_price : req.body.total_price,
                        address : req.body.address,
                        city : req.body.city,
                        front_id_img : localfront_id,
                        back_id_img : localback_id
                    });
                    carBookingData.save().then((carbookingResult)=>{
                        return res.status(201).json({
                            status_code : 201,
                            response :  {
                                carBooking : carbookingResult
                            }
                        })
                    })
                });
            })
                
           });
        })
        }else{
           return res.status(401).json({
               status_code : 401,
               error : {
                   front_id : "Please upload your front id image",
                   back_id : "Please upload your back id image"
               }
           });
        }
    }else{
        return res.status(401).json({
            status_code : 401,
            error : {
                front_id : "Please upload your front id image",
                back_id : "Please upload your back id image"
            }
        });
    }
});

route.put('/:id', (req,res, next) =>{
    car_update_id =  req.params.id;
    carBooking.updateOne({_id : car_update_id},
        req.body,{upsert : true}
    ).then((result)=>{
        return res.status(201).json({
            status_code : 201,
            update : result
        });
    }).catch((err)=>{
        return res.status(500).json({
            status_code : 500,
            error : err
        });
    })
})


route.delete('/:id',(req, res, next) => {
    const id = req.params.id;
    bookingImage.find({car_id : id}).then((ImageResult) => {
        for (let i = 0; i < ImageResult.length; i++) {
            const image_id = ImageResult[i].image_id;
            cloudinary.uploader.destroy(image_id);
        }
        bookingImage.deleteMany({car_id : id}).then((result)=>{
          console.log(result);  
        });
        carBooking.deleteOne({_id : id}).then((CarResult)=>{
            return res.status(201).json({
                status_code : 201,
                success_massage : CarResult
            })
        });
    }).catch((err) => {
        return res.status(500).json({
            error : err 
        })
    });
})

module.exports = route;