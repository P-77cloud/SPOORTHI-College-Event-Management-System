const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerStudent = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, usn, department, semester, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Check USN if provided for student
    if (usn) {
      const existingUsn = await User.findOne({ usn: usn.toUpperCase() });
      if (existingUsn) {
        return res.status(400).json({
          success: false,
          message: 'An account with this USN already exists',
        });
      }
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'STUDENT',
      usn: usn ? usn.toUpperCase() : undefined,
      department: department || 'Computer Science',
      semester: semester || '6th Sem',
      phone: phone || '',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        usn: user.usn,
        department: user.department,
        semester: user.semester,
        phone: user.phone,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user (Admin, Coordinator, Student)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    if (user.isDeactivated) {
      return res.status(403).json({
        success: false,
        message: 'Account deactivated. Please contact Admin.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        usn: user.usn,
        department: user.department,
        semester: user.semester,
        phone: user.phone,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password mock endpoint
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Security standard: don't reveal user absence
      return res.status(200).json({
        success: true,
        message: 'If an account exists with that email, password reset instructions have been sent.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to ' + email + '. (For demo: use default password or login directly).',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user profile
// @route   GET /api/students/profile or /api/auth/me
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile
// @route   PUT /api/students/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { name, phone, department, semester, usn } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (department) user.department = department;
    if (semester) user.semester = semester;
    if (usn) user.usn = usn.toUpperCase();

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerStudent,
  loginUser,
  forgotPassword,
  getProfile,
  updateProfile,
};
