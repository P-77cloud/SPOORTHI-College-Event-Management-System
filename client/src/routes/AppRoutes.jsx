import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from '../pages/Home';
import Events from '../pages/Events';
import EventDetails from '../pages/EventDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import About from '../pages/About';

import StudentDashboard from '../pages/student/StudentDashboard';
import StudentProfile from '../pages/student/StudentProfile';
import StudentRegistrations from '../pages/student/StudentRegistrations';
import MockPaymentPage from '../pages/student/MockPaymentPage';
import StudentNotifications from '../pages/student/StudentNotifications';

import CoordinatorDashboard from '../pages/coordinator/CoordinatorDashboard';
import CoordinatorEvents from '../pages/coordinator/CoordinatorEvents';
import CoordinatorParticipants from '../pages/coordinator/CoordinatorParticipants';
import CoordinatorAttendance from '../pages/coordinator/CoordinatorAttendance';

import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminCoordinators from '../pages/admin/AdminCoordinators';
import AdminStudents from '../pages/admin/AdminStudents';
import AdminEvents from '../pages/admin/AdminEvents';
import AdminRegistrations from '../pages/admin/AdminRegistrations';
import AdminPayments from '../pages/admin/AdminPayments';
import AdminAnalytics from '../pages/admin/AdminAnalytics';

import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/about" element={<About />} />

      {/* Student Protected Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/registrations"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentRegistrations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/payment/:registrationId"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <MockPaymentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/notifications"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentNotifications />
          </ProtectedRoute>
        }
      />

      {/* Coordinator Protected Routes */}
      <Route
        path="/coordinator/dashboard"
        element={
          <ProtectedRoute allowedRoles={['COORDINATOR', 'ADMIN']}>
            <CoordinatorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coordinator/events"
        element={
          <ProtectedRoute allowedRoles={['COORDINATOR', 'ADMIN']}>
            <CoordinatorEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coordinator/participants"
        element={
          <ProtectedRoute allowedRoles={['COORDINATOR', 'ADMIN']}>
            <CoordinatorParticipants />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coordinator/attendance"
        element={
          <ProtectedRoute allowedRoles={['COORDINATOR', 'ADMIN']}>
            <CoordinatorAttendance />
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/coordinators"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminCoordinators />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/events"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/registrations"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminRegistrations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payments"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminPayments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminAnalytics />
          </ProtectedRoute>
        }
      />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
