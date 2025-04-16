const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const communicationRoutes = require('./communications');

router.use('/auth', authRoutes);
router.use('/communications', communicationRoutes);

module.exports = router;