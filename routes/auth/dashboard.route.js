const express = require('express');
const dashboardController = require('../../controllers/dashboardController');
const router = express.Router();
const auth = require('../../middleware/checkAuth');

router.get("/",[auth], dashboardController.getUserDashboardData);



module.exports = router;