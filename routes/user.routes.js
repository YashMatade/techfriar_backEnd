const userController = require("../controllers/user.controller");
const router = require("express").Router();
const auth = require("../middleware/auth.js")

router.post("/login", userController.login);
router.post("/signup", userController.signUp);
router.post("/forgotpass", userController.forgotPass);
router.post("/resetpass", userController.resetPass);
module.exports = router;