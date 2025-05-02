import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// Page imports...
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Queue from "../pages/Queue";
import CreateQueue from "../pages/CreateQueue";

// Admin
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminDoctors from "../pages/Admin/AdminDoctors";
import AdminSchedule from "../pages/Admin/AdminSchedule";
import AdminAppointments from "../pages/Admin/AdminAppointments";
import AdminPatients from "../pages/Admin/AdminPatients";
import AdminPatientEMR from "../pages/Admin/AdminPatientEMR";
import AdminProfile from "../pages/Admin/AdminProfile";
import AdminQueueing from "../pages/Admin/AdminQueueing";
import AdminActivityLogs from "../pages/Admin/AdminActivityLogs";

// Doctor
import DoctorDashboard from "../pages/Doctor/DoctorDashboard";
import DoctorAppointments from "../pages/Doctor/DoctorAppointments";
import DoctorPatients from "../pages/Doctor/DoctorPatients";
import DoctorSettings from "../pages/Doctor/DoctorSettings";
import DoctorProfile from "../pages/Doctor/DoctorProfile";

// Patient
import PatientDashboard from "../pages/Patient/PatientDashboard";
import PatientProfile from "../pages/Patient/PatientProfile";
import PatientDoctors from "../pages/Patient/PatientDoctors";
import PatientScheduled from "../pages/Patient/PatientScheduled";
import PatientBookings from "../pages/Patient/PatientBookings";
import PatientSettings from "../pages/Patient/PatientSettings";
import PatientEMR from "../pages/Patient/PatientEMR";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/create-queue" element={<CreateQueue />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/google-auth" element={<Login />} />

        {/* Admin routes */}
        <Route
          path="/admin-activity-logs"
          element={
            <ProtectedRoute role="admin">
              <AdminActivityLogs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-doctors"
          element={
            <ProtectedRoute role="admin">
              <AdminDoctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-schedule"
          element={
            <ProtectedRoute role="admin">
              <AdminSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-appointment"
          element={
            <ProtectedRoute role="admin">
              <AdminAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-patients"
          element={
            <ProtectedRoute role="admin">
              <AdminPatients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-patient-emr"
          element={
            <ProtectedRoute role="admin">
              <AdminPatientEMR />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-profile"
          element={
            <ProtectedRoute role="admin">
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-queueing"
          element={
            <ProtectedRoute role="admin">
              <AdminQueueing />
            </ProtectedRoute>
          }
        />

        {/* Doctor routes */}
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute role="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-appointments"
          element={
            <ProtectedRoute role="doctor">
              <DoctorAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-patients"
          element={
            <ProtectedRoute role="doctor">
              <DoctorPatients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-settings"
          element={
            <ProtectedRoute role="doctor">
              <DoctorSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-profile"
          element={
            <ProtectedRoute role="doctor">
              <DoctorProfile />
            </ProtectedRoute>
          }
        />

        {/* Patient routes */}
        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute role="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient-emr"
          element={
            <ProtectedRoute role="patient">
              <PatientEMR />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient-profile"
          element={
            <ProtectedRoute role="patient">
              <PatientProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient-doctors"
          element={
            <ProtectedRoute role="patient">
              <PatientDoctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient-scheduled"
          element={
            <ProtectedRoute role="patient">
              <PatientScheduled />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient-bookings"
          element={
            <ProtectedRoute role="patient">
              <PatientBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient-settings"
          element={
            <ProtectedRoute role="patient">
              <PatientSettings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;