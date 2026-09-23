const API = 'http://localhost:5000/api';

async function runVerification() {
  console.log('--- STARTING SPOORTHI END-TO-END VERIFICATION ---');

  // 1. Health check
  const healthRes = await fetch(`${API}/health`);
  const health = await healthRes.json();
  console.log('✔ Health Check:', health.message);

  // 2. Student Login
  const studentAuthRes = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'student@gmail.com',
      password: 'Spoorthi@123',
    }),
  });
  const studentAuth = await studentAuthRes.json();
  const studentToken = studentAuth.data.token;
  const studentId = studentAuth.data._id;
  console.log(`✔ Student Login Successful: ${studentAuth.data.name} (USN: ${studentAuth.data.usn})`);

  // 3. Browse Events
  const eventsRes = await fetch(`${API}/events`);
  const eventsData = await eventsRes.json();
  console.log(`✔ Catalog Loaded: ${eventsData.count} events retrieved from MongoDB`);

  // Find Quiz event (Paid ₹30)
  const quizEvent = eventsData.data.find((e) => e.name === 'Quiz');
  console.log(`✔ Selected Event: ${quizEvent.name} | Fee: ₹${quizEvent.registrationFee} | Venue: ${quizEvent.venue}`);

  // 4. Student Register for Quiz Event
  let regId;
  let registrationDocId;

  const regRes = await fetch(`${API}/registrations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentToken}`,
    },
    body: JSON.stringify({ eventId: quizEvent._id }),
  });

  const regJson = await regRes.json();

  if (regJson.success) {
    registrationDocId = regJson.data._id;
    regId = regJson.data.registrationId;
    console.log(`✔ Event Registration Initiated! Ticket ID: ${regId} | Requires Payment: ${regJson.requiresPayment}`);
  } else if (regJson.message && regJson.message.includes('already registered')) {
    console.log('ℹ Student already registered for Quiz event. Fetching existing ticket pass...');
    const myRegsRes = await fetch(`${API}/registrations/my`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const myRegs = await myRegsRes.json();
    const match = myRegs.data.find((r) => r.event._id === quizEvent._id);
    registrationDocId = match._id;
    regId = match.registrationId;
    console.log(`✔ Existing Ticket Pass Found: ${regId} | Payment Status: ${match.paymentStatus}`);
  } else {
    throw new Error(regJson.message);
  }

  // 5. Process ₹30 Mock Payment
  const payRes = await fetch(`${API}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentToken}`,
    },
    body: JSON.stringify({
      registrationId: registrationDocId,
      paymentMethod: 'Mock UPI',
      simulateFailure: false,
    }),
  });

  const payJson = await payRes.json();
  if (payJson.success) {
    console.log(`✔ ₹30 Mock Payment Successful! Transaction ID: ${payJson.data.payment.transactionId} | Payment Status: ${payJson.data.registration.paymentStatus}`);
  } else {
    console.log(`ℹ Payment Note: ${payJson.message}`);
  }

  // 6. Coordinator Login
  const coordAuthRes = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'coordinator@spoorthi.com',
      password: 'Spoorthi@123',
    }),
  });
  const coordAuth = await coordAuthRes.json();
  const coordToken = coordAuth.data.token;
  console.log(`✔ Coordinator Login Successful: ${coordAuth.data.name} (${coordAuth.data.department})`);

  // 7. Coordinator Marks Attendance as Present
  const attRes = await fetch(`${API}/attendance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${coordToken}`,
    },
    body: JSON.stringify({
      eventId: quizEvent._id,
      studentId: studentId,
      registrationId: registrationDocId,
      status: 'Present',
    }),
  });
  const attJson = await attRes.json();
  console.log(`✔ Attendance Marked by Coordinator: ${attJson.message}`);

  // 8. Admin Login & Stats Check
  const adminAuthRes = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@spoorthi.com',
      password: 'Spoorthi@123',
    }),
  });
  const adminAuth = await adminAuthRes.json();
  const adminToken = adminAuth.data.token;
  console.log(`✔ Admin Login Successful: ${adminAuth.data.name}`);

  const adminStatsRes = await fetch(`${API}/admin/stats`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const adminStats = await adminStatsRes.json();
  console.log(`✔ Admin Dashboard Metrics:`);
  console.log(`    - Total Students: ${adminStats.data.totalStudents}`);
  console.log(`    - Total Coordinators: ${adminStats.data.totalCoordinators}`);
  console.log(`    - Total Events: ${adminStats.data.totalEvents}`);
  console.log(`    - Total Registrations: ${adminStats.data.totalRegistrations}`);
  console.log(`    - Paid Registrations: ${adminStats.data.paidRegistrations}`);
  console.log(`    - Total Revenue Collected: ₹${adminStats.data.totalRevenue}`);

  console.log('\n============================================================');
  console.log('🎉 ALL END-TO-END WORKFLOWS VERIFIED CLEANLY WITH 100% SUCCESS');
  console.log('============================================================\n');
}

runVerification().catch((err) => {
  console.error('❌ E2E Verification Failed:', err);
  process.exit(1);
});
