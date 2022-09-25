const { DiscussionForum } = require("../models/discussionForum");
const { ForumComment } = require("../models/forumComment");

const createNewComment = async (req, res) => {
    const { comment, forum } = req.body;
    const foundForum = await DiscussionForum.findById(forum);
    if (!foundForum) return res.status(404).send({ message: "Forum not found" });
    const newComment = new ForumComment({
        comment: comment,
        user: req.user.id,
        forum: forum,
    });
    try {
        const savedComment = await newComment.save();
        res.status(201).send(savedComment);
    } catch (error) {
        return res.status(500).send({
            message: "Internal server error",
        });
    }
};

const getCommentsByForumId = async (req, res) => {
    try {
        const { pageNumber, pageSize } = req.query;
        const pageNo = parseInt(pageNumber) || 1;
        const size = parseInt(pageSize) || 20;
        if (pageNo < 0 || pageNo === 0) {
            return res.status(400).send(new createHttpError.BadRequest("Invalid page number, should start with 1"));
        }
        const skip = size * (pageNo - 1);
        const limit = size;
        const count = await ForumComment.countDocuments({ forum: req.params.id });
        const comments = await ForumComment.find({ forum: req.params.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.status(200).send({
            comments,
            count,
        });
    } catch (error) {
        return res.status(500).send({
            message: "Internal server error",
        });
    }
};

const updateComment = async (req, res) => {
    try {
        const comment = await ForumComment.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).send(comment);
    } catch (error) {
        return res.status(500).send({
            message: "Internal server error",
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const foundCommentByuser = await ForumComment.findOne({ _id: req.params.id, user: req.user.id });
        if (!foundCommentByuser) return res.status(403).send({ message: "you haven't created this comment" });
        await ForumComment.findByIdAndDelete(req.params.id);
        res.status(200).send({
            message: "Comment deleted successfully",
        });
    } catch (error) {
        return res.status(500).send({
            message: "Internal server error",
        });
    }
};

const likeDislikeComment = async (req, res) => {
    try {
        const comment = await ForumComment.findById(req.params.id);
        if (!comment) return res.status(404).send({ message: "Comment not found" });

        if (!comment.likes.includes(req.user.id)) {
            await comment.updateOne({ $push: { likes: req.user.id } });
            res.status(200).send({
                message: "comment has been liked",
            });
        } else {
            await comment.updateOne({ $pull: { likes: req.user.id } });
            res.status(200).send({
                message: "comment has been disliked",
            });
        }
    } catch (error) {
        return res.status(500).send({
            message: "Internal server error",
        });
    }
};

module.exports = {
    createNewComment,
    getCommentsByForumId,
    updateComment,
    deleteComment,
    likeDislikeComment,
};
