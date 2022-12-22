const authService = require('./auth.service');
const companyService = require('./company.service');
const userService = require('./user.service');
const announcementService = require('./announcement.service');
const expiresAnnouncement = require('./cron.service');
const getPaginated = require('./pagination.service');
const deleteFile = require('./picture.service');
const speechToText = require('./speechToText');

module.exports = {
    authService,
    companyService,
    userService,
    announcementService,
    expiresAnnouncement,
    getPaginated,
    deleteFile,
    speechToText
}