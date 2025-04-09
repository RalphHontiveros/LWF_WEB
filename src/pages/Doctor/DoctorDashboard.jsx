import React, { useEffect, useState } from "react";
import Sidebar from "../../components/DoctorSidebar"; // Make sure you have a DoctorSidebar component
import { FaUserInjured, FaCalendarAlt, FaStethoscope, FaClipboardList } from "react-icons/fa";

const DoctorDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/doctor-dashboard");
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/doctor-appointments");
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
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className={`flex-1 p-8 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
          <div className="bg-white p-3 rounded-md shadow text-gray-600 flex items-center">
            📅 <span className="ml-2">Today's Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Welcome Box */}
        <div className="bg-green-100 p-6 rounded-md mt-5">
          <h2 className="text-xl font-bold">Welcome, Doctor!</h2>
          <p className="text-gray-700 mt-1">
            Here’s a quick summary of your appointments and sessions for today.
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-4 gap-4 mt-5">
          <div className="bg-white p-5 rounded-md shadow-md flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">{dashboardData.todayAppointments}</p>
              <p className="text-gray-600">Today's Appointments</p>
            </div>
            <FaCalendarAlt className="text-green-500 text-2xl" />
          </div>
          <div className="bg-white p-5 rounded-md shadow-md flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">{dashboardData.totalPatients}</p>
              <p className="text-gray-600">Patients Seen</p>
            </div>
            <FaUserInjured className="text-green-500 text-2xl" />
          </div>
          <div className="bg-white p-5 rounded-md shadow-md flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">{dashboardData.sessionsToday}</p>
              <p className="text-gray-600">Sessions Today</p>
            </div>
            <FaStethoscope className="text-green-500 text-2xl" />
          </div>
          <div className="bg-white p-5 rounded-md shadow-md flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">{dashboardData.pendingReports}</p>
              <p className="text-gray-600">Pending Reports</p>
            </div>
            <FaClipboardList className="text-green-500 text-2xl" />
          </div>
        </div>

        {/* Appointments List */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-gray-600">No upcoming appointments.</p>
          ) : (
            appointments.map((appt) => (
              <div key={appt.appointmentNumber} className="mt-4">
                <div className="bg-white p-4 rounded-md shadow-md">
                  <p className="text-lg font-bold">Appointment #{appt.appointmentNumber}</p>
                  <p className="text-gray-700">Patient: {appt.patientName}</p>
                  <p className="text-gray-600">Session: {appt.sessionTitle}</p>
                  <p className="text-gray-600">Scheduled: {appt.scheduledDateTime}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
