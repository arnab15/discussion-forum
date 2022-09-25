const { User } = require("../models/user");

const updateProfilePicture = async (req, res) => {
    try {
        const { image } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, {
            $set: {
                photo: image,
            },
        });
        res.status(200).send({
            message: "Profile picture updated successfully",
        });
    } catch (error) {
        return res.status(500).send({
            message: "Internal server error",
        });
    }
};
