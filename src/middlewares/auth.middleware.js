const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config');
const { Company, User } = require('../models/index');

const authForCompany = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    const company = await Company.findById(decoded._id);

    if (!company) {
      throw new Error();
    }

    req.token = token;
    req.company = company;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

const authForUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded._id);

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

module.exports = {
  authForCompany,
  authForUser,
};
