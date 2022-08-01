const { companyUpdateSchema } = require('./company.validator');
const { userUpdateSchema } = require('./user.validator');
const { announcementUpdateSchema } = require('./announcement.validator');

module.exports = {
    companyUpdateSchema,
    userUpdateSchema,
    announcementUpdateSchema
}