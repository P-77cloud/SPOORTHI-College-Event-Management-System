const express = require('express');
const router = express.Router();
const {
  processMockPayment,
  getPaymentById,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, processMockPayment);
router.get('/:id', protect, getPaymentById);

module.exports = router;
