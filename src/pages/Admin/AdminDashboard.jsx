import React, { useEffect, useState } from "react";
import Sidebar from "../../components/AdminSidebar";
import {
  FaUserInjured,
  FaCalendarAlt,
  FaStethoscope,
  FaClipboardList,
} from "react-icons/fa";

const AdminDashboard = () => {    
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, apptRes] = await Promise.all([
          fetch("/api/admin-dashboard"),
          fetch("/api/admin-appointments"),
        ]);

        const dashboardJson = await dashboardRes.json();
        const apptJson = await apptRes.json();

        setDashboardData(dashboardJson);
        setAppointments(apptJson);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className={`flex-1 p-8 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="bg-white px-4 py-2 rounded shadow text-gray-600 flex items-center">
            🗓️ <span className="ml-2">Today's Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="bg-blue-100 p-6 rounded-md">
          <h2 className="text-xl font-bold">Welcome, Admin!</h2>
          <p className="text-gray-700 mt-1">Here's an overview of today's hospital activity and appointments.</p>
        </div>

        {loading ? (
          <p className="mt-6 text-gray-600">Loading dashboard data...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <DashboardCard label="Today’s Appointments" value={dashboardData?.todayAppointments || 0} icon={FaCalendarAlt} />
              <DashboardCard label="Patients Seen" value={dashboardData?.totalPatients || 0} icon={FaUserInjured} />
              <DashboardCard label="Sessions Today" value={dashboardData?.sessionsToday || 0} icon={FaStethoscope} />
              <DashboardCard label="Pending Reports" value={dashboardData?.pendingReports || 0} icon={FaClipboardList} />
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
              {appointments.length === 0 ? (
                <p className="text-gray-600">No upcoming appointments.</p>
              ) : (
                appointments.map((appt) => (
                  <div key={appt.appointmentNumber} className="mt-4 bg-white p-4 rounded-md shadow-md">
                    <p className="text-lg font-bold">Appointment #{appt.appointmentNumber}</p>
                    <p className="text-gray-700">Patient: {appt.patientName}</p>
                    <p className="text-gray-600">Session: {appt.sessionTitle}</p>
                    <p className="text-gray-600">Scheduled: {formatDate(appt.scheduledDateTime)}</p>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

const DashboardCard = ({ label, value, icon: Icon }) => (
  <div className="bg-white p-5 rounded-md shadow-md flex items-center justify-between">
    <div>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-gray-600">{label}</p>
    </div>
    <Icon className="text-blue-500 text-2xl" />
  </div>
);

export default AdminDashboard;
