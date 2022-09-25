const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const forumSchema = Joi.object({
    comment: Joi.string().required(),
    forum: Joi.objectId().required(),
});
module.exports = forumSchema;
