const VehicleModel = require('../models/Vehicle.model');
exports.getAllVehicles = async (req, res) => {
    try {
        const { name, manufacturer, model, price } = req.query;

        let condition = {}
        if (name !== undefined) {
            condition['name'] = {
                $regex: ".*" + name + ".*",
                $options: "i",
            }
        }
        if (manufacturer !== undefined) {
            condition['manufacturer'] = {
                $regex: ".*" + manufacturer + ".*",
                $options: "i",
            }
        }
        if (model !== undefined) {
            condition['model'] = {
                $regex: ".*" + model + ".*",
                $options: "i",
            }
        }
        let num = 1;
        if (price === "asc") {
            num = 1
        } else {
            num = -1
        }
        const vehicles = await VehicleModel.find(condition).sort({ price: num })
        if (vehicles.length === 0) {
            res.status(200).json({ err: 300, msg: "Vehicles not found" })
        } else {
            res.status(200).json({ err: 200, msg: "Vehicle found successfully", data: vehicles });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

exports.addVehicle = async (req, res) => {
    try {
        const { name, description, price, availableQuantity, manufacturer, model } = req.body;

        const newVehicle = new VehicleModel({
            name,
            description,
            price,
            availableQuantity,
            manufacturer,
            model
        });
        let primaryFileName;

        if (req.file) {
            console.log(req.file);
            primaryFileName = req.file.filename;
        }
        if (primaryFileName) {
            newVehicle.primaryImage = primaryFileName;
        }

        const savedVehicle = await newVehicle.save();
        res.status(200).json({ err: 200, msg: "Vehicle added successfully", data: savedVehicle });

    } catch (error) {
        res.status(500).json({ err: 500, msg: error.toString() });
    }
};


exports.update = async (req, res) => {
    try {
        const { vehicleId, name, description, price, availableQuantity, manufacturer, model } = req.body;
        let updateVehicle = {
            name, description, price, availableQuantity, manufacturer, model
        }
        let primaryFileName;
        if (req.file) {
            console.log(req.file);
            primaryFileName = req.file.filename;
        }
        if (primaryFileName) {
            updateVehicle.primaryImage = primaryFileName;
        }
        const updatedVehicle = await VehicleModel.findByIdAndUpdate(vehicleId, updateVehicle, { new: true });
        if (!updatedVehicle) {
            return res.status(200).json({ err: 300, msg: "Failed to update" });
        }
        return res.status(200).json({ err: 200, msg: "Vehicle updated successfully", data: updatedVehicle });
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: 500, msg: "Internal server error" });
    }
}

exports.delete = async (req, res) => {
    try {
        const { vehicleId } = req.body;
        await VehicleModel.findByIdAndDelete(vehicleId);
        res.status(200).json({ err: 200, msg: "Vehicle deleted successfully" });
    } catch (error) {
        res.status(500).json({ err: 500, msg: error.toString() });
    }
}

exports.getVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.body;
        let vehicle = await VehicleModel.findById(vehicleId);
        if (vehicle) {
            res.status(200).json({ err: 200, msg: "Vehicle found", data: vehicle })
        } else {
            res.status(200).json({ err: 300, msg: "Vehicle not found" })
        }
    } catch (error) {
        res.status(500).json({ err: 500, msg: error.toString() })
    }
}