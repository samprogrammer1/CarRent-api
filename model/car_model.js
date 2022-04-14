const mongoose = require('mongoose');

const carModelSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    company_name: {
        type: String,
        required: true
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("car_model", carModelSchema);