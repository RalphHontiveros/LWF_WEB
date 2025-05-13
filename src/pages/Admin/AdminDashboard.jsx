import React, { useEffect, useState } from "react";
import Sidebar from "../../components/AdminSidebar";
import {
  FaUserInjured,
  FaCalendarAlt,
  FaStethoscope,
  FaClipboardList,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const AdminDashboard = () => {    
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main className={`flex-1 p-6 lg:p-8 transition-all duration-300`}>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Admin Dashboard</h1>
          <div className="bg-white px-6 py-2 rounded shadow text-gray-600 flex items-center mt-2 sm:mt-0">
            🗓️ <span className="ml-2 text-lg">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="bg-blue-100 p-6 rounded-md shadow-md mb-8">
          <h2 className="text-xl font-bold">Welcome, Admin!</h2>
          <p className="text-gray-700 mt-1">
            Here's an overview of today's hospital activity and appointments.
          </p>
        </div>

        {loading ? (
          <p className="mt-6 text-gray-600">Loading dashboard data...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <DashboardCard
                label="Today’s Appointments"
                value={dashboardData?.todayAppointments || 0}
                icon={FaCalendarAlt}
              />
              <DashboardCard
                label="Patients Seen"
                value={dashboardData?.totalPatients || 0}
                icon={FaUserInjured}
              />
              <DashboardCard
                label="Sessions Today"
                value={dashboardData?.sessionsToday || 0}
                icon={FaStethoscope}
              />
              <DashboardCard
                label="Pending Reports"
                value={dashboardData?.pendingReports || 0}
                icon={FaClipboardList}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-md shadow-md">
                <h2 className="text-lg font-semibold mb-4">Monthly Appointments</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="appointments" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white p-4 rounded-md shadow-md">
                <h2 className="text-lg font-semibold mb-4">Appointment Status</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
              {appointments.length === 0 ? (
                <p className="text-gray-600">No upcoming appointments.</p>
              ) : (
                appointments.map((appt) => (
                  <div
                    key={appt.appointmentNumber}
                    className="mt-4 bg-white p-4 rounded-md shadow-md"
                  >
                    <p className="text-lg font-semibold">
                      Appointment #{appt.appointmentNumber}
                    </p>
                    <p className="text-gray-700">Patient: {appt.patientName}</p>
                    <p className="text-gray-600">Session: {appt.sessionTitle}</p>
                    <p className="text-gray-600">
                      Scheduled: {formatDate(appt.scheduledDateTime)}
                    </p>
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
  <div className="bg-white p-6 rounded-md shadow-md flex items-center justify-between hover:shadow-2xl transition-all duration-300">
    <div>
      <p className="text-3xl font-semibold text-gray-800">{value}</p>
      <p className="text-gray-600">{label}</p>
    </div>
    <Icon className="text-blue-500 text-4xl" />
  </div>
);

export default AdminDashboard;
