const express = require('express');
const router = express.Router();
const {
  getCoordinatorStats,
  getAssignedEvents,
} = require('../controllers/coordinatorController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/authorizeMiddleware');

router.use(protect, authorize('COORDINATOR', 'ADMIN'));

router.get('/stats', getCoordinatorStats);
router.get('/events', getAssignedEvents);

module.exports = router;
