const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/fileUploadController");
const { isAuthenticated } = require("../middlewares/isAuthenticated");
router.post("/image-upload", isAuthenticated, uploadController.getSignedUrlForFileUpload);
exports.uploadRouter = router;
