import React, { useState } from "react";
import Sidebar from "../../components/PatientSidebar";
import { FaUserMd, FaUserInjured, FaCalendarCheck, FaClock } from "react-icons/fa";

// Recharts imports
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const PatientDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dummy Data for UI Mockup
  const pieChartData = [
    { name: "Confirmed", value: 10 },
    { name: "Cancelled", value: 5 },
  ];

  const barChartData = [
    { name: "January", bookings: 3 },
    { name: "February", bookings: 4 },
    { name: "March", bookings: 6 },
    { name: "April", bookings: 7 },
    { name: "May", bookings: 2 },
    { name: "June", bookings: 8 },
    { name: "July", bookings: 5 },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main className="flex-1 transition-all duration-300 overflow-y-auto px-6 mt-0 md:mt-8 mr-0 md:mr-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Patient Dashboard</h1>
          <div className="flex items-center gap-2 bg-white shadow-md rounded-md px-4 py-2 text-gray-700 text-sm">
            <span className="text-lg">📅</span>
            <span className="font-semibold">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Stats Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[{
            icon: FaUserMd,
            count: 20,
            label: "All Doctors",
          }, {
            icon: FaUserInjured,
            count: 200,
            label: "All Patients",
          }, {
            icon: FaCalendarCheck,
            count: 5,
            label: "New Bookings",
          }, {
            icon: FaClock,
            count: 3,
            label: "Today's Sessions",
          }].map(({ icon: Icon, count, label }, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition transform hover:scale-105 duration-200 flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-800">{count ?? 0}</p>
                <p className="text-gray-500 text-sm">{label}</p>
              </div>
              <Icon className="text-blue-500 text-4xl" />
            </div>
          ))}
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {/* Pie Chart: Confirmed vs Cancelled */}
          <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-transform transform hover:scale-105 relative overflow-hidden">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">Appointment Status</h2>

            <div className="flex justify-center items-center">
              <PieChart width={320} height={320}>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  label
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#00C49F" : "#FF8042"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>

            {/* Legends below the pie chart */}
            <div className="mt-6 flex justify-center space-x-8">
              <div className="flex items-center">
                <span className="block w-3 h-3 bg-[#00C49F] rounded-full mr-2"></span>
                <span className="text-sm text-gray-600">Confirmed</span>
              </div>
              <div className="flex items-center">
                <span className="block w-3 h-3 bg-[#FF8042] rounded-full mr-2"></span>
                <span className="text-sm text-gray-600">Cancelled</span>
              </div>
            </div>
          </div>

          {/* Bar Chart: Monthly Bookings */}
          <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-transform transform hover:scale-105 relative overflow-hidden">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Monthly Bookings</h2>

            <div className="flex justify-center items-center">
              <BarChart width={600} height={350} data={barChartData}>
                <CartesianGrid strokeDasharray="5 5" stroke="#e0e0e0" />
                <XAxis dataKey="name" tick={{ fill: "#8884d8", fontSize: 12 }} />
                <YAxis tick={{ fill: "#8884d8", fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Bar dataKey="bookings" fill="#82ca9d" radius={[8, 8, 0, 0]} />
              </BarChart>
            </div>

            {/* Description and Data Information */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p className="mb-2">This chart displays the total number of bookings each month.</p>
              <p>Hover over the bars to see detailed information for each month.</p>
            </div>
          </div>

        </section>

        {/* Appointments Section */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">My Appointments</h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left border-separate border-spacing-4 bg-white rounded-lg shadow-md">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="font-bold text-sm p-3">Doctor</th>
                  <th className="font-bold text-sm p-3">Scheduled Date</th>
                  <th className="font-bold text-sm p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-green-100 text-green-800">
                  <td className="text-sm p-3">Dr. John Doe</td>
                  <td className="text-sm p-3">2025-05-20</td>
                  <td className="text-sm p-3">Confirmed</td>
                </tr>
                <tr className="border-b bg-yellow-100 text-yellow-800">
                  <td className="text-sm p-3">Dr. Jane Smith</td>
                  <td className="text-sm p-3">2025-05-22</td>
                  <td className="text-sm p-3">Pending</td>
                </tr>
                <tr className="border-b bg-red-100 text-red-800">
                  <td className="text-sm p-3">Dr. Mark Lee</td>
                  <td className="text-sm p-3">2025-05-23</td>
                  <td className="text-sm p-3">Cancelled</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PatientDashboard;
