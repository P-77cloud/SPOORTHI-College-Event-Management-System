const express = require('express');
const router = express.Router();
const {
  getMyNotifications,
  markAsRead,
  sendAnnouncement,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/authorizeMiddleware');

router.get('/', protect, getMyNotifications);
router.put('/:id', protect, markAsRead);
router.post(
  '/announcement',
  protect,
  authorize('COORDINATOR', 'ADMIN'),
  sendAnnouncement
);

module.exports = router;
