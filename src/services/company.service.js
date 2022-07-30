const { Company } = require('../models');
const { companyUpdateSchema } = require('../validators/index')

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

module.exports = {
    getCompanys,
    getCompany,
    updateCompany,
    deleteCompany
};