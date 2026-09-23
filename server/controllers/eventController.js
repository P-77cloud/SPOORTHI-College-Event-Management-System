const Event = require('../models/Event');
const User = require('../models/User');
const Registration = require('../models/Registration');
const Notification = require('../models/Notification');

// @desc    Get all events (Public / Filtered)
// @route   GET /api/events
// @access  Public
const getAllEvents = async (req, res, next) => {
  try {
    const { category, search, feeType, status } = req.query;

    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (feeType === 'free') {
      query.registrationFee = 0;
    } else if (feeType === 'paid') {
      query.registrationFee = { $gt: 0 };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(query)
      .populate('coordinator', 'name email phone department')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'coordinator',
      'name email phone department'
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new event (Admin)
// @route   POST /api/events
// @access  Private (Admin)
const createEvent = async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      posterUrl,
      date,
      startTime,
      endTime,
      venue,
      coordinator,
      maxParticipants,
      registrationDeadline,
      rules,
      registrationFee,
      paymentRequired,
    } = req.body;

    if (!name || !category || !description || !date || !startTime || !endTime || !venue || !coordinator) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required event details including coordinator',
      });
    }

    // Verify coordinator exists
    const coordUser = await User.findById(coordinator);
    if (!coordUser || (coordUser.role !== 'COORDINATOR' && coordUser.role !== 'ADMIN')) {
      return res.status(400).json({
        success: false,
        message: 'Assigned user is not a valid event coordinator',
      });
    }

    const fee = Number(registrationFee) || 0;
    const isPaymentRequired = fee > 0 ? true : Boolean(paymentRequired);

    const event = await Event.create({
      name,
      category,
      description,
      posterUrl: posterUrl || '',
      date,
      startTime,
      endTime,
      venue,
      coordinator,
      maxParticipants: Number(maxParticipants) || 50,
      registrationDeadline: registrationDeadline || date,
      rules: Array.isArray(rules) ? rules : typeof rules === 'string' ? rules.split('\n').filter(Boolean) : [],
      registrationFee: fee,
      paymentRequired: isPaymentRequired,
      status: 'Upcoming',
    });

    const populatedEvent = await Event.findById(event._id).populate('coordinator', 'name email phone department');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: populatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin or assigned Coordinator)
const updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Auth ownership check
    if (
      req.user.role !== 'ADMIN' &&
      event.coordinator.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    if (req.body.rules && typeof req.body.rules === 'string') {
      req.body.rules = req.body.rules.split('\n').filter(Boolean);
    }

    if (req.body.registrationFee !== undefined) {
      req.body.registrationFee = Number(req.body.registrationFee);
      req.body.paymentRequired = req.body.registrationFee > 0;
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('coordinator', 'name email phone department');

    // Send notifications to registered students if time/venue changes
    if (req.body.venue || req.body.date || req.body.startTime) {
      const registrations = await Registration.find({ event: event._id });
      const notifications = registrations.map((reg) => ({
        recipient: reg.student,
        sender: req.user._id,
        event: event._id,
        title: `Schedule/Venue Update: ${event.name}`,
        message: `The event '${event.name}' details have been updated. Date: ${event.date}, Time: ${event.startTime}, Venue: ${event.venue}.`,
        type: 'EventUpdate',
      }));
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/Cancel event (Admin)
// @route   DELETE /api/events/:id
// @access  Private (Admin)
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Send notification to registered students
    const registrations = await Registration.find({ event: event._id });
    const notifications = registrations.map((reg) => ({
      recipient: reg.student,
      sender: req.user._id,
      event: event._id,
      title: `Event Cancelled: ${event.name}`,
      message: `We regret to inform you that '${event.name}' has been cancelled by the fest committee.`,
      type: 'Cancellation',
    }));
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully and participants notified',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
