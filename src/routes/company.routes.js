const express = require('express');
const { authForCompany } = require('../middlewares/auth.middleware');
const router = new express.Router();
const {
    getCompany,
    updateCompany,
    deleteCompany,
    addLogo,
    deleteLogo,
    confirmCompanyPassword,
    isMyAnnouncement
} = require('../services/company.service');
const { LOGO } = require('../constants/folderNames.constants');
const upload = require('../middlewares/upload.middleware');
const { getPaginated } = require('../services/pagination.service');
const { Company } = require('../models');

// Get All Companys
router.get('/companys', async (req, res) => {
  try {
    const results = await getPaginated(Company, req, res);

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

// Get Company By Id
router.get('/companys/:id', async (req, res) => {
    const { params: { id } } = req;

    try {
        const company = await getCompany(id);

        if (!company) {
        return res.status(404).json();
        }

        res.json(company);
    } catch (error) {
        res.status(500).json();
    }
});

// Update Company
router.patch(
    '/companys',
    authForCompany,
    async (req, res) => {
      const { body: validatedBody, company: { id } } = req;
  
      try {
        const updatedCompany = await updateCompany(id, validatedBody);
  
        if (!updatedCompany) {
          return res.status(404).json();
        }
  
        await updatedCompany.save();
  
        res.json(updatedCompany);
      } 
      catch (error) {
        res.status(422).json(error.message);
      }
    }
);

// Delete Company
router.delete(
    '/companys',
    authForCompany,
    async (req, res) => {
      const { id } = req.company;
  
      try {
        const company = await deleteCompany(id);
  
        if (!company) {
          return res.status(404).json();
        }
  
        res.status(200).json(company);
      } catch (error) {
        res.status(400).json(error.message);
      }
    }
);

// Add Logo To Login Company
router.post(
  '/companys/logo',
  authForCompany,
  upload.single(LOGO),
  async (req, res) => {
    const { company: { id }, generatedFileName } = req;

    await addLogo(id, generatedFileName);

    res.json('Logo upload succesfully.');
  },
  (error, req, res) => {
    res.status(400).json({ error: error.message });
  }
);

// GET Logo
router.get('/companys/:id/logo',
  async (req, res) => {
  const { params: { id } } = req;

  try {
    const company = await getCompany(id);

    if (!company || !company.logo) {
      throw new Error('Logo does not exist.');
    }

    res.set('Content-Type', 'image/png');
    res.redirect(company.logoUrl);
  } catch (error) {
    res.status(404).json();
  }
});

// Delete Logo For Login Company
router.delete(
  '/companys/logo',
  authForCompany,
  async (req, res) => {
    const { company: { id } } = req;

    await deleteLogo(id, LOGO);
    res.status(404).json('Logo deleted succesfully.');
  }
);

// Confirm Company Password
router.get(
  '/companys/confirmPassword/:password',
  authForCompany,
  async (req, res) => {
    const { company: { email }, params: { password } } = req;

    try {
      var response = {
        message: String,
        isValid: Boolean
      }

      const isValid = await confirmCompanyPassword(email, password);

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

// Is my annoucement
router.get(
  '/companys/announcements/isMy/:idAnnouncement',
  authForCompany,
  async (req, res) => {
    const {company: { id }, params: { idAnnouncement } } = req;

    try {
      const isMyItem = await isMyAnnouncement(id, idAnnouncement);

      res.json({
        isMyItem: isMyItem
      })
    }
    catch (error) {
      res.status(404).json(error.message);
    }
  }
);

module.exports = router;