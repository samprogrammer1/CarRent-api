const mongoose = require('mongoose');

const carImageSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    car_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "car",
    },
    image_id: {
        type: String,
    },
    image: {
        type: String,
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("car_image", carImageSchema);