const route = require('express').Router();
const multer = require('multer');
const path = require('path');
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

//model
const mongoose = require('mongoose');
const Car = require('../../model/car');
const carImage = require('../../model/car_image');
const carPrice = require('../../model/car_price')
const carModel = require('../../model/car_model');


if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
}

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
        .upload(locaFilePath,{folder : "main/carimage"})
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

route.post('/car_post', upload.array("images", 4), async (req, res, next) => {
    const car_id = new mongoose.Types.ObjectId;
    const carImageData = [];

    for (var i = 0; i < req.files.length; i++) {
        var locaFilePath = req.files[i].path;
        // Upload the local image to Cloudinary
        // and get image url as response
        var result = await uploadToCloudinary(locaFilePath);
        const imageData = new carImage({
            _id: new mongoose.Types.ObjectId,
            car_id: car_id,
            image_id: result.id,
            image: result.url
        });
        carImageData.push(imageData._id);
        imageData.save().then((ImageResult) => {
            console.log("image has been added");
        }).catch((err) => {
            console.log(err);
        })
    }

    const carData = Car({
        _id: car_id,
        car_name: req.body.car_name,
        category_id: req.body.category_id,
        condition: req.body.condition,
        color: req.body.color,
        engin_size: req.body.engin_size,
        production_year: req.body.production_year,
        price_id: req.body.price_id,
        image: carImageData,
        isAvailable: req.body.isAvailable
    });
    console.log(carData);
    carData.save().then((result) => {
        return res.status(201).json({
            status_code: 201,
            response: {
                data: result
            }
        })
    }).catch((err) => {
        return res.status(401).json({
            status_code: 500,
            error: err
        })
    });
});


route.post('/carmodel', (req, res, next) => {
    const car = new carModel({
        _id: new mongoose.Types.ObjectId,
        company_name: req.body.company_name
    });
    car.save().then((result) => {
        return res.status(201).json({
            status_code: 201,
            response: {
                AddCarModel: result
            }
        })
    }).catch((err) => {
        console.log(err);
    })
})

route.post('/addPrice', (req, res, next) => {
    const carPriceData = new carPrice({
        _id: new mongoose.Types.ObjectId,
        time_price: req.body.time_price,
        time_type: req.body.time_type
    });
    carPriceData.save().then((result) => {
        return res.status(201).json({
            response: {
                AddPrice: result
            }
        })
    }).catch((err) => {
        return res.status(500).json({
            status_code: 500,
            error: err
        })
    });
});

route.get('/get', (req, res, next) => {
    Car.find().populate('image category_id price_id').then((result) => {
        res.status(201).json({
            status_code: 201,
            response: {
                data: result
            }
        })
    }).catch((err) => {
        console.log(err);
    });
})


route.put('/carUpdateImage/:id', upload.array('images'), async (req, res, next) => {
    const id = req.params.id;
    const carImageData = [];
    carImage.find({car_id : id}).then((oldImage)=>{
        for (let i = 0; i < oldImage.length; i++) {
            cloudinary.uploader.destroy(oldImage[i].image_id).then((localresult) => {
                console.log(localresult);
            }).catch((err) => {
                console.log(err);
            });
        }
        carImage.deleteMany({ car_id: id }).then(async (resultDelete) => {
            console.log(resultDelete);
            for (var i = 0; i < req.files.length; i++) {
                var locaFilePath = req.files[i].path;
                // Upload the local image to Cloudinary
                // and get image url as response
                var result = await uploadToCloudinary(locaFilePath);
                const imageData = new carImage({
                    _id: new mongoose.Types.ObjectId,
                    car_id: id,
                    image_id: result.id,
                    image: result.url
                });
                carImageData.push(imageData._id);
                imageData.save().then((ImageResult) => {
                    console.log("image has been added");
                }).catch((err) => {
                    console.log(err);
                })
            }
    
            Car.findOneAndUpdate({ _id: id },{
                image : carImageData
            },{upsert : true}).then((result) => {
                return res.status(201).json({
                    status_code : 201,
                    Update_data : result
                });
            }).catch((err) => {
                console.log(err);
            })
        })
    })
});

module.exports = route;