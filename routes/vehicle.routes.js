const vehicleController = require("../controllers/vehicle.controller");
const auth = require("../middleware/auth");
const router = require("express").Router();
const multer = require("multer");
const imgconfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads/vehicles");
    },
    filename: (req, file, callback) => {
        callback(null, `image-${Date.now()}.${file.originalname}`);
    },
});
const isImage = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true);
    } else {
        callback(new Error("Only image is allowed"));
    }
};

const upload = multer({
    storage: imgconfig,
    fileFilter: isImage,
});

router.get("/getall", auth, vehicleController.getAllVehicles)
router.post("/add", auth,
    upload.single("primaryImage"),
    vehicleController.addVehicle);
router.post("/update", auth,
    upload.single("primaryImage"),
    vehicleController.update);
router.post("/delete", auth, vehicleController.delete);
router.post("/getvehicle", auth, vehicleController.getVehicle);
module.exports = router;