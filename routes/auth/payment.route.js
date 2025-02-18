const express = require('express');
const paymentController = require('../../controllers/paymentController');
const router = express.Router();
const auth = require('../../middleware/checkAuth');
const invalidateCache = require('../../middleware/invalidateCache');

// Add a new payment
router.post("/add", [auth, invalidateCache], paymentController.addPayment);

// Get a list of payments with optional filtering and pagination
router.get("/list", [auth], paymentController.getPaymentList);

// Get a specific payment by ID
router.get("/:id", [auth], paymentController.getPaymentById);

// Update a payment by ID
router.put("/:id", [auth, invalidateCache], paymentController.updatePayment);

module.exports = router;