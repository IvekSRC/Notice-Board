const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const companyRoutes = require('./company.routes');
const userRoutes = require('./user.routes');
const announcementRoutes = require('./announcement.routes');

router.use(authRoutes);
router.use(companyRoutes);
router.use(userRoutes);
router.use(announcementRoutes);

module.exports = router;