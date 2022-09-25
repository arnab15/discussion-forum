const express = require("express");
const validatrRoute = require("../middlewares/validateRoute");

const forumController = require("../controllers/forumController");
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const router = express.Router();

router.post("/", isAuthenticated, validatrRoute("forum"), forumController.createForum);
router.get("/", forumController.getDiscussionForum);
router.get("/:id", forumController.getForumById);
router.put("/:id", isAuthenticated, validatrRoute("forum"), forumController.updateForum);
router.delete("/:id", isAuthenticated, forumController.deleteForum);
exports.fourmRouter = router;
