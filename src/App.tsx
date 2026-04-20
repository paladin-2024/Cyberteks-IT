import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { useAuth } from './context/AuthContext';

// Layouts
import MarketingLayout from './layouts/MarketingLayout';
import AuthLayout from './layouts/AuthLayout';
import LMSLayout from './layouts/LMSLayout';

// Marketing pages
import HomePage from './pages/marketing/HomePage';
import AboutPage from './pages/marketing/AboutPage';
import ContactPage from './pages/marketing/ContactPage';
import ApplyPage from './pages/marketing/ApplyPage';
import CareersPage from './pages/marketing/CareersPage';
import ProductsPage from './pages/marketing/ProductsPage';
import ServicesPage from './pages/marketing/ServicesPage';
import GetStartedPage from './pages/marketing/GetStartedPage';
import PrivacyPage from './pages/marketing/PrivacyPage';
import TermsPage from './pages/marketing/TermsPage';
import SecurityTipsPage from './pages/marketing/SecurityTipsPage';

// Service sub-pages
import RemoteITSupportPage from './pages/marketing/services/RemoteITSupportPage';
import CCTVPage from './pages/marketing/services/CCTVPage';
import AccessControlPage from './pages/marketing/services/AccessControlPage';
import VoIPPage from './pages/marketing/services/VoIPPage';
import ICTSkillingPage from './pages/marketing/services/ICTSkillingPage';
import SoftwareAIPage from './pages/marketing/services/SoftwareAIPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Admin pages
import AdminDashboard from './pages/lms/admin/Dashboard';
import AdminUsers from './pages/lms/admin/Users';
import AdminCourses from './pages/lms/admin/Courses';
import AdminApplications from './pages/lms/admin/Applications';
import AdminInvoices from './pages/lms/admin/Invoices';
import AdminAnalytics from './pages/lms/admin/Analytics';
import AdminNotifications from './pages/lms/admin/Notifications';
import AdminSettings from './pages/lms/admin/Settings';
import AdminMessages from './pages/lms/admin/Messages';
import AdminITSupport from './pages/lms/admin/ITSupport';
import AdminNewsletter from './pages/lms/admin/Newsletter';
import AdminBootcamps from './pages/lms/admin/Bootcamps';
import AdminStudents from './pages/lms/admin/Students';

// Shared pages
import Profile from './pages/lms/shared/Profile';
import HelpCenter from './pages/lms/shared/HelpCenter';

// Teacher pages
import TeacherDashboard from './pages/lms/teacher/Dashboard';
import TeacherCourses from './pages/lms/teacher/Courses';
import TeacherCourseDetail from './pages/lms/teacher/CourseDetail';
import TeacherStudents from './pages/lms/teacher/Students';
import TeacherAssignments from './pages/lms/teacher/Assignments';
import TeacherMessages from './pages/lms/teacher/Messages';
import TeacherCurriculum from './pages/lms/teacher/Curriculum';
import TeacherAnalytics from './pages/lms/teacher/Analytics';
import TeacherNotifications from './pages/lms/teacher/Notifications';

// Student pages
import StudentDashboard from './pages/lms/student/Dashboard';
import StudentCourses from './pages/lms/student/Courses';
import StudentCourseDetail from './pages/lms/student/CourseDetail';
import StudentJourney from './pages/lms/student/Journey';
import StudentCertificates from './pages/lms/student/Certificates';
import StudentMessages from './pages/lms/student/Messages';
import StudentNotifications from './pages/lms/student/Notifications';
import StudentAssignments from './pages/lms/student/Assignments';

// Route guards
function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function DashboardRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'TEACHER') return <Navigate to="/teacher/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Analytics />
      <Routes>
        {/* Marketing */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/get-started" element={<GetStartedPage />} />
          <Route path="/privacy-policy" element={<PrivacyPage />} />
          <Route path="/terms-of-use" element={<TermsPage />} />
          <Route path="/security-tips" element={<SecurityTipsPage />} />
          <Route path="/services/remote-it-support" element={<RemoteITSupportPage />} />
          <Route path="/services/cctv" element={<CCTVPage />} />
          <Route path="/services/access-control" element={<AccessControlPage />} />
          <Route path="/services/voip" element={<VoIPPage />} />
          <Route path="/services/ict-skilling" element={<ICTSkillingPage />} />
          <Route path="/services/software-ai" element={<SoftwareAIPage />} />
        </Route>

        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Dashboard redirect */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><LMSLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="invoices" element={<AdminInvoices />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="it-support" element={<AdminITSupport />} />
          <Route path="newsletter" element={<AdminNewsletter />} />
          <Route path="bootcamps" element={<AdminBootcamps />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Teacher */}
        <Route path="/teacher" element={<ProtectedRoute roles={['TEACHER']}><LMSLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="analytics" element={<TeacherAnalytics />} />
          <Route path="courses" element={<TeacherCourses />} />
          <Route path="courses/:id" element={<TeacherCourseDetail />} />
          <Route path="curriculum" element={<TeacherCurriculum />} />
          <Route path="students" element={<TeacherStudents />} />
          <Route path="assignments" element={<TeacherAssignments />} />
          <Route path="messages" element={<TeacherMessages />} />
          <Route path="notifications" element={<TeacherNotifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Student */}
        <Route path="/student" element={<ProtectedRoute roles={['STUDENT']}><LMSLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="courses/:id" element={<StudentCourseDetail />} />
          <Route path="journey" element={<StudentJourney />} />
          <Route path="certificates" element={<StudentCertificates />} />
          <Route path="messages" element={<StudentMessages />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Help Center, shared across all roles */}
        <Route path="/help" element={<ProtectedRoute><LMSLayout /></ProtectedRoute>}>
          <Route index element={<HelpCenter />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
