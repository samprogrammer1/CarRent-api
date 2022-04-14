const route = require("express").Router();
const mongoose = require("mongoose");

//model
const carBooking = require('./../../model/car_booking');
const User = require("../../model/User");

route.get('/:id', (req, res, next) => {
    User.findOne({ _id: req.params.id }).then((result) => {
        return res.status(200).json({
            status_code: 200,
            response: {
                data: result
            }
        });
    }).catch((err) => {
        return res.status(500).json({
            error: err
        });
    });
});

route.put('/:id', (req, res, next) => {
    const id = req.params.id;
    User.findByIdAndUpdate(id, {
        name : req.body.name,
        image : req.body.image,
    }, { upsert: true }).then((result) => {
        return res.status(200).json({
            status_code: 201,
            response: {
                data: result
            }
        })
    }).catch((err) => {
        return res.status(500).json({
            status_code: 500,
            error: err
        });
    });
});

route.get('/myBooking/:id', (req, res, next) => {
    id = req.params.id;
    carBooking.find({user_id : id}).populate('car_id user_id front_id_img back_id_img').populate({
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
    }).then((result) => {
        return res.status(200).json({
            status_code : 200,
            response : {
                mybooking : result
            }
        })
    }).catch((err) => {
        console.log(error);
    });
})

module.exports = route;