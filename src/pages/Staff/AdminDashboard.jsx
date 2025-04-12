import React, { useEffect, useState } from "react";
import Sidebar from "../../components/AdminSidebar"; // Make sure this exists
import {
  FaUserInjured,
  FaCalendarAlt,
  FaStethoscope,
  FaClipboardList,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/admin-dashboard");
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/admin-appointments");
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchDashboardData();
    fetchAppointments();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main
        className={`flex-1 p-8 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="bg-white px-4 py-2 rounded shadow text-gray-600 flex items-center">
            📅
            <span className="ml-2">
              Today's Date: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Welcome Box */}
        <div className="bg-blue-100 p-6 rounded-md">
          <h2 className="text-xl font-bold">Welcome, Admin!</h2>
          <p className="text-gray-700 mt-1">
            Here's an overview of today's hospital activity and appointments.
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-5 rounded-md shadow-md flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">{dashboardData.todayAppointments}</p>
              <p className="text-gray-600">Today’s Appointments</p>
            </div>
            <FaCalendarAlt className="text-blue-500 text-2xl" />
          </div>
          <div className="bg-white p-5 rounded-md shadow-md flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">{dashboardData.totalPatients}</p>
              <p className="text-gray-600">Patients Seen</p>
            </div>
            <FaUserInjured className="text-blue-500 text-2xl" />
          </div>
          <div className="bg-white p-5 rounded-md shadow-md flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">{dashboardData.sessionsToday}</p>
              <p className="text-gray-600">Sessions Today</p>
            </div>
            <FaStethoscope className="text-blue-500 text-2xl" />
          </div>
          <div className="bg-white p-5 rounded-md shadow-md flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">{dashboardData.pendingReports}</p>
              <p className="text-gray-600">Pending Reports</p>
            </div>
            <FaClipboardList className="text-blue-500 text-2xl" />
          </div>
        </div>

        {/* Appointments List */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-gray-600">No upcoming appointments.</p>
          ) : (
            appointments.map((appt) => (
              <div key={appt.appointmentNumber} className="mt-4">
                <div className="bg-white p-4 rounded-md shadow-md">
                  <p className="text-lg font-bold">
                    Appointment #{appt.appointmentNumber}
                  </p>
                  <p className="text-gray-700">Patient: {appt.patientName}</p>
                  <p className="text-gray-600">Session: {appt.sessionTitle}</p>
                  <p className="text-gray-600">
                    Scheduled: {appt.scheduledDateTime}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
