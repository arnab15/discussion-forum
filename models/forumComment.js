const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const forumCommentSchema = new Schema({
    comment: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    forum: {
        type: Schema.Types.ObjectId,
        ref: "DiscussionForum",
        required: true,
    },
});

forumCommentSchema.virtual("likesCount").get(function () {
    return this.likes.length;
});
exports.ForumComment = mongoose.model("ForumComment", forumCommentSchema);
