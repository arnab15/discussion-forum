const { generateFileUploadUrl } = require("../utils/fileUpload");

const getSignedUrlForFileUpload = async (req, res) => {
    try {
        const { fileName } = req.body;
        if (!fileName) {
            return res.status(400).send({
                message: "File name is required",
            });
        }
        const userId = req.user.id;
        const data = await generateFileUploadUrl(fileName, userId);
        res.status(200).send({
            ...data,
        });
    } catch (error) {
        return res.status(500).send({
            message: "Internal server error",
        });
    }
};

module.exports = {
    getSignedUrlForFileUpload,
};
