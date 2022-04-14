const mongoose = require('mongoose');

const carBookingSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    car_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "car",
        required : true
    },
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true
    },
    total_time :{
        type : Number,
        required : true,
    },
    total_price : {
        type : Number,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    front_id_img : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "booking_id_image",
        required : true
    },
    back_id_img : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "booking_id_image",
        required : true
    },
    isConfirmation : {
        type : Boolean,
        default : false,
        required : true
    },
    isSuccess : {
        type : Boolean,
        default : false
    }
},
{timestamps : true}
);

module.exports = mongoose.model('carBooking', carBookingSchema);