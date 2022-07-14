const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { COMPANY } = require("../constants/modelNames.constant");

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
        require: true,
        trim: true
    },
    logo: {
        type: String
    }
});

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