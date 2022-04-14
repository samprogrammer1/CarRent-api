const express = require('express');
const route = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
// route Controller
const user = require('./controller/auth/login');
const car = require('./controller/car/car');
const carModel = require('./controller/car/car_model');
const carEdit = require('./controller/car/car_edit');
const carBooking = require('./controller/car/carbooking');
const myProfile = require('./controller/auth/myprofile');

const cloudinary = require("cloudinary").v2;

dotenv.config();
mongoose.connect('mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false').then(() => {
    console.log('mongoose was connected');    
}).catch((err) => {
    console.log(err);
});

cloudinary.config({ 
    cloud_name: 'sampromany', 
    api_key: '821784622823496', 
    api_secret: 'M_p15gi_NBcNA2QiuviLvhJsg8w' 
});
route.use(bodyParser.json());
route.use(bodyParser.urlencoded({extended: false}));


route.get('/',(req,res)=>{
    res.status(200).json({
        msg : "now working route"
    })
});

route.use('/User',user);
route.use('/Car',car);
route.use('/CarEdit',carEdit);
route.use('/CarBooking', carBooking);
route.use('/MyProfile',myProfile)


route.use((req,res,next) =>{
    res.status(401).json({
        error : "Route is not defind"
    })
});

module.exports = route;