const express = require('express');
const router = express.Router();

const guestRoutes = require('./guest/register.route');
const dashboardRoutes = require('./auth/dashboard.route');





router.use('/api/v1/school', guestRoutes);
router.use('/api/v1/dashboard', dashboardRoutes);



module.exports = router
