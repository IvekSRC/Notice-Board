const Joi = require('joi');

const companyUpdateSchema = Joi.object({
  name: Joi.string().min(3).trim(),
  firstName: Joi.string().min(2),
  lastName: Joi.string().min(2),
  gender: Joi.string(),
  country: Joi.string()
});

module.exports = {
    companyUpdateSchema
}