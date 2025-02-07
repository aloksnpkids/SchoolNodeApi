const express = require('express');
const router = express.Router();

const guestRoutes = require('./guest/register.route');
const dashboardRoutes = require('./auth/dashboard.route');
const studentRoutes = require('./auth/student.route');
const feeTypeRoutes = require('./auth/feeType.route');
const payment = require('./auth/payment.route');





router.use('/api/v1/school', guestRoutes);
router.use('/api/v1/dashboard', dashboardRoutes);
router.use('/api/v1/student', studentRoutes);
router.use('/api/v1/fee-type', feeTypeRoutes);
router.use('/api/v1/payments', payment);



module.exports = router
