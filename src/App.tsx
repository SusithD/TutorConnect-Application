import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/layouts/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import StudentDashboard from './pages/student/StudentDashboard';
import TutorDashboard from './pages/tutor/TutorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProfilePage from './pages/profile/ProfilePage';
import TutorListPage from './pages/student/TutorListPage';
import TutorDetailPage from './pages/student/TutorDetailPage';
import BookingsPage from './pages/bookings/BookingsPage';
import MessagesPage from './pages/messages/MessagesPage';
import ChatPage from './pages/messages/ChatPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminSubjectsPage from './pages/admin/AdminSubjectsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Public routes */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        {/* Protected student routes */}
        <Route element={<ProtectedRoute role="STUDENT" />}>
          <Route path="student/dashboard" element={<StudentDashboard />} />
          <Route path="student/tutors" element={<TutorListPage />} />
          <Route path="student/tutors/:id" element={<TutorDetailPage />} />
          <Route path="student/bookings" element={<BookingsPage />} />
        </Route>
        
        {/* Protected tutor routes */}
        <Route element={<ProtectedRoute role="TUTOR" />}>
          <Route path="tutor/dashboard" element={<TutorDashboard />} />
          <Route path="tutor/bookings" element={<BookingsPage />} />
        </Route>
        
        {/* Protected admin routes */}
        <Route element={<ProtectedRoute role="ADMIN" />}>
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="admin/users" element={<AdminUsersPage />} />
          <Route path="admin/bookings" element={<AdminBookingsPage />} />
          <Route path="admin/subjects" element={<AdminSubjectsPage />} />
        </Route>
        
        {/* Common protected routes for all authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="messages/chat/:id" element={<ChatPage />} />
        </Route>
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;