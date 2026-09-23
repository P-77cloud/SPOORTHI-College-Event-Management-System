const Attendance = require('../models/Attendance');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Notification = require('../models/Notification');

// @desc    Mark student attendance (Coordinator / Admin)
// @route   POST /api/attendance
// @access  Private (Coordinator/Admin)
const markAttendance = async (req, res, next) => {
  try {
    const { eventId, studentId, registrationId, status } = req.body;

    if (!eventId || !studentId || !registrationId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Event ID, Student ID, Registration ID, and Status (Present/Absent) are required',
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Security ownership check
    if (
      req.user.role === 'COORDINATOR' &&
      event.coordinator.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized: You can only mark attendance for events assigned to you',
      });
    }

    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }

    // Upsert attendance record
    const attendance = await Attendance.findOneAndUpdate(
      { event: eventId, student: studentId },
      {
        event: eventId,
        student: studentId,
        registration: registrationId,
        status,
        markedBy: req.user._id,
        markedAt: new Date(),
      },
      { upsert: true, new: true, runValidators: true }
    );

    // Update registration status
    registration.attendanceStatus = status;
    await registration.save();

    // Send student notification
    await Notification.create({
      recipient: studentId,
      sender: req.user._id,
      event: event._id,
      title: `Attendance Marked: ${event.name}`,
      message: `Your attendance status for ${event.name} has been marked as '${status}'.`,
      type: 'EventUpdate',
    });

    res.status(200).json({
      success: true,
      message: `Attendance marked as '${status}' successfully`,
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get event attendance log and stats
// @route   GET /api/attendance/event/:eventId
// @access  Private (Coordinator/Admin)
const getEventAttendance = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (
      req.user.role === 'COORDINATOR' &&
      event.coordinator.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized for this event',
      });
    }

    const attendanceRecords = await Attendance.find({ event: eventId })
      .populate('student', 'name email usn department phone')
      .populate('markedBy', 'name role');

    const totalMarked = attendanceRecords.length;
    const presentCount = attendanceRecords.filter((a) => a.status === 'Present').length;
    const absentCount = attendanceRecords.filter((a) => a.status === 'Absent').length;

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalMarked,
          presentCount,
          absentCount,
        },
        records: attendanceRecords,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance for logged-in student
// @route   GET /api/attendance/my
// @access  Private (Student)
const getMyAttendance = async (req, res, next) => {
  try {
    const attendanceRecords = await Attendance.find({ student: req.user._id })
      .populate('event', 'name category date venue')
      .sort({ markedAt: -1 });

    res.status(200).json({
      success: true,
      count: attendanceRecords.length,
      data: attendanceRecords,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  markAttendance,
  getEventAttendance,
  getMyAttendance,
};
