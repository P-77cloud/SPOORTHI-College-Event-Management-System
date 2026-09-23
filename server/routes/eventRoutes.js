const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/authorizeMiddleware');

router.get('/', getAllEvents);
router.get('/:id', getEventById);

router.post('/', protect, authorize('ADMIN'), createEvent);
router.put('/:id', protect, authorize('ADMIN', 'COORDINATOR'), updateEvent);
router.delete('/:id', protect, authorize('ADMIN'), deleteEvent);

module.exports = router;
