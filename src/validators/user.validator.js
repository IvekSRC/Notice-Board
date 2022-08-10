const Joi = require('joi');

const userUpdateSchema = Joi.object({
    nickName: Joi.string().min(3).trim(),
    firstName: Joi.string().min(2),
    lastName: Joi.string().min(2),
    gender: Joi.string(),
    country: Joi.string()
});

module.exports = {
    userUpdateSchema
}