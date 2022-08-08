const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { COMPANY } = require("../constants/modelNames.constant");
const { API_URL } = require('../../config');
const { LOGO } = require('../constants/folderNames.constants');

const companySchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercae: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        select: false
    },
    name: {
        type: String,
        unique: true,
        minlength: 3,
        required: true,
        trim: true
    },
    firstName: {
        type: String,
        minlength: 2,
        required: true,
    },
    lastName: {
        type: String,
        minlength: 2,
        required: true,
    },
    gender: {
        type: String,
    },
    country: {
        type: String,
    },
    logo: {
        type: String
    }
});

companySchema.virtual('logoUrl')
  .get(
    function() { 
      return `${API_URL}/images/${LOGO}/${this.logo}` 
    }
);

companySchema.virtual('userCompanyRef', {
    ref: "User",
    localField: "_id",
    foreignField: "companyId"
});

companySchema.virtual('announcementCompanyRef', {
    ref: "Announcement",
    localField: "_id",
    foreignField: "companyId"
});

// Hash the plain text password before saving
companySchema.pre('save', async function (next) {
    const company = this;
  
    if (company.isModified('password')) {
      company.password = await bcrypt.hash(company.password, 8);
    }
  
    next();
});

const Company = mongoose.model(COMPANY, companySchema);

module.exports = Company;