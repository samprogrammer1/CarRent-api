//model
const car = require('../../model/car');
const carImage = require('../../model/car_image');

//entension
const route = require('express').Router();
const cloudinary = require("cloudinary").v2;
const uploadArray = require("./car").upload;


//routes

route.put('/carDetails/:id', (req, res, next) => {
    id = req.params.id;
    car.findByIdAndUpdate(id,
        req.body, { upsert: true }
    ).then((result) => {
        return res.status(201).json({
            status_code: 201,
            response: {
                data_added: result
            }
        })
    }).catch((err) => {
        console.log(err);
    });
});

route.delete('/carDelete/:id', (req, res, next) => {
    var id = req.params.id;
    car.deleteOne({ _id: id }).then((result) => {
        carImage.find({ car_id: id }).then((imageresult) => {
            console.log(imageresult.length);
            for (let index = 0; index < imageresult.length; index++) {
                cloudinary.uploader.destroy(imageresult[index].image_id).then((localresult) => {
                    console.log(localresult);
                }).catch((err) => {
                    console.log(err);
                });
            }
            carImage.deleteMany({ car_id: id }).then((Deleteresult) => {
                console.log(Deleteresult);
            }).catch((err) =>{
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);
        });
        return res.status(201).json({
            status_code: 201,
            massage: "this data has been deleted"
        })
    }).catch((err) => {
        return res.status(500).json({
            error: err
        })
    });
});



module.exports = route;