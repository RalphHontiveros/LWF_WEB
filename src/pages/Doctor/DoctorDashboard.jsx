import React, { useEffect, useState } from "react";
import Sidebar from "../../components/DoctorSidebar";
import {
  FaUserInjured,
  FaCalendarAlt,
  FaStethoscope,
  FaClipboardList,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f87171"];

const DoctorDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableDate, setAvailableDate] = useState("");
  const [availableTime, setAvailableTime] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardResponse, appointmentsResponse] = await Promise.all([
          fetch("/api/doctor-dashboard"),
          fetch("/api/doctor-appointments"),
        ]);

        const dashboardData = await dashboardResponse.json();
        const appointmentsData = await appointmentsResponse.json();

        setDashboardData(dashboardData);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSetSchedule = async (e) => {
    e.preventDefault();
    const timeSlots = availableTime.split(",").map((t) => t.trim());

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/doctor/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ date: availableDate, timeSlots }),
      });

      if (response.ok) {
        alert("Schedule saved successfully!");
        setAvailableDate("");
        setAvailableTime("");
        setIsModalOpen(false);
      } else {
        const errorData = await response.json();
        alert("Error: " + errorData.message);
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert("Failed to save schedule.");
    }
  };

  // Sample data for chart
  const pieData = [
    { name: "Appointments", value: dashboardData.todayAppointments || 5 },
    { name: "Patients", value: dashboardData.totalPatients || 10 },
    { name: "Sessions", value: dashboardData.sessionsToday || 3 },
    { name: "Reports", value: dashboardData.pendingReports || 2 },
  ];

  const barData = [
    {
      name: "Today",
      Appointments: dashboardData.todayAppointments || 5,
    },
    {
      name: "This Week",
      Appointments: 22,
    },
    {
      name: "This Month",
      Appointments: 22,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-900">Doctor Dashboard</h1>
          <div className="bg-white p-3 rounded-md shadow-md text-gray-600 flex items-center">
            📅 <span className="ml-2">Today's Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Welcome Box */}
        <div className="bg-green-100 p-6 rounded-md mt-5">
          <h2 className="text-xl font-bold text-gray-800">Welcome, Doctor!</h2>
          <p className="text-gray-700 mt-1">
            Here’s a quick summary of your appointments and sessions for today.
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
          <div className="bg-white p-5 rounded-md shadow-md flex items-center justify-between">
            <div>
              <p className="text-xl font-semibold text-gray-900">{dashboardData.todayAppointments}</p>
              <p className="text-gray-600">Today's Appointments</p>
            </div>
            <FaCalendarAlt className="text-green-500 text-3xl" />
          </div>
          <div className="bg-white p-5 rounded-md shadow-md flex items-center justify-between">
            <div>
              <p className="text-xl font-semibold text-gray-900">{dashboardData.totalPatients}</p>
              <p className="text-gray-600">Patients Seen</p>
            </div>
            <FaUserInjured className="text-green-500 text-3xl" />
          </div>
          <div className="bg-white p-5 rounded-md shadow-md flex items-center justify-between">
            <div>
              <p className="text-xl font-semibold text-gray-900">{dashboardData.sessionsToday}</p>
              <p className="text-gray-600">Sessions Today</p>
            </div>
            <FaStethoscope className="text-green-500 text-3xl" />
          </div>
          <div className="bg-white p-5 rounded-md shadow-md flex items-center justify-between">
            <div>
              <p className="text-xl font-semibold text-gray-900">{dashboardData.pendingReports}</p>
              <p className="text-gray-600">Pending Reports</p>
            </div>
            <FaClipboardList className="text-green-500 text-3xl" />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {/* Enhanced Pie Chart UI (Light Mode Only) */}
<div className="bg-white p-8 rounded-2xl shadow-xl transition duration-300 hover:shadow-2xl">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">
    Queue Distribution Overview
  </h2>

  <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Pie Chart */}
        <div className="w-full lg:w-2/3 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                paddingAngle={4}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(1)}%)`
                }
                labelLine={false}
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  color: '#111827',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}
        <div className="w-full lg:w-1/3 space-y-3">
          {pieData.map((entry, index) => (
            <div key={`legend-${index}`} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></span>
                <span className="text-gray-700 font-medium">{entry.name}</span>
              </div>
              <span className="text-gray-500">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>



          {/* Bar Chart */}
          {/* Enhanced Bar Chart UI (Light Mode Only) */}
<div className="bg-white p-8 rounded-2xl shadow-xl transition duration-300 hover:shadow-2xl">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">
    Sessions & Appointments Overview
  </h2>

  <ResponsiveContainer width="100%" height={350}>
    <BarChart
      data={barData}
      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
      barCategoryGap="20%"
    >
      <XAxis
        dataKey="name"
        tick={{ fill: "#4B5563", fontSize: 14 }}
        axisLine={{ stroke: "#e5e7eb" }}
        tickLine={false}
      />
      <YAxis
        tick={{ fill: "#4B5563", fontSize: 14 }}
        axisLine={{ stroke: "#e5e7eb" }}
        tickLine={false}
      />
      <Tooltip
        contentStyle={{
          backgroundColor: "#ffffff",
          borderRadius: "0.5rem",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          color: "#111827",
        }}
        labelStyle={{ fontWeight: "500", color: "#4B5563" }}
      />
      <Legend
        wrapperStyle={{
          paddingTop: "10px",
          fontSize: "14px",
          color: "#6B7280",
        }}
      />
      <Bar
        dataKey="Appointments"
        fill="#60a5fa"
        radius={[8, 8, 0, 0]}
      />
      <Bar
        dataKey="Sessions"
        fill="#34d399"
        radius={[8, 8, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
</div>
        </div>

        {/* Action Button */}
        <div className="mt-10">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            + Set Availability
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white p-8 rounded-lg w-full max-w-lg shadow-lg relative">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Set Available Schedule</h2>
              <form onSubmit={handleSetSchedule}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={availableDate}
                    onChange={(e) => setAvailableDate(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Time Slots (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. 09:00,13:00,15:30"
                    value={availableTime}
                    onChange={(e) => setAvailableTime(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard;
