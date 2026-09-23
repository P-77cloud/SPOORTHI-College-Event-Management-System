const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getCoordinators,
  createCoordinator,
  updateCoordinator,
  deleteCoordinator,
  getAllStudents,
  getAdminAnalytics,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/authorizeMiddleware');

router.use(protect, authorize('ADMIN'));

router.get('/stats', getAdminStats);
router.get('/coordinators', getCoordinators);
router.post('/coordinators', createCoordinator);
router.put('/coordinators/:id', updateCoordinator);
router.delete('/coordinators/:id', deleteCoordinator);
router.get('/students', getAllStudents);
router.get('/analytics', getAdminAnalytics);

module.exports = router;
