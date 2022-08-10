const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { USER } = require("../constants/modelNames.constant");
const { PROFILE_PICTURE } = require("../constants/folderNames.constants");
const { API_URL } = require("../../config");

const userSchema = new mongoose.Schema({
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
    nickName: {
        type: String,
        unique: true,
        minlength: 3,
        require: true,
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
    profilePicture: {
        type: String
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    }
});

userSchema.virtual('profilePictureUrl')
  .get(
    function() { 
      return `${API_URL}/images/${PROFILE_PICTURE}/${this.profilePicture}` 
    }
);

userSchema.virtual("userCompanyRef", {
    ref: "Company",
    localField: "companyId",
    foreignField: "_id"
});

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this;
  
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
    }
  
    next();
});

const User = mongoose.model(USER, userSchema);

module.exports = User;