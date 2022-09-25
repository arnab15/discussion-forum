const { DiscussionForum } = require("../models/discussionForum");

const createForum = async (req, res) => {
    const { title, description, status } = req.body;
    const newForum = new DiscussionForum({
        title: title,
        description: description,
        createdBy: req.user.id,
        status,
    });
    try {
        const savedForum = await newForum.save();
        res.status(201).send(savedForum);
    } catch (error) {
        return res.status(500).send({
            message: "Internal server error",
        });
    }
};

const getDiscussionForum = async (req, res) => {
    try {
        const { pageNumber, pageSize, search } = req.query;
        const pageNo = parseInt(pageNumber) || 1;
        const size = parseInt(pageSize) || 20;
        if (pageNo < 0 || pageNo === 0) {
            return res.status(400).send(new createHttpError.BadRequest("Invalid page number, should start with 1"));
        }
        const skip = size * (pageNo - 1);
        const limit = size;
        if (search) {
            const forums = await DiscussionForum.find({ $text: { $search: search } })
                .populate("createdBy", "name")
                .populate("likes", "name")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            res.status(200).send({
                forums,
                total: forums.length,
            });
            return;
        }
        const count = await DiscussionForum.countDocuments({});
        const forum = await DiscussionForum.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
        res.status(200).send({ forum, count });
    } catch (error) {
        return res.status(500).send({
            message: "Internal server error",
        });
    }
};

const getForumById = async (req, res) => {
    try {
        const forum = await DiscussionForum.findById(req.params.id);
        res.status(200).send(forum);
    } catch (error) {
        return res.status(500).send({
            message: "Internal server error",
        });
    }
};

const updateForum = async (req, res) => {
    try {
        const forum = await DiscussionForum.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).send(forum);
    } catch (error) {
        return res.status(500).send({
            message: "Internal server error",
        });
    }
};

const deleteForum = async (req, res) => {
    try {
        const forum = await DiscussionForum.findById(req.params.id);
        if (forum.createdBy === req.user.id) {
            await forum.delete();
            return res.status(200).send({
                message: "Forum deleted successfully",
            });
        }
        return res.status(403).send({
            message: "You can delete only your forum,forbidden",
        });
    } catch (error) {
        return res.status(500).send({
            message: "Internal server error",
        });
    }
};

const likeDislikeForum = async (req, res) => {
    try {
        const forum = await DiscussionForum.findById(req.params.id);
        if (!forum.likes.includes(req.user.id)) {
            await forum.updateOne({ $push: { likes: req.user.id } });
            res.status(200).send({
                message: "The post has been liked",
            });
        } else {
            await forum.updateOne({ $pull: { likes: req.user.id } });
            res.status(200).send({
                message: "The post has been disliked",
            });
        }
    } catch (error) {
        return res.status(500).send({
            message: "Internal server error",
        });
    }
};

module.exports = {
    createForum,
    getDiscussionForum,
    getForumById,
    updateForum,
    deleteForum,
    likeDislikeForum,
};
