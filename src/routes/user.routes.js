const express = require('express');
const { authForUser } = require('../middlewares/auth.middleware');
const router = new express.Router();
const {
    getUser,
    updateUser,
    deleteUser,
    addProfilePicture,
    deleteProfilePicture,
    confirmUserPassword
} = require('../services/user.service');
const { PROFILE_PICTURE } = require('../constants/folderNames.constants');
const upload = require('../middlewares/upload.middleware');
const { getPaginated } = require('../services/pagination.service');
const { User } = require('../models');

// Get All Users
router.get('/users', async (req, res) => {
  try {
    const results = await getPaginated(User, req, res);

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

// Get User By Id
router.get('/users/:id', async (req, res) => {
    const { params: { id } } = req;

    try {
        const user = await getUser(id);

        if (!user) {
        return res.status(404).json();
        }

        res.json(user);
    } catch (error) {
        res.status(500).json();
    }
});

// Update User
router.patch(
    '/users',
    authForUser,
    async (req, res) => {
      const { body: validatedBody, user: { id } } = req;
  
      try {
        const updatedUser = await updateUser(id, validatedBody);
  
        if (!updatedUser) {
          return res.status(404).json();
        }
  
        await updatedUser.save();
  
        res.json(updatedUser);
      } 
      catch (error) {
        res.status(422).json(error.message);
      }
    }
);

// Delete User
router.delete(
    '/users',
    authForUser,
    async (req, res) => {
      const { id } = req.user;
  
      try {
        const user = await deleteUser(id);
  
        if (!user) {
          return res.status(404).json();
        }
  
        res.status(200).json(user);
      } catch (error) {
        res.status(400).json(error.message);
      }
    }
);

// Add Profile Picture To Login User
router.post(
  '/users/profilePicture',
  authForUser,
  upload.single(PROFILE_PICTURE),
  async (req, res) => {
    const { user: { id }, generatedFileName } = req;

    await addProfilePicture(id, generatedFileName);

    res.json('Profile picture upload succesfully.');
  },
  (error, req, res) => {
    res.status(400).json({ error: error.message });
  }
);

// GET Profile Picture
router.get('/users/:id/profilePicture',
  async (req, res) => {
  const { params: { id } } = req;

  try {
    const user = await getUser(id);

    if (!user.profilePicture) {
      throw new Error('Profile picture does not exist.');
    }
    
    res.set('Content-Type', 'image/png');
    res.redirect(user.profilePictureUrl);
  } catch (error) {
    res.status(404).json();
  }
});

// Delete Profile Picture For Login User
router.delete(
  '/users/profilePicture',
  authForUser,
  async (req, res) => {
    const { user: { id } } = req;

    try {
      await deleteProfilePicture(id, PROFILE_PICTURE);
      res.json('Profile picture deleted succesfully.');
    }
    catch (error) {
      res.status(404).json(error.message);
    }
  }
);

// Confirm User Password
router.get(
  '/users/confirmPassword/:password',
  authForUser,
  async (req, res) => {
    const { user: { email }, params: { password } } = req;

    try {
      var response = {
        message: String,
        isValid: Boolean
      }

      const isValid = await confirmUserPassword(email, password);

      if(isValid == true) {
        response.message = "Succesfully";
        response.isValid = true;

        res.json(response);
      } else {
        response.message = "Password do not match";
        response.isValid = false;

        res.json(response);
      }
    }
    catch (error) {
      res.status(404).json(error.message);
    }
  }
);

module.exports = router;