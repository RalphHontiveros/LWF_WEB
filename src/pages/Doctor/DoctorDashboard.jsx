import React, { useEffect, useState } from "react";
import Sidebar from "../../components/DoctorSidebar";
import { FaUserInjured, FaCalendarAlt, FaStethoscope, FaClipboardList } from "react-icons/fa";

const DoctorDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableDate, setAvailableDate] = useState("");
  const [availableTime, setAvailableTime] = useState("");

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

  const handleSetSchedule = async (e) => {
    e.preventDefault();
  
    // Make sure availableTime is a comma-separated string like "09:00, 10:00, 11:00"
    const timeSlots = availableTime.split(",").map(t => t.trim());
  
    try {
      const token = localStorage.getItem("token"); // Or wherever you store JWT
  
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

        {/* Action Button */}
        <div className="mt-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            + Set Availability
          </button>
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

        {/* Modal for setting availability */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-xl font-bold mb-4">Set Available Schedule</h2>
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
                  <label className="block text-gray-700 mb-1">
                    Time Slots (comma-separated)
                  </label>
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
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
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
