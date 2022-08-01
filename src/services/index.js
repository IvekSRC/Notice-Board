const authService = require('./auth.service');
const companyService = require('./company.service');
const userService = require('./user.service');
const announcementService = require('./announcement.service');
const cronService = require('./cron.service');

module.exports = {
    authService,
    companyService,
    userService,
    announcementService,
    cronService
}