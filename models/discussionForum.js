const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const discussionForumSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "blocked", "deleted"],
            default: "active",
        },
        createdBy: {
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
    },
    {
        timestamps: true,
    }
);

discussionForumSchema.virtual("likesCount").get(function () {
    return this.likes.length;
});

discussionForumSchema.index({ title: "text", description: "text" });

exports.DiscussionForum = mongoose.model("DiscussionForum", discussionForumSchema);
