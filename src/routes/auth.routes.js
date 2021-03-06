const express = require('express');
const router = new express.Router();
const { Company, User } = require('../models/index');
const { generateAuthToken, findByCredentials } = require('../services/auth.service');

// Register Company
router.post('/company/register', async (req, res) => {
    const company = new Company(req.body);

    try {
        const token = await generateAuthToken(company);
        await company.save();
        res.status(201).json({ company: company, token });
    } catch (error) {
        res.status(400).json(error.message);
    }
});

// Login Company
router.post('/company/login', async (req, res) => {
    try {
      const company = await findByCredentials(
        req.body.email,
        req.body.password,
        Company
      );
  
      const token = await generateAuthToken(company);
  
      res.json({
        company: company,
        token,
      });
    } catch (error) {
      res.status(400).json('Failed Login : ' + error.message);
    }
});

// Register User
router.post('/user/register', async (req, res) => {
    const user = new User(req.body);

    try {
        const token = await generateAuthToken(user);
        await user.save();
        res.status(201).json({ user: user, token });
    } catch (error) {
        res.status(400).json(error.message);
    }
});

// Login User
router.post('/user/login', async (req, res) => {
    try {
      const user = await findByCredentials(
        req.body.email,
        req.body.password,
        User
      );
  
      const token = await generateAuthToken(user);
  
      res.json({
        user: user,
        token,
      });
    } catch (error) {
      res.status(400).json('Failed Login : ' + error.message);
    }
});

module.exports = router;