const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Payment = require('../models/Payment');
const Attendance = require('../models/Attendance');
const Notification = require('../models/Notification');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spoorthi_db';

const defaultPassword = 'Spoorthi@123';

const eventsData = [
  {
    name: 'Quiz',
    category: 'Technical/Academic',
    description: 'Ultimate Mind Games! Test your general knowledge, current affairs, tech innovations, and trivia in a multi-round thrilling quiz competition.',
    posterUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-15',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    venue: 'Seminar Hall 1',
    maxParticipants: 60,
    registrationDeadline: '2026-10-14',
    rules: [
      'Teams of maximum 2 members or individual entry allowed.',
      'Use of mobile phones or electronic gadgets during the quiz is strictly prohibited.',
      'Quiz master decision is final and binding.',
      'Negative marking applicable in rapid fire round.'
    ],
    registrationFee: 30,
    paymentRequired: true,
  },
  {
    name: 'Rangoli',
    category: 'Arts',
    description: 'Express vibrant traditional & modern themes through color artwork. Bring your creativity to life on canvas floors.',
    posterUrl: 'https://images.unsplash.com/photo-1605626887551-1da58658b38d?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-15',
    startTime: '10:30 AM',
    endTime: '12:30 PM',
    venue: 'College Main Quadrangle',
    maxParticipants: 40,
    registrationDeadline: '2026-10-14',
    rules: [
      'Time duration: 2 hours.',
      'Space provided will be 4x4 feet.',
      'Participants must bring their own rangoli colors.',
      'Stencils and pre-printed materials are not allowed.'
    ],
    registrationFee: 0,
    paymentRequired: false,
  },
  {
    name: '1 Minute',
    category: 'Cultural',
    description: 'Can you rule the stage in 60 seconds? Perform any talent, act, comedy, or skill without stuttering, hesitating, or repetition!',
    posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-15',
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    venue: 'Open Air Theatre (OAT)',
    maxParticipants: 50,
    registrationDeadline: '2026-10-14',
    rules: [
      'Strictly 60 seconds limit.',
      'No vulgarity or offensive content.',
      'Immediate disqualification if rules violated.'
    ],
    registrationFee: 0,
    paymentRequired: false,
  },
  {
    name: 'Poster Making',
    category: 'Arts',
    description: 'Design impactful visual posters on spot for the theme "Tech for Humanity" or "Sustainable Future". Show your graphic art flair!',
    posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-15',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    venue: 'Drawing Hall B',
    maxParticipants: 45,
    registrationDeadline: '2026-10-14',
    rules: [
      'Drawing sheets will be provided.',
      'Bring your own paints, brushes, markers, and sketch pens.',
      'Theme will be announced on the spot.'
    ],
    registrationFee: 30,
    paymentRequired: true,
  },
  {
    name: 'Mono Acting',
    category: 'Cultural',
    description: 'A theatrical solo performance where one actor portrays multiple emotions, characters, and storylines. Captivate the audience!',
    posterUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-16',
    startTime: '09:30 AM',
    endTime: '11:30 AM',
    venue: 'Auditorium Block A',
    maxParticipants: 30,
    registrationDeadline: '2026-10-15',
    rules: [
      'Time limit: 4 to 6 minutes.',
      'Background music track can be submitted via pendrive before start.',
      'Props allowed (max 2 props).'
    ],
    registrationFee: 0,
    paymentRequired: false,
  },
  {
    name: 'Debate',
    category: 'Technical/Academic',
    description: 'Clash of intellects! Debate on pressing societal, technological, and ethical dilemmas facing the world today.',
    posterUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-16',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    venue: 'Conference Room 2',
    maxParticipants: 32,
    registrationDeadline: '2026-10-15',
    rules: [
      'Format: 3 mins construct, 2 mins rebuttal.',
      'Language: English.',
      'Respect fellow debaters; no personal attacks allowed.'
    ],
    registrationFee: 30,
    paymentRequired: true,
  },
  {
    name: 'Mehendi',
    category: 'Arts',
    description: 'Celebrate intricate Henna art designs ranging from classical bridal motifs to modern geometric fusion patterns.',
    posterUrl: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-16',
    startTime: '11:00 AM',
    endTime: '01:00 PM',
    venue: 'Student Activity Center',
    maxParticipants: 40,
    registrationDeadline: '2026-10-15',
    rules: [
      'Time limit: 1.5 hours.',
      'Participants must bring their own Mehendi cones and a partner for hand application.',
      'Design must extend up to the wrist.'
    ],
    registrationFee: 0,
    paymentRequired: false,
  },
  {
    name: 'Face Painting',
    category: 'Arts',
    description: 'Transform faces into living canvases! Create mythical, sci-fi, nature, or abstract body art creations.',
    posterUrl: 'https://images.unsplash.com/photo-1561055657-b9e0bf0fa360?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-16',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    venue: 'Art Studio 3',
    maxParticipants: 35,
    registrationDeadline: '2026-10-15',
    rules: [
      'Skin-friendly paints must be used.',
      'Bring a partner to act as face model.',
      'Time limit: 90 minutes.'
    ],
    registrationFee: 30,
    paymentRequired: true,
  },
  {
    name: 'Nail Art',
    category: 'Arts',
    description: 'Miniature precision masterpieces! Showcase miniature nail designs, acrylic art, and creative embellishments.',
    posterUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-16',
    startTime: '02:30 PM',
    endTime: '04:00 PM',
    venue: 'Design Studio B',
    maxParticipants: 30,
    registrationDeadline: '2026-10-15',
    rules: [
      'Time limit: 1 hour.',
      'Must complete on 5 nails of one hand.',
      'Glitter, rhinestones, and stickers allowed.'
    ],
    registrationFee: 0,
    paymentRequired: false,
  },
  {
    name: 'Throwball',
    category: 'Sports',
    description: 'Inter-departmental Throwball Tournament! Fast-paced tactical passing, powerful serves, and intense team rallies.',
    posterUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-17',
    startTime: '09:00 AM',
    endTime: '01:00 PM',
    venue: 'Sports Complex Outdoor Court',
    maxParticipants: 80,
    registrationDeadline: '2026-10-16',
    rules: [
      'Standard Throwball Federation rules apply.',
      'Team of 7 active players + 5 substitutes.',
      'Match format: Best of 3 sets.'
    ],
    registrationFee: 30,
    paymentRequired: true,
  },
  {
    name: 'Volleyball',
    category: 'Sports',
    description: 'Spike, Block, and Dig! College Championship Volleyball tournament with high energy matches and electric atmosphere.',
    posterUrl: 'https://images.unsplash.com/photo-1592656094267-764a45160876?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-17',
    startTime: '09:30 AM',
    endTime: '02:00 PM',
    venue: 'Volleyball Main Arena',
    maxParticipants: 84,
    registrationDeadline: '2026-10-16',
    rules: [
      '6 active court players per team.',
      'Knockout tournament setup.',
      'Proper sports jersey & non-marking shoes required.'
    ],
    registrationFee: 30,
    paymentRequired: true,
  },
  {
    name: 'Badminton',
    category: 'Sports',
    description: 'Smash your way to glory! Singles & Doubles badminton tournament for Men & Women categories.',
    posterUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-17',
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    venue: 'Indoor Badminton Stadium',
    maxParticipants: 64,
    registrationDeadline: '2026-10-16',
    rules: [
      'Yonex feather shuttles provided.',
      'Non-marking shoes compulsory.',
      'Matches scored up to 21 points rally format.'
    ],
    registrationFee: 30,
    paymentRequired: true,
  },
  {
    name: 'Essay Writing',
    category: 'Arts',
    description: 'Pen your expressive thoughts on contemporary social themes, philosophy, literature, and technology.',
    posterUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-17',
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    venue: 'Classroom 301, Block C',
    maxParticipants: 50,
    registrationDeadline: '2026-10-16',
    rules: [
      'Word count limit: 800 to 1200 words.',
      'Duration: 90 minutes.',
      'Writing paper provided; bring your own pens.'
    ],
    registrationFee: 0,
    paymentRequired: false,
  },
  {
    name: 'Song',
    category: 'Cultural',
    description: 'SPOORTHI Voice of Campus! Solo vocal performance across Eastern Classical, Western Pop, Semi-Classical, and Light music.',
    posterUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-17',
    startTime: '02:00 PM',
    endTime: '05:00 PM',
    venue: 'Main Indoor Auditorium',
    maxParticipants: 35,
    registrationDeadline: '2026-10-16',
    rules: [
      'Time limit: 4 minutes performance.',
      'Karaoke track or 1 acoustic accompanist allowed.',
      'Judging based on pitch, rhythm, vocal clarity, and stage presence.'
    ],
    registrationFee: 30,
    paymentRequired: true,
  },
  {
    name: 'Dance',
    category: 'Cultural',
    description: 'The grand flagship event! Western, Classical, Bollywood, Hip Hop, and Contemporary solo/group dance showdown.',
    posterUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-17',
    startTime: '05:30 PM',
    endTime: '08:30 PM',
    venue: 'Open Air Amphitheatre',
    maxParticipants: 40,
    registrationDeadline: '2026-10-16',
    rules: [
      'Time limit: 5 to 7 minutes.',
      'Track must be submitted in MP3 format 2 hours prior.',
      'Fire, water, or hazardous stage props strictly forbidden.'
    ],
    registrationFee: 30,
    paymentRequired: true,
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[Seed]: Connected to MongoDB at', MONGO_URI);

    // 1. Seed Demo Admin
    let admin = await User.findOne({ email: 'admin@spoorthi.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Spoorthi Chief Admin',
        email: 'admin@spoorthi.com',
        password: defaultPassword,
        role: 'ADMIN',
        department: 'Event Operations',
        phone: '9876543210',
      });
      console.log('[Seed]: Admin created (admin@spoorthi.com)');
    } else {
      console.log('[Seed]: Admin already exists');
    }

    // 2. Seed Demo Coordinator
    let coordinator = await User.findOne({ email: 'coordinator@spoorthi.com' });
    if (!coordinator) {
      coordinator = await User.create({
        name: 'Prof. Ramesh Kumar',
        email: 'coordinator@spoorthi.com',
        password: defaultPassword,
        role: 'COORDINATOR',
        department: 'Computer Science',
        phone: '9123456780',
      });
      console.log('[Seed]: Coordinator created (coordinator@spoorthi.com)');
    } else {
      console.log('[Seed]: Coordinator already exists');
    }

    // Additional secondary coordinator for multi-coordinator demo
    let coordinator2 = await User.findOne({ email: 'arts_coord@spoorthi.com' });
    if (!coordinator2) {
      coordinator2 = await User.create({
        name: 'Dr. Ananya Sharma',
        email: 'arts_coord@spoorthi.com',
        password: defaultPassword,
        role: 'COORDINATOR',
        department: 'Fine Arts & Humanities',
        phone: '9988776655',
      });
      console.log('[Seed]: Second Coordinator created (arts_coord@spoorthi.com)');
    }

    // 3. Seed Demo Student
    let student = await User.findOne({ email: 'student@gmail.com' });
    if (!student) {
      student = await User.create({
        name: 'Aditya Varma',
        email: 'student@gmail.com',
        password: defaultPassword,
        role: 'STUDENT',
        usn: '1SG21CS042',
        department: 'Computer Science',
        semester: '6th Sem',
        phone: '9845012345',
      });
      console.log('[Seed]: Student created (student@gmail.com)');
    } else {
      console.log('[Seed]: Student already exists');
    }

    // 4. Seed 15 Events
    console.log('[Seed]: Seeding 15 fest events...');
    for (let i = 0; i < eventsData.length; i++) {
      const item = eventsData[i];
      let existingEvent = await Event.findOne({ name: item.name });

      // Alternate coordinator assignment to demonstrate role security
      const assignedCoord = i % 2 === 0 ? coordinator._id : coordinator2._id;

      if (!existingEvent) {
        await Event.create({
          ...item,
          coordinator: assignedCoord,
        });
        console.log(`  + Created Event: ${item.name} (${item.category})`);
      } else {
        existingEvent.coordinator = assignedCoord;
        await existingEvent.save();
        console.log(`  ~ Updated Event: ${item.name}`);
      }
    }

    console.log('\n==========================================');
    console.log('SEEDING COMPLETED SUCCESSFULLY!');
    console.log('Demo Credentials:');
    console.log('ADMIN:       admin@spoorthi.com        / Password: Spoorthi@123');
    console.log('COORDINATOR: coordinator@spoorthi.com  / Password: Spoorthi@123');
    console.log('STUDENT:     student@gmail.com        / Password: Spoorthi@123');
    console.log('==========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
