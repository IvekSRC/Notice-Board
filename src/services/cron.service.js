const { Announcement } = require('../models/index');
var CronJob = require('cron').CronJob;

var expiresAnnouncement = async (announcementId, endTime) => {
    var job = new CronJob(
        endTime,
        async function () {
            const announcement = await Announcement.findById(announcementId);
            announcement.status = false;
            
            await announcement.save();
        }    
    )

    job.start();
}

module.exports = {
    expiresAnnouncement
}