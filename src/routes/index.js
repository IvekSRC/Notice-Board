const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const companyRoutes = require('./company.routes');

router.use(authRoutes);
router.use(companyRoutes);

module.exports = router;