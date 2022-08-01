const { Company } = require('../models');
const { companyUpdateSchema } = require('../validators/index');
const fs = require('fs');

const getCompanys =  async () => {
    return Company.find({});
}

const getCompany = async (id) => {
    return Company.findById(id);
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
      fs.unlink(
        `public/images/${logo}/${company.logo}`,
        async function(err) {
          if(err) {
            throw new Error(err.message);
          }
          else {
            company.logo = undefined;
            await company.save();
          }
        }
      )
    }
}

module.exports = {
    getCompanys,
    getCompany,
    updateCompany,
    deleteCompany,
    addLogo,
    deleteLogo
};