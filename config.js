const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`),
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'defaultEnv',
  PORT: process.env.PORT || 8080,
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost:27017/noticeBoardDatabase',
  JWT_SECRET: process.env.JWT_SECRET || 'kjH8MN7JHhjJ5',
  API_URL: process.env.API_URL || 'http://localhost:8080',
  ACCESS_KEY: process.env.ACCESS_KEY || '',
  AUDIO_PATH: process.env.AUDIO_PATH || '',
};
