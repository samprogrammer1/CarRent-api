const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    car_name: {
        type: String,
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "car_model",
        required : true
    },
    condition: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    engin_size: {
        type: String,
        required: true,
    },
    production_year: {
        type: Number,
        required: true
    },
    price_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "car_prices"
    },
    image: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "car_image",
    }],
    isAvailable: {
        type: Boolean,
        required: true
    },
},
    { timestamps: true }
);



module.exports = mongoose.model('car', carSchema);