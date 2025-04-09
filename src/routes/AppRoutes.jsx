import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
// import { testConnection } from "../api"; 

// Page imports
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import AdminDashboard from "../pages/Staff/AdminDashboard";
import DoctorDashboard from "../pages/Doctor/DoctorDashboard";
import PatientDashboard from "../pages/Patient/PatientDashboard";
import PatientProfile from "../pages/Patient/PatientProfile";
import PatientDoctors from "../pages/Patient/PatientDoctors";
import PatientScheduled from "../pages/Patient/PatientScheduled";
import PatientBookings from "../pages/Patient/PatientBookings";
import PatientSettings from "../pages/Patient/PatientSettings";

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authToken")
  );
  const userRole = localStorage.getItem("userRole");

  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin, Doctor, Patient Dashboards */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/patient-profile" element={<PatientProfile />} />
        <Route path="/patient-doctors" element={<PatientDoctors />} />
        <Route path="/patient-scheduled" element={<PatientScheduled />} />
        <Route path="/patient-bookings" element={<PatientBookings />} />
        <Route path="/patient-settings" element={<PatientSettings />} />



        {/* Role-based Routing
        <Route path="/admin-dashboard" element={isAuthenticated && userRole === "admin" ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/doctor-dashboard" element={isAuthenticated && userRole === "doctor" ? <DoctorDashboard /> : <Navigate to="/login" />} />
        <Route path="/patient-dashboard" element={isAuthenticated && userRole === "patient" ? <PatientDashboard /> : <Navigate to="/login" />} /> */}

        {/* Redirect Google Auth */}
        <Route path="/google-auth" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;