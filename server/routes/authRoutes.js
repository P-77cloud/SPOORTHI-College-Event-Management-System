const express = require('express');
const router = express.Router();
const {
  registerStudent,
  loginUser,
  forgotPassword,
  getProfile,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerStudent);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
