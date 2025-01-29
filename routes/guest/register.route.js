const express = require('express');
const registerController = require('../../controllers/registerController');
const router = express.Router();

router.post("/register", registerController.register);
router.post("/login", registerController.login);



module.exports = router;