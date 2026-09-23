const Payment = require('../models/Payment');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Notification = require('../models/Notification');

// @desc    Process ₹30 mock payment for event registration
// @route   POST /api/payments
// @access  Private (Student)
const processMockPayment = async (req, res, next) => {
  try {
    const { registrationId, paymentMethod, simulateFailure } = req.body;
    const studentId = req.user._id;

    if (!registrationId) {
      return res.status(400).json({
        success: false,
        message: 'Registration ID is required for processing payment',
      });
    }

    const registration = await Registration.findById(registrationId).populate('event');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found',
      });
    }

    if (registration.student.toString() !== studentId.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized payment attempt for another student',
      });
    }

    if (registration.paymentStatus === 'Successful') {
      return res.status(400).json({
        success: false,
        message: 'Payment has already been completed for this registration',
      });
    }

    const event = registration.event;
    const amount = event.registrationFee > 0 ? event.registrationFee : 30;

    // Generate unique transaction ID
    const txnId = `TXN-SPOORTHI-${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`;

    if (simulateFailure) {
      const failedPayment = await Payment.create({
        transactionId: txnId,
        registration: registration._id,
        student: studentId,
        event: event._id,
        amount,
        paymentMethod: paymentMethod || 'Mock UPI',
        status: 'Failed',
      });

      registration.paymentStatus = 'Failed';
      registration.payment = failedPayment._id;
      await registration.save();

      await Notification.create({
        recipient: studentId,
        event: event._id,
        title: `Payment Failed: ${event.name}`,
        message: `Your mock payment of ₹${amount} failed (Txn: ${txnId}). Please retry from your dashboard.`,
        type: 'Payment',
      });

      return res.status(400).json({
        success: false,
        message: 'Mock payment failed as requested. You can retry anytime.',
        data: failedPayment,
      });
    }

    // Successful Payment
    const payment = await Payment.create({
      transactionId: txnId,
      registration: registration._id,
      student: studentId,
      event: event._id,
      amount,
      paymentMethod: paymentMethod || 'Mock UPI',
      status: 'Successful',
    });

    registration.paymentStatus = 'Successful';
    registration.payment = payment._id;
    await registration.save();

    // Increment event participant count
    await Event.findByIdAndUpdate(event._id, {
      $inc: { registeredCount: 1 },
    });

    // Create Notification
    await Notification.create({
      recipient: studentId,
      event: event._id,
      title: `Payment Received & Registration Confirmed!`,
      message: `₹${amount} paid successfully for ${event.name}! Transaction ID: ${txnId}. Ticket ID: ${registration.registrationId}.`,
      type: 'Payment',
    });

    const populatedReg = await Registration.findById(registration._id)
      .populate('event')
      .populate('payment')
      .populate('student', 'name email usn department');

    res.status(200).json({
      success: true,
      message: 'Payment Successful! Registration Confirmed.',
      data: {
        payment,
        registration: populatedReg,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment details by ID
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('student', 'name email usn phone')
      .populate('event', 'name category date venue')
      .populate('registration', 'registrationId paymentStatus');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment transaction record not found',
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  processMockPayment,
  getPaymentById,
};
