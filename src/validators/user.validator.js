const Joi = require('joi');

const userUpdateSchema = Joi.object({
    nickName: Joi.string().min(3).trim()
});

module.exports = {
    userUpdateSchema
}