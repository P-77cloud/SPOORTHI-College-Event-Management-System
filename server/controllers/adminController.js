const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Payment = require('../models/Payment');
const Attendance = require('../models/Attendance');

// @desc    Get top-level dashboard statistics for Admin
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'STUDENT' });
    const totalCoordinators = await User.countDocuments({ role: 'COORDINATOR' });
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ status: 'Upcoming' });
    const totalRegistrations = await Registration.countDocuments();
    const paidRegistrations = await Registration.countDocuments({ paymentStatus: 'Successful' });
    const pendingPayments = await Registration.countDocuments({ paymentStatus: 'Pending' });

    // Revenue calculation
    const revenueAgg = await Payment.aggregate([
      { $match: { status: 'Successful' } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalAmount : 0;

    // Popular events
    const popularEvents = await Event.find()
      .populate('coordinator', 'name email')
      .sort({ registeredCount: -1 })
      .limit(5);

    // Recent registrations
    const recentRegistrations = await Registration.find()
      .populate('student', 'name email usn department')
      .populate('event', 'name category date venue')
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalCoordinators,
        totalEvents,
        upcomingEvents,
        totalRegistrations,
        paidRegistrations,
        pendingPayments,
        totalRevenue,
        popularEvents,
        recentRegistrations,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all coordinators
// @route   GET /api/admin/coordinators
// @access  Private (Admin)
const getCoordinators = async (req, res, next) => {
  try {
    const coordinators = await User.find({ role: 'COORDINATOR' }).sort({ name: 1 });
    
    // Attach assigned event count to each coordinator
    const coordListWithEvents = await Promise.all(
      coordinators.map(async (coord) => {
        const events = await Event.find({ coordinator: coord._id }).select('name category status date venue');
        return {
          ...coord.toObject(),
          assignedEvents: events,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: coordListWithEvents.length,
      data: coordListWithEvents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new Coordinator (Admin)
// @route   POST /api/admin/coordinators
// @access  Private (Admin)
const createCoordinator = async (req, res, next) => {
  try {
    const { name, email, password, department, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const coordinator = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'COORDINATOR',
      department: department || 'General',
      phone: phone || '',
    });

    res.status(201).json({
      success: true,
      message: 'Coordinator created successfully',
      data: {
        _id: coordinator._id,
        name: coordinator.name,
        email: coordinator.email,
        role: coordinator.role,
        department: coordinator.department,
        phone: coordinator.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update coordinator
// @route   PUT /api/admin/coordinators/:id
// @access  Private (Admin)
const updateCoordinator = async (req, res, next) => {
  try {
    const { name, email, department, phone, isDeactivated } = req.body;
    const coordinator = await User.findById(req.params.id);

    if (!coordinator || coordinator.role !== 'COORDINATOR') {
      return res.status(404).json({
        success: false,
        message: 'Coordinator not found',
      });
    }

    if (name) coordinator.name = name;
    if (email) coordinator.email = email.toLowerCase();
    if (department) coordinator.department = department;
    if (phone) coordinator.phone = phone;
    if (isDeactivated !== undefined) coordinator.isDeactivated = isDeactivated;

    await coordinator.save();

    res.status(200).json({
      success: true,
      message: 'Coordinator updated successfully',
      data: coordinator,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete coordinator
// @route   DELETE /api/admin/coordinators/:id
// @access  Private (Admin)
const deleteCoordinator = async (req, res, next) => {
  try {
    const coordinator = await User.findById(req.params.id);

    if (!coordinator || coordinator.role !== 'COORDINATOR') {
      return res.status(404).json({
        success: false,
        message: 'Coordinator not found',
      });
    }

    // Check if coordinator is assigned to any active events
    const assignedEventsCount = await Event.countDocuments({ coordinator: coordinator._id });
    if (assignedEventsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete coordinator: Assigned to ${assignedEventsCount} event(s). Please reassign events first.`,
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Coordinator deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private (Admin)
const getAllStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: 'STUDENT' }).sort({ name: 1 });

    const studentListWithRegs = await Promise.all(
      students.map(async (st) => {
        const regCount = await Registration.countDocuments({ student: st._id });
        return {
          ...st.toObject(),
          registrationCount: regCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: studentListWithRegs.length,
      data: studentListWithRegs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Admin Analytics for Charts
// @route   GET /api/admin/analytics
// @access  Private (Admin)
const getAdminAnalytics = async (req, res, next) => {
  try {
    // 1. Registrations by Category
    const categoryAgg = await Event.aggregate([
      {
        $group: {
          _id: '$category',
          totalEvents: { $sum: 1 },
          totalRegistrations: { $sum: '$registeredCount' },
        },
      },
    ]);

    // 2. Payment Status distribution
    const paymentStatusAgg = await Registration.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    // 3. Attendance Rate
    const attendanceAgg = await Attendance.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        categoryStats: categoryAgg,
        paymentStats: paymentStatusAgg,
        attendanceStats: attendanceAgg,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getCoordinators,
  createCoordinator,
  updateCoordinator,
  deleteCoordinator,
  getAllStudents,
  getAdminAnalytics,
};
