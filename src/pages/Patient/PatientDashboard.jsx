import React, { useState, useEffect } from "react";
import Sidebar from "../../components/PatientSidebar";
import {
  FaUserMd,
  FaUserInjured,
  FaCalendarCheck,
  FaClock,
} from "react-icons/fa";

// Recharts imports
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const PatientDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [availableSchedules, setAvailableSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [contactInfo, setContactInfo] = useState({ phone: "", email: "" });
  const [warningMessage, setWarningMessage] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/patient/available-doctors");
        const data = await res.json();
        setAvailableDoctors(data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!selectedDoctor) return;
      try {
        const res = await fetch(
          `/api/patient/available-schedules/${selectedDoctor}`
        );
        const data = await res.json();
        setAvailableSchedules(data.availableSchedules || []);
      } catch (err) {
        console.error("Error fetching schedules:", err);
      }
    };
    fetchSchedules();
  }, [selectedDoctor]);

  const handleSubmitAppointment = async (e) => {
    e.preventDefault();
    const userId = document.cookie.match(/(^| )UserID=([^;]+)/)?.[2];
    if (!userId) return console.error("Missing patient ID");

    try {
      const res = await fetch(`/api/patient/book-appointment/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctor,
          scheduledDateTime: selectedSchedule,
          reason,
          notes,
          contactInfo,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Unknown error");

      setIsModalOpen(false);
      // optionally refresh appointments here
    } catch (err) {
      setWarningMessage(err.message);
      console.error("Error booking appointment:", err);
    }
  };

  // Dummy Data for UI Mockup
  const pieChartData = [
    { name: "Confirmed", value: 24 },
    { name: "Cancelled", value: 8 },
  ];

  const barChartData = [
    { name: "January", bookings: 11 },
    { name: "February", bookings: 23 },
    { name: "March", bookings: 14 },
    { name: "April", bookings: 15 },
    { name: "May", bookings: 21 },
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
          <h1 className="text-3xl font-bold text-gray-800">
            Patient Dashboard
          </h1>
          <div className="flex items-center gap-2 bg-white shadow-md rounded-md px-4 py-2 text-gray-700 text-sm">
            <span className="text-lg">📅</span>
            <span className="font-semibold">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Stats Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            {
              icon: FaUserMd,
              count: 20,
              label: "All Doctors",
            },
            {
              icon: FaUserInjured,
              count: 14,
              label: "All Patients",
            },
            {
              icon: FaCalendarCheck,
              count: 5,
              label: "My Bookings",
            },
            {
              icon: FaClock,
              count: 1,
              label: "Today's Appointment",
            },
          ].map(({ icon: Icon, count, label }, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition transform hover:scale-105 duration-200 flex items-center justify-between"
            >
              <div>
                <p className="text-3xl font-bold text-gray-800">{count ?? 0}</p>
                <p className="text-gray-500 text-sm">{label}</p>
              </div>
              <Icon className="text-blue-500 text-4xl" />
            </div>
          ))}
        </section>

        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md"
          >
            + Book Appointment
          </button>
        </div>

        {/* Charts Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {/* Pie Chart: Confirmed vs Cancelled */}
          <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-transform transform hover:scale-105 relative overflow-hidden">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
              Appointment Status
            </h2>

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
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? "#00C49F" : "#FF8042"}
                    />
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
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
              Monthly Bookings
            </h2>

            <div className="flex justify-center items-center">
              <BarChart width={600} height={350} data={barChartData}>
                <CartesianGrid strokeDasharray="5 5" stroke="#e0e0e0" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#8884d8", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#8884d8", fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Bar dataKey="bookings" fill="#82ca9d" radius={[8, 8, 0, 0]} />
              </BarChart>
            </div>

            {/* Description and Data Information */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p className="mb-2">
                This chart displays the total number of bookings each month.
              </p>
              <p>
                Hover over the bars to see detailed information for each month.
              </p>
            </div>
          </div>
        </section>

        {/* Appointments Section
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            My Appointments
          </h2>
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
        </section> */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white p-8 rounded-lg w-full max-w-lg shadow-lg relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-6 text-center">
                Book New Appointment
              </h2>

              {warningMessage && (
                <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4 text-sm">
                  {warningMessage}
                </div>
              )}

              <form onSubmit={handleSubmitAppointment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select Doctor
                  </label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full border rounded-md p-2"
                    required
                  >
                    <option value="">-- Choose Doctor --</option>
                    {availableDoctors.map((doc) => (
                      <option key={doc.doctor._id} value={doc.doctor._id}>
                        Dr. {doc.fullName} ({doc.specialization})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select Schedule
                  </label>
                  <select
                    value={selectedSchedule}
                    onChange={(e) => setSelectedSchedule(e.target.value)}
                    className="w-full border rounded-md p-2"
                    required
                  >
                    <option value="">-- Choose Schedule --</option>
                    {availableSchedules.map((schedule, idx) => (
                      <option key={idx} value={schedule}>
                        {new Date(schedule).toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Reason
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full border rounded-md p-2"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Phone"
                    value={contactInfo.phone}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, phone: e.target.value })
                    }
                    className="border rounded-md p-2"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={contactInfo.email}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, email: e.target.value })
                    }
                    className="border rounded-md p-2"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
                >
                  Confirm Appointment
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;
