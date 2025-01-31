const express = require('express');
const studentController = require('../../controllers/studentController');
const router = express.Router();
const auth = require('../../middleware/checkAuth');

router.get("/list",[auth], studentController.getStudentList);



module.exports = router;