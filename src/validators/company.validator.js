const Joi = require('joi');

const companyUpdateSchema = Joi.object({
  name: Joi.string().min(3).trim()
});

module.exports = {
    companyUpdateSchema
}