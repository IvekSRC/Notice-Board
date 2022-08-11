const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../../config');
const { Company, User } = require('../models');

const generateAuthToken = async (forwardedModel) => {
  const model = forwardedModel;

  const token = jwt.sign({ _id: model._id.toString() }, JWT_SECRET);

  return token;
};

const isUpper = async (string) => {
  return /[A-Z]/.test(string);
};

const findByCredentials = async (email, password, model) => {
  const isValidInput = await isUpper(email).then(function (result) {
    return result;
  });

  if (isValidInput == true) {
    throw new Error('Email can contain just small letter.');
  }

  let element = null;
  if (model == Company) {
    element = await Company.findOne({ email: email }).select("password");
  } else if (model == User) {
    element = await User.findOne({ email: email }).select("password");
  }

  if (!element) {
    throw new Error("Email is incorrect.");
  }
  const isMatch = await bcrypt.compare(password, element.password);

  if (!isMatch) {
    throw new Error('Password is incorrect.');
  }

  return element;
};

module.exports = {
  generateAuthToken,
  isUpper,
  findByCredentials,
};
