const Notification = require('../models/Notification');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'name role')
      .populate('event', 'name category venue')
      .sort({ createdAt: -1 });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    res.status(200).json({
      success: true,
      unreadCount,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark single or all notifications as read
// @route   PUT /api/notifications/:id or /api/notifications/read-all
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === 'read-all') {
      await Notification.updateMany(
        { recipient: req.user._id, isRead: false },
        { $set: { isRead: true } }
      );
      return res.status(200).json({
        success: true,
        message: 'All notifications marked as read',
      });
    }

    const notification = await Notification.findOne({
      _id: id,
      recipient: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send announcement / broadcast to event participants
// @route   POST /api/notifications/announcement
// @access  Private (Coordinator / Admin)
const sendAnnouncement = async (req, res, next) => {
  try {
    const { eventId, title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required',
      });
    }

    let recipients = [];

    if (eventId) {
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
          message: 'Not authorized: You can only send announcements for your assigned event',
        });
      }

      const regs = await Registration.find({ event: eventId });
      recipients = regs.map((r) => r.student);
    } else {
      // General broadcast by Admin to all students
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Only Admin can send general college broadcasts',
        });
      }
      const students = await User.find({ role: 'STUDENT', isDeactivated: false });
      recipients = students.map((s) => s._id);
    }

    if (recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No registered students found for this announcement',
      });
    }

    const notifications = recipients.map((studentId) => ({
      recipient: studentId,
      sender: req.user._id,
      event: eventId || null,
      title: title.trim(),
      message: message.trim(),
      type: 'Announcement',
      isRead: false,
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      message: `Announcement sent successfully to ${recipients.length} student(s)`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  sendAnnouncement,
};
