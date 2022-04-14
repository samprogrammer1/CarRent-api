const mongoose = require('mongoose');

const carPriceSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    time_price: {
        type: Number,
        required: true
    },
    time_type: {
        type: String,
        required: true
    }
},
    { timestamps: true }
);



module.exports = mongoose.model("car_prices", carPriceSchema);