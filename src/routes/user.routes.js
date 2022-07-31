const express = require('express');
const { authForUser } = require('../middlewares/auth.middleware');
const router = new express.Router();
const {
    getUsers,
    getUser,
    updateUser,
    deleteUser
} = require('../services/user.service');

// Get All Users
router.get('/users', async (req, res) => {
  try {
    const users = await getUsers();

    if (!users) {
      return res.status(404).json();
    }

    return res.json(users);
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

module.exports = router;