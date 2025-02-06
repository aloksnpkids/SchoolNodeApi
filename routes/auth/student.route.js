const express = require('express');
const studentController = require('../../controllers/studentController');
const router = express.Router();
const auth = require('../../middleware/checkAuth');
const MulterTrait = require('../../helpers/MulterTrait');

let uploadLocal = MulterTrait.uploadLocalFields('student/images', [{
    name: 'image',
    maxCount: 1
}]);

router.post("/add", [auth, uploadLocal], studentController.addStudent);
router.get("/list", [auth], studentController.getStudentList);
router.get("/:id", [auth], studentController.getStudentById);
router.put("/:id", [auth, uploadLocal], studentController.updateStudent);

module.exports = router;
