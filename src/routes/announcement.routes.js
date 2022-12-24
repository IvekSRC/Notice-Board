const express = require('express');
const { PICTURE } = require('../constants/folderNames.constants');
const { authForCompany, authForUser } = require('../middlewares/auth.middleware');
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
    getAllAnnouncements,
    getTags,
    addToFavorites,
    removeFromFavorites,
    isAddedToFavorites,
    extendAnnouncement,
    matchedAnnouncements
} = require('../services/announcement.service');
const { getPaginated } = require('../services/pagination.service');
const { Announcement } = require('../models');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { transcript } = require('../services/speechToText.js');

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

// Get Announcement - Full text search
router.get('/announcements/search', async (req, res) => {
  const search = req.query.search;

  try {
    var results;

    if(search == '' || search == null) {
      results = await getAllAnnouncements();
    } else {     
      results = await matchedAnnouncements(search);
    }

    return res.status(200).json(results);
  } catch (error) {
    res.status(400).json(error.message);
  }
})

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
router.get('/announcements/all/me', authForCompany, async (req, res) => {
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

// Get Favorites
router.get('/announcements/favorites/all', authForUser, async (req, res) => {
  const { user: { id: userId } } = req;

  try {
    req.parentReference = { userIds: userId }
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

// Add to favorites
router.patch(
  '/announcements/favorites/add/:id',
  authForUser,
  async (req, res) => {
    const { params: { id: idAnnouncement } , user: { _id: userId }} = req;
    
    try {
      await addToFavorites(userId, idAnnouncement);

      res.json("Successfully added to your favorite list.");
    } catch (error) {
      res.status(404).json(error.message);
    }
  }
)

// Remove from favorites
router.patch(
  '/announcements/favorites/delete/:id',
  authForUser,
  async (req, res) => {
    const { params: { id: idAnnouncement } , user: { _id: userId }} = req;
    
    try {
      await removeFromFavorites(userId, idAnnouncement);

      res.json("Successfully deleted from your favorite list.");
    } catch (error) {
      res.status(404).json(error.message);
    }
  }
)

// Is added to favorites
router.get(
  '/announcements/favorites/get/:id',
  authForUser,
  async (req, res) => {
    const { params: { id: idAnnouncement } , user: { _id: userId }} = req;

    try {
      const isAdded = await isAddedToFavorites(userId, idAnnouncement);

      if(isAdded) {
        res.json({
          message: "Favorite list contain that announcement.",
          isAdded: isAdded
        })
      } else {
        res.json({
          message: "Favorite list does not contain that announcement.",
          isAdded: isAdded
        })
      }
    } catch (error) {
      res.status(404).json(error.message);
    }
  }
)

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
    const { filename: image } = req.file;
    
    try {
      const announcement = await addPicture(companyId, idAnnouncement, generatedFileName);

      await sharp(req.file.path)
        .resize(975, 600)
        .jpeg({ quality: 90 })
        .toFile(
            path.resolve(req.file.destination, PICTURE, image)
        )
        fs.unlinkSync(req.file.path)
  
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
  '/announcements/tags/all',
  async (req, res) => {
    var tags = await getTags();
    var response = [];
    tags.forEach(tag => {
      response.push({ title: tag })
    });

    res.json(response);
  }
);

// Extend time for announcement
router.patch(
  '/announcements/:id/extendTime',
  authForCompany,
  async (req, res) => {
    const { company: { _id: companyId }, params: { id: idAnnouncement }, body: { newTime } } = req;
    
    try {
      const announcement = await extendAnnouncement(companyId, idAnnouncement, newTime);
  
      if (!announcement) {
        return res.status(404).json();
      }
  
      res.status(200).json({
        message: "Announcement time extended successfully.",
        newEndTime: announcement.endTime
      });
    } catch (error) {
      res.status(400).json(error.message);
    }
  },
  (error, req, res) => {
    res.status(400).json({ error: error.message });
  }
);

module.exports = router;