const { Company } = require('../models');
const { companyUpdateSchema } = require('../validators/index');
const deleteFile = require('./picture.service');
const { LOGO } = require('../constants/folderNames.constants');
const bcrypt = require('bcrypt');

const getCompanys =  async () => {
    return await Company.find({});
}

const getCompany = async (id) => {
    return await Company.findById(id);
}

const updateCompany = async (id, validatedBody) => {
    try {
        const company = await Company.findById(id);
        const validated = await companyUpdateSchema.validateAsync(validatedBody);

        const updates = Object.keys(validated);
        updates.forEach((update) => {
            company[update] = validated[update];
        });

        return company;
    } catch (err) {
        throw new Error(err.message);
    }
}

const deleteCompany = async (id) => {
    const company = await Company.findById(id);
  
    if(company) {
      const forSend = company;
      company.delete();
      return forSend;
    }
  
    return null;
}

const addLogo = async (id, logo) => {
    const company = await Company.findById(id);
  
    if(company) {
      if(company.logo) {
        await deleteFile(LOGO, company.logo);
      }

      company.logo = logo;
      await company.save();
    } else {
      throw new Error("Can't found company.")
    }
}

const deleteLogo = async (id, logo) => {
    const company = await Company.findById(id);
  
    if (!company || !company.logo) {
      throw new Error("Can't found.");
    }
    else {
      await deleteFile(LOGO, company.logo);

      company.logo = undefined;
      await company.save();
    }
}

const confirmCompanyPassword = async (email, passwordForTest) => {
  const company = await Company.findOne({ email: email }).select("password");
  
  if (!company) {
    throw new Error("Can't found.");
  }
  else {
    const isMatch = await bcrypt.compare(passwordForTest, company.password);

    if (!isMatch) {
      return false;
    }

    return true;
  }
}

module.exports = {
    getCompanys,
    getCompany,
    updateCompany,
    deleteCompany,
    addLogo,
    deleteLogo,
    confirmCompanyPassword
};