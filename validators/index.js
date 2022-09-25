const forum = require("./forumValidator");
const auth = require("./authValidator");
const comment = require("./commentValidator");

module.exports = {
    forum,
    comment,
    login: auth.loginSchema,
    signUp: auth.signUpSchema,
};
