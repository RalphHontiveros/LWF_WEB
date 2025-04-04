import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import AdminDashboard from "../pages/Staff/AdminDashboard"; // Assuming AdminDashboard is under 'staff'
import PatientProfile from "../pages/Patient/PatientProfile"; // Corrected import

const AppRoutes = () => {
  const isAuthenticated = localStorage.getItem("auth") === "true";

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/patient-profile" element={<PatientProfile />} />
        <Route
          path="/admin"
          element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
