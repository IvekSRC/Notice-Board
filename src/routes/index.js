const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const companyRoutes = require('./company.routes');
const userRoutes = require('./user.routes');

router.use(authRoutes);
router.use(companyRoutes);
router.use(userRoutes);

module.exports = router;