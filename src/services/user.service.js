const { User } = require('../models');
const { userUpdateSchema } = require('../validators/index');
const fs = require('fs');

const getUsers =  async () => {
    return User.find({});
}

const getUser = async (id) => {
    return User.findById(id);
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
      fs.unlink(
        `public/images/${profilePicture}/${user.profilePicture}`,
        async function(err) {
          if(err) {
            throw new Error(err.message);
          }
          else {
            user.profilePicture = undefined;
            await user.save();
          }
        }
      )
    }
}

module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    addProfilePicture,
    deleteProfilePicture
};