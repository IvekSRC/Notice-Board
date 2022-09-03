const { User } = require('../models');
const { userUpdateSchema } = require('../validators/index');
const { PROFILE_PICTURE } = require('../constants/folderNames.constants');
const deleteFile = require('./picture.service');
const bcrypt = require('bcrypt');

const getUsers =  async () => {
    return await User.find({});
}

const getUser = async (id) => {
    return await User.findById(id);
}

const updateUser = async (id, validatedBody) => {
    try {
        const user = await User.findById(id);
        const validated = await userUpdateSchema.validateAsync(validatedBody);

        const updates = Object.keys(validated);
        updates.forEach((update) => {
            user[update] = validated[update];
        });

        return user;
    } catch (err) {
        throw new Error(err.message);
    }
}

const deleteUser = async (id) => {
    const user = await User.findById(id);
  
    if(user) {
      const forSend = user;
      user.delete();
      return forSend;
    }
  
    return null;
}

const addProfilePicture = async (id, profilePicture) => {
    const user = await User.findById(id);
  
    if(user) {
      if(user.profilePicture) {
        await deleteFile(PROFILE_PICTURE, user.profilePicture);
      }

      user.profilePicture = profilePicture;
      await user.save();
    } else {
      throw new Error("Can't found user.")
    }
}

const deleteProfilePicture = async (id, profilePicture) => {
    const user = await User.findById(id);
  
    if (!user || !user.profilePicture) {
      throw new Error("Can't found.");
    }
    else {
      await deleteFile(PROFILE_PICTURE, user.profilePicture);
      
      user.profilePicture = undefined;
      await user.save();
    }
}

const confirmUserPassword = async (email, passwordForTest) => {
  const user = await User.findOne({ email: email }).select("password");
  
  if (!user) {
    throw new Error("Can't found.");
  }
  else {
    const isMatch = await bcrypt.compare(passwordForTest, user.password);

    if (!isMatch) {
      return false;
    }

    return true;
  }
}

module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    addProfilePicture,
    deleteProfilePicture,
    confirmUserPassword
};