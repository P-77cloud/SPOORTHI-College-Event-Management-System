const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getEventAttendance,
  getMyAttendance,
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/authorizeMiddleware');

router.post('/', protect, authorize('COORDINATOR', 'ADMIN'), markAttendance);
router.get(
  '/event/:eventId',
  protect,
  authorize('COORDINATOR', 'ADMIN'),
  getEventAttendance
);
router.get('/my', protect, authorize('STUDENT'), getMyAttendance);

module.exports = router;
