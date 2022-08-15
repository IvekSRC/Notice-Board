const express = require('express');
const { PICTURE } = require('../constants/folderNames.constants');
const { authForCompany } = require('../middlewares/auth.middleware');
const router = new express.Router();
const upload = require('../middlewares/upload.middleware');
const {
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    addPicture,
    deletePicture,
    getPicture,
    getAnnouncement,
    getTags
} = require('../services/announcement.service');
const { getPaginated } = require('../services/pagination.service');
const { Announcement } = require('../models');

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
      const results = await getPaginated(Announcement, req, res);
  
      if (!results) {
        return res.status(404).json();
      }
  
      res.json({
        TotalPages: results.totalPages,
        CurrentPage: results.currentPage,
        Items: results.results,
      });
    } catch (error) {
      res.status(500).json();
    }
});

// Get Announcement
router.get('/announcements/:id', async (req, res) => {
  const { params: { id: idAnnouncement } } = req;

  try {
    const announcement = await getAnnouncement(idAnnouncement);
    
    return res.status(200).json(announcement);
  } catch (error) {
    res.status(404).json();
  }
});

// Get My Announcement
router.get('/announcementsme', authForCompany, async (req, res) => {
    const { company: { id: companyId } } = req;

    try {
      req.parentReference = { companyId: companyId }
      const results = await getPaginated(Announcement, req, res);
  
      if (!results) {
        return res.status(404).json();
      }
  
      res.json({
        TotalPages: results.totalPages,
        CurrentPage: results.currentPage,
        Items: results.results,
      });
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

// Add Picture To Announcement
router.post(
  '/announcements/:id/picture',
  authForCompany,
  upload.single(PICTURE),
  async (req, res) => {
    const { company: { _id: companyId }, params: { id: idAnnouncement }, generatedFileName } = req;
    
    try {
      const announcement = await addPicture(companyId, idAnnouncement, generatedFileName);
  
      if (!announcement) {
        return res.status(404).json();
      }
  
      res.status(200).json("Announcement picture upload successfully.");
    } catch (error) {
      res.status(400).json(error.message);
    }
  },
  (error, req, res) => {
    res.status(400).json({ error: error.message });
  }
);

// GET Picture of Announcement
router.get('/announcements/:id/picture', authForCompany, async (req, res) => {
  const { params: { id: idAnnouncement }, company: { _id: companyId } } = req;
  
  try {
    const announcement = await getPicture(idAnnouncement, companyId);
    
    if (!announcement.picture) {
      throw new Error('Announcement picture does not exist.');
    }
    
    res.set('Content-Type', 'image/png');
    res.redirect(announcement.pictureUrl);
  } catch (error) {
    res.status(404).json();
  }
});

// GET Picture of Announcement (No Authorization)
router.get('/announcements/:id/publicPicture', async (req, res) => {
  const { params: { id: idAnnouncement } } = req;
  
  try {
    const announcement = await getAnnouncement(idAnnouncement)
    
    if (!announcement.picture) {
      throw new Error('Announcement picture does not exist.');
    }
    
    res.set('Content-Type', 'image/png');
    res.redirect(announcement.pictureUrl);
  } catch (error) {
    res.status(404).json();
  }
});

// Delete Picture for Announcement
router.delete(
  '/announcements/:id/picture',
  authForCompany,
  async (req, res) => {
    const { params: { id }, company: { _id: companyId } } = req;
    
    await deletePicture(id, companyId);
    res.json('Announcement picture deleted succesfully.');
  }
);

// Get Tags
router.get(
  '/announcementstags',
  async (req, res) => {
    var tags = await getTags();
    var response = [];
    tags.forEach(tag => {
      response.push({ title: tag })
    });

    res.json(response);
  }
);

module.exports = router;