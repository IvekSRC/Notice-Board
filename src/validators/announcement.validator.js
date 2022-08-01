const Joi = require('joi');

const announcementUpdateSchema = Joi.object({
  name: Joi.string().min(3).trim(),
  description: Joi.string().max(500),
  category: Joi.string().min(3),
});

module.exports = {
    announcementUpdateSchema
}