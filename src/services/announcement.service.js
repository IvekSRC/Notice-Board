const { Announcement } = require('../models');
const expiresAnnouncement = require('./cron.service');
const { announcementUpdateSchema } = require('../validators');
const { PICTURE } = require('../constants/folderNames.constants');
const deleteFile = require('./picture.service');

const createAnnouncement = async (body, id) => {
    // The default end time will be one minute after the auction is created
    // If the announcement not exist
    const defaultEndTime = new Date(Date.now() + 60000);
  
    let newAnnouncement = {
      name: body.name,
      description: body.description,
      category: body.category,
      startTime: Date.now(),
      endTime: body.endTime || defaultEndTime,
      private: body.private,
      companyId: id,
      tags: body.tags
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
      
      const validated = await announcementUpdateSchema.validateAsync(validatedBody);
      
      const updates = Object.keys(validated);
      updates.forEach((update) => {
        announcement[update] = validated[update];
      });
  
      return announcement;
    } catch (err) {
      throw new Error(err.message);
    }
}

const getAnnouncement =  async (announcementId) => {
    return await Announcement.findById({ _id: announcementId });
}

const getMyAnnouncement = async (idOfCompany) => {
    return await Announcement.find({ companyId: idOfCompany });
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
    if(announcement.picture) {
      await deleteFile(PICTURE, announcement.picture);
    }

    announcement.picture = picture;
    await announcement.save();
    return announcement;
  }

  return null;
}

const getPicture = async (idAnnouncement, companyId) => {
  const announcement = await Announcement.findById(idAnnouncement);

  if(announcement.private == true) {  
    if (announcement.companyId.toString() != companyId.toString()) {
      throw new Error('You can get picture just for your announcement.');
    }
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
  
  await deleteFile(PICTURE, announcement.picture);
  announcement.picture = undefined;
  await announcement.save();
}

const getTags = async () => {
  const announcements = await Announcement.find();
  const listOfTags = [];
  announcements.forEach(announcement => {
    announcement.tags.forEach(tag => {
      if(!listOfTags.includes(tag)) {
        listOfTags.push(tag);
      }
    });
  });
  return listOfTags;
}

const addToFavorites = async (userId, idAnnouncement) => {
  const announcement = await Announcement.findById(idAnnouncement);

  if (!announcement) {
    throw new Error("Can't found.");
  }

  if(announcement.userIds.includes(userId)) {
    throw new Error("Announcement is already in your favorite list.");
  }

  announcement.userIds.push(userId);
  await announcement.save();
}

const removeFromFavorites = async (userId, idAnnouncement) => {
  const announcement = await Announcement.findById(idAnnouncement);

  if (!announcement) {
    throw new Error("Can't found.");
  }

  if(!announcement.userIds.includes(userId)) {
    throw new Error("Favorite list does not contain forwarded announcemnt.");
  }

  announcement.userIds.pop(userId);
  await announcement.save();
}

const isAddedToFavorites = async (userId, idAnnouncement) => {
  const announcement = await Announcement.findById(idAnnouncement);

  if (!announcement) {
    throw new Error("Can't found.");
  }

  if(announcement.userIds.includes(userId)) {
    return true;
  } else {
    return false;
  }
}

const extendAnnouncement = async (companyId, idAnnouncement, newTime) => {
  const announcement = await Announcement.findById(idAnnouncement);
  
  if (announcement.companyId.toString() != companyId.toString()) {
    throw new Error('You can modify just your announcement.');
  }

  if(Date.parse(newTime) < Date.now()) {
    throw new Error("The date must be greater than today's date.");
  }

  if(announcement) {
    announcement.endTime = newTime;
    await announcement.save();
    return announcement;
  }

  return null;
}

module.exports = {
    createAnnouncement,
    updateAnnouncement,
    getAnnouncement,
    getMyAnnouncement,
    deleteAnnouncement,
    addPicture,
    deletePicture,
    getPicture,
    getTags,
    addToFavorites,
    removeFromFavorites,
    isAddedToFavorites,
    extendAnnouncement
};