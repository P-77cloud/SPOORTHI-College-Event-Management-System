const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Event category is required'],
      enum: ['Cultural', 'Arts', 'Technical/Academic', 'Sports'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    posterUrl: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    coordinator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Assigned coordinator is required'],
    },
    maxParticipants: {
      type: Number,
      required: [true, 'Max participants limit is required'],
      default: 50,
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
    registrationDeadline: {
      type: String,
      required: [true, 'Registration deadline is required'],
    },
    rules: {
      type: [String],
      default: [],
    },
    registrationFee: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentRequired: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Active', 'Completed', 'Cancelled'],
      default: 'Upcoming',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
