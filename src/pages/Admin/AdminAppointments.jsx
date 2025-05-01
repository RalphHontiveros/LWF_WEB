import React, { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { FaClipboardList } from "react-icons/fa";

const AdminAppointments = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patient: "John Doe",
      doctor: "Dr. Smith",
      date: "2025-05-01",
      time: "10:00 AM",
      status: "Confirmed",
    },
    {
      id: 2,
      patient: "Jane Roe",
      doctor: "Dr. Lee",
      date: "2025-05-02",
      time: "11:30 AM",
      status: "Cancelled",
    },
  ]);

  const handleRescheduleClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    console.log("Rescheduled:", selectedAppointment, newDate, newTime);
    setShowModal(false);
    setNewDate("");
    setNewTime("");
  };

  const handleStatusChange = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id ? { ...appt, status: newStatus } : appt
      )
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <main className="flex-1 p-8 transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaClipboardList className="text-blue-600" /> Appointments
          </h1>
        </div>

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto text-left">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-6 py-3">Patient</th>
                <th className="px-6 py-3">Doctor</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{appt.patient}</td>
                  <td className="px-6 py-4">{appt.doctor}</td>
                  <td className="px-6 py-4">{appt.date}</td>
                  <td className="px-6 py-4">{appt.time}</td>
                  <td className="px-6 py-4">
                    <select
                      value={appt.status}
                      onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                      className={`px-2 py-1  rounded-full text-xs font-medium ${
                        appt.status === "Confirmed"
                          ? "bg-green-200 text-green-800"
                          : appt.status === "Cancelled"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 space-x-2">

                    <button
                      onClick={() => handleRescheduleClick(appt)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Reschedule
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Reschedule */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Reschedule Appointment</h2>
              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full border px-3 py-2 rounded mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full border px-3 py-2 rounded mt-1"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
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

export default AdminAppointments;
