const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const signUpSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});
module.exports = {
    signUpSchema,
    loginSchema,
};
