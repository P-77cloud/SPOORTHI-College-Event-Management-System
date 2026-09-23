const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');

// @desc    Get coordinator dashboard statistics
// @route   GET /api/coordinator/stats
// @access  Private (Coordinator)
const getCoordinatorStats = async (req, res, next) => {
  try {
    const coordinatorId = req.user._id;

    // Find assigned events
    const assignedEvents = await Event.find({ coordinator: coordinatorId });
    const eventIds = assignedEvents.map((e) => e._id);

    const totalAssignedEvents = assignedEvents.length;

    // Find registrations for these events
    const registrations = await Registration.find({ event: { $in: eventIds } });

    const totalParticipants = registrations.length;
    const paidParticipants = registrations.filter(
      (r) => r.paymentStatus === 'Successful' || r.paymentStatus === 'FREE'
    ).length;
    const pendingPayments = registrations.filter((r) => r.paymentStatus === 'Pending').length;

    // Attendance stats
    const attendanceRecords = await Attendance.find({ event: { $in: eventIds } });
    const presentCount = attendanceRecords.filter((a) => a.status === 'Present').length;
    const absentCount = attendanceRecords.filter((a) => a.status === 'Absent').length;

    res.status(200).json({
      success: true,
      data: {
        totalAssignedEvents,
        totalParticipants,
        paidParticipants,
        pendingPayments,
        attendance: {
          presentCount,
          absentCount,
          totalMarked: attendanceRecords.length,
        },
        assignedEvents,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assigned events ONLY for logged-in coordinator
// @route   GET /api/coordinator/events
// @access  Private (Coordinator)
const getAssignedEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ coordinator: req.user._id }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCoordinatorStats,
  getAssignedEvents,
};
