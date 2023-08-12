const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    availableQuantity: {
        type: Number,
        required: true
    },
    primaryImage: {
        type: String
    },
    secondaryImages: [String],
    manufacturer: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
});
const VehicleModel = mongoose.model('Vehicle', vehicleSchema);
module.exports = VehicleModel;
