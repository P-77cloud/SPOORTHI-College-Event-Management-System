const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
  cancelRegistration,
} = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/authorizeMiddleware');

router.post('/', protect, authorize('STUDENT', 'ADMIN'), registerForEvent);
router.get('/my', protect, authorize('STUDENT'), getMyRegistrations);
router.get(
  '/event/:eventId',
  protect,
  authorize('ADMIN', 'COORDINATOR'),
  getEventRegistrations
);
router.delete('/:id', protect, cancelRegistration);

module.exports = router;
