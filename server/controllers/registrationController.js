const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

// @desc    Register logged-in student for an event
// @route   POST /api/registrations
// @access  Private (Student)
const registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const studentId = req.user._id;

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

    if (event.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Registration closed. This event has been cancelled.',
      });
    }

    // Check participant limit
    if (event.registeredCount >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Event is full! Maximum participant capacity reached.',
      });
    }

    // Check duplicate registration
    const existingReg = await Registration.findOne({
      student: studentId,
      event: eventId,
    });

    if (existingReg) {
      return res.status(400).json({
        success: false,
        message: 'You have already registered for this event.',
        data: existingReg,
      });
    }

    // Generate unique Registration ID e.g. REG-SPOORTHI-78341
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const registrationId = `REG-SPOORTHI-${randomCode}`;

    const isPaid = event.registrationFee > 0;
    const initialPaymentStatus = isPaid ? 'Pending' : 'FREE';

    const registration = await Registration.create({
      registrationId,
      student: studentId,
      event: eventId,
      paymentStatus: initialPaymentStatus,
      registrationDate: new Date(),
      attendanceStatus: 'Not Marked',
    });

    if (!isPaid) {
      // Increment event participant count for FREE event immediately
      event.registeredCount += 1;
      await event.save();

      // Create notification
      await Notification.create({
        recipient: studentId,
        event: event._id,
        title: `Registration Successful: ${event.name}`,
        message: `Your registration for ${event.name} is confirmed! Registration ID: ${registrationId}. Venue: ${event.venue}, Date: ${event.date}.`,
        type: 'Registration',
      });
    } else {
      // Create notification for pending payment
      await Notification.create({
        recipient: studentId,
        event: event._id,
        title: `Action Required: Complete ₹${event.registrationFee} Payment for ${event.name}`,
        message: `Registration initiated (ID: ${registrationId}). Please complete the mock payment of ₹${event.registrationFee} to confirm your seat.`,
        type: 'Payment',
      });
    }

    const populatedReg = await Registration.findById(registration._id)
      .populate('event')
      .populate('student', 'name email usn department phone');

    res.status(201).json({
      success: true,
      message: isPaid
        ? 'Registration initiated. Please complete ₹30 mock payment.'
        : 'Successfully registered for event!',
      requiresPayment: isPaid,
      fee: event.registrationFee,
      data: populatedReg,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in student's registrations
// @route   GET /api/registrations/my
// @access  Private (Student)
const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ student: req.user._id })
      .populate({
        path: 'event',
        populate: { path: 'coordinator', select: 'name email phone' },
      })
      .populate('payment')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get event registered participants (Coordinator/Admin)
// @route   GET /api/registrations/event/:eventId
// @access  Private (Coordinator/Admin)
const getEventRegistrations = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Security check: Coordinator can only see their assigned event
    if (
      req.user.role === 'COORDINATOR' &&
      event.coordinator.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized: This event is assigned to another coordinator',
      });
    }

    const registrations = await Registration.find({ event: eventId })
      .populate('student', 'name email usn department semester phone')
      .populate('payment')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel registration by student or admin
// @route   DELETE /api/registrations/:id
// @access  Private
const cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found',
      });
    }

    if (
      req.user.role !== 'ADMIN' &&
      registration.student.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this registration',
      });
    }

    // Decrement event registeredCount if confirmed
    if (registration.paymentStatus === 'FREE' || registration.paymentStatus === 'Successful') {
      await Event.findByIdAndUpdate(registration.event, {
        $inc: { registeredCount: -1 },
      });
    }

    await Registration.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
  cancelRegistration,
};
