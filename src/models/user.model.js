const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { USER } = require("../constants/modelNames.constant");

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
    profilePicture: {
        type: String
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    }
});

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