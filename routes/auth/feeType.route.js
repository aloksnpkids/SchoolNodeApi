const express = require('express');
const feeTypeController = require('../../controllers/feetypeController');
const router = express.Router();
const auth = require('../../middleware/checkAuth');

// Create a new fee type
router.post("/add", [auth], feeTypeController.createFeeType);

// Get a list of fee types with pagination
router.get("/list", [auth], feeTypeController.getFeeTypeList);

// Get a specific fee type by ID
router.get("/:id", [auth], feeTypeController.getFeeTypeById);

// Update a fee type by ID
router.put("/:id", [auth], feeTypeController.updateFeeType);

// Delete a fee type by ID
router.delete("/:id", [auth], feeTypeController.deleteFeeType);

module.exports = router;