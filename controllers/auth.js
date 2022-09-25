const { OAuth2Client } = require("google-auth-library");
const { logger } = require("../logger");
const { User } = require("../models/user");
const { hashPasword, comparePasword } = require("../utils/hashPassword");

const loginWithGoogle = async (req, res, next) => {
    const bearerHeader = req.headers["x-auth-google"];
    if (bearerHeader) {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRETE);
        try {
            const { payload } = await googleClient.verifyIdToken({
                idToken: bearerToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const { sub: googleUserId, email, email_verified, picture, name } = payload;
            if (email_verified) {
                try {
                    let user = await User.findOne({ email });
                    if (user) {
                        const token = await user.generateAccessToken();
                        return res.send({
                            token,
                        });
                    } else {
                        const newUser = new User({
                            name,
                            email,
                            googleId: googleUserId,
                            photo: picture,
                        });
                        await newUser.save();
                        const token = await newUser.generateAccessToken();
                        res.status(201).send({
                            token,
                        });
                    }
                } catch (error) {
                    logger.error(error);
                    next(error);
                }
            } else {
                return res.status(401).send({
                    message: "Email not verified",
                });
            }
        } catch (error) {
            logger.error(error);
            return next(error);
        }
    } else {
        return res.status(401).send({
            message: "Invalid token",
        });
    }
};

const signupController = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).send({
                message: "User already exists",
            });
        }
        const hashedPassword = await hashPasword(password);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        const token = await newUser.generateAccessToken();
        res.status(201).send({
            token,
        });
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const loginController = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({
                message: "Invalid email or password",
            });
        }
        const isPasswordValid = await comparePasword(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({
                message: "Invalid email or password",
            });
        }
        const token = await user.generateAccessToken();
        res.status(200).send({
            token,
        });
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

module.exports = {
    loginWithGoogle,
    signupController,
    loginController,
};
