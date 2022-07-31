const { User } = require('../models');
const { userUpdateSchema } = require('../validators/index');

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

module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser
};