const Event = require('../models/Event');

const checkEventOwnership = async (req, res, next) => {
  try {
    const eventId = req.params.eventId || req.params.id || req.body.eventId;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required',
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Admins have access to all events
    if (req.user.role === 'ADMIN') {
      req.event = event;
      return next();
    }

    // Coordinators can only manage events assigned to them
    if (req.user.role === 'COORDINATOR') {
      if (event.coordinator.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: You are not the assigned coordinator for this event',
        });
      }
      req.event = event;
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access Denied: Insufficient authorization',
    });
  } catch (error) {
    console.error('[Event Ownership Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while checking event authorization',
    });
  }
};

module.exports = { checkEventOwnership };
