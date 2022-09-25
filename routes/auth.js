const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const validatrRoute = require("../middlewares/validateRoute");

router.post("/google-login-signup", authController.loginWithGoogle);
router.post("/signup", validatrRoute("signUp"), authController.signupController);
router.post("/login", validatrRoute("login"), authController.loginController);

exports.authRouter = router;
