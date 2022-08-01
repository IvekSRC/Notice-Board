const express = require('express');
const { authForCompany } = require('../middlewares/auth.middleware');
const router = new express.Router();
const upload = require('../middlewares/upload.middleware');
const {
    createAnnouncement,
    updateAnnouncement,
    getAnnouncement,
    getMyAnnouncement,
    deleteAnnouncement
} = require('../services/announcement.service');

// Create Announcement
router.post('/announcements', authForCompany, async (req, res) => {
    const { body, company: { id: companyId } } = req;
  
    try {
      const announcement = await createAnnouncement(body, companyId);
      
      res.status(201).json(announcement);
    } catch (error) {
      res.status(400).json(error.message);
    }
});

// Update Announcement
router.patch(
    '/announcements/:id',
    authForCompany,
    async (req, res) => {
      const { body: validatedBody, company: { _id: companyId }, params: { id: idAnnouncement } } = req;
  
      try {
        const updatedAnnouncement = await updateAnnouncement(companyId, validatedBody, idAnnouncement);
  
        if (!updatedAnnouncement) {
          return res.status(404).json();
        }
  
        await updatedAnnouncement.save();
  
        res.json(updatedAnnouncement);
      } 
      catch (error) {
        res.status(422).json(error.message);
      }
    }
);

// Get All Announcement
router.get('/announcements', async (req, res) => {
    try {
      const announcement = await getAnnouncement();
  
      if (!announcement) {
        return res.status(404).json();
      }
  
      return res.json(announcement);
    } catch (error) {
      res.status(500).json();
    }
});

// Get My Announcement
router.get('/announcements/me', authForCompany, async (req, res) => {
    const { company: { id: companyId } } = req;

    try {
      const announcement = await getMyAnnouncement(companyId);
  
      if (!announcement) {
        return res.status(404).json();
      }
  
      return res.json(announcement);
    } catch (error) {
      res.status(500).json();
    }
});

// Delete Announcement
router.delete('/announcements/:id', authForCompany, async (req, res) => {
    const { company: { _id: companyId }, params: { id: announcementId } } = req;
  
    try {
      const announcement = await deleteAnnouncement(companyId, announcementId);
  
      if (!announcement) {
        return res.status(404).json();
      }
  
      res.status(200).json(announcement);
    } catch (error) {
      res.status(400).json(error.message);
    }
});

module.exports = router;