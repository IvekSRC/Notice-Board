const { Announcement } = require('../models');
const fs = require('fs');
const expiresAnnouncement = require('./cron.service');
const { announcementUpdateSchema } = require('../validators');
const { PICTURE } = require('../constants/folderNames.constants');

const createAnnouncement = async (body, id) => {
    // The default end time will be one minute after the auction is created
    const defaultEndTime = new Date(Date.now() + 60000);
  
    let newAnnouncement = {
      name: body.name,
      description: body.description,
      category: body.category,
      startTime: Date.now(),
      endTime: body.endTime || defaultEndTime,
      status: true,
      companyId: id,
    };
    const announcement = new Announcement(newAnnouncement);
    expiresAnnouncement(announcement._id, announcement.endTime);
  
    await announcement.save();
  
    return announcement;
}

const updateAnnouncement = async (idCompany, validatedBody, idAnnouncement) => {
    try {
      const announcement = await Announcement.findById(idAnnouncement);
  
      if (announcement.companyId._id.toString() != idCompany._id.toString()) {
        throw new Error('You can modify just your items.');
      }
      console.log('stigo')
      const validated = await announcementUpdateSchema.validateAsync(validatedBody);
      console.log('stigo2')
      const updates = Object.keys(validated);
      updates.forEach((update) => {
        announcement[update] = validated[update];
      });
  
      return announcement;
    } catch (err) {
      throw new Error(err.message);
    }
}

const getAnnouncement =  async () => {
    return Announcement.find({});
}

const getMyAnnouncement = async (idOfCompany) => {
    return Announcement.find({ companyId: idOfCompany });
}

const deleteAnnouncement = async (companyId, announcementId) => {
    const announcement = await Announcement.findById(announcementId);
    
    if (announcement.companyId.toString() != companyId.toString()) {
      throw new Error('You can delete just your items.');
    }
  
    if(announcement) {
      const forSend = announcement;
      announcement.delete();
      return forSend;
    }
  
    return null;
}

const addPicture = async (companyId, idAnnouncement, picture) => {
  const announcement = await Announcement.findById(idAnnouncement);
  
  if (announcement.companyId.toString() != companyId.toString()) {
    throw new Error('You can modify just your announcement.');
  }

  if(announcement) {
    announcement.picture = picture;
    await announcement.save();
    return announcement;
  }

  return null;
}

const getPicture = async (idAnnouncement, companyId) => {
  const announcement = await Announcement.findById(idAnnouncement);
  
  if (announcement.companyId.toString() != companyId.toString()) {
    throw new Error('You can get picture just for your announcement.');
  }

  if(announcement.picture) {
    return announcement;
  }

  return null;
}

const deletePicture = async (announcementId, companyId) => {
  const announcement = await Announcement.findById(announcementId);

  if (!announcement || !announcement.picture) {
    throw new Error("Can't found.");
  }
  
  if (announcement.companyId.toString() != companyId.toString()) {
    throw new Error('You can delete picture just for your announcement.');
  }
  
  fs.unlink(
    `public/images/${PICTURE}/${announcement.picture}`,
    async function(err) {
      if(err) {
        throw new Error(err.message);
      }
      else {
        announcement.picture = undefined;
        await announcement.save();
      }
    }
  )
}

module.exports = {
    createAnnouncement,
    updateAnnouncement,
    getAnnouncement,
    getMyAnnouncement,
    deleteAnnouncement,
    addPicture,
    deletePicture,
    getPicture
};