const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const forumSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    status: Joi.string().valid("active", "blocked", "deleted").default("active"),
});
module.exports = forumSchema;
