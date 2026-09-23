const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['FREE', 'Pending', 'Successful', 'Failed'],
      default: 'FREE',
      required: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    attendanceStatus: {
      type: String,
      enum: ['Not Marked', 'Present', 'Absent'],
      default: 'Not Marked',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate student registration for the same event
registrationSchema.index({ student: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
