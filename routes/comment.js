const express = require("express");
const router = express.Router();
const validatrRoute = require("../middlewares/validateRoute");

const commentController = require("../controllers/comentController");
const { isAuthenticated } = require("../middlewares/isAuthenticated");
router.get("/form/:id", commentController.getCommentsByForumId);
router.post("/", isAuthenticated, validatrRoute("comment"), commentController.createNewComment);
router.put("/:id", isAuthenticated, validatrRoute("comment"), commentController.updateComment);
router.delete("/:id", isAuthenticated, commentController.deleteComment);
router.put("/:id/like-dislike/", isAuthenticated, commentController.likeDislikeComment);
exports.commentRouter = router;
