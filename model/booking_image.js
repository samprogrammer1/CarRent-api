const mongoose = require('mongoose');

const bookingImageSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    booking_id : {
        type: mongoose.Schema.Types.ObjectId,
        required : true
    },
    image_id : {
        type : String,
        required : true
    },
    image_url : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('booking_id_image',bookingImageSchema)