const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    googleId: {
        type: String,
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
    },
});

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ id: this._id, name: this.name, photo: this.photo }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30d",
    });
};

exports.User = mongoose.model("User", userSchema);
