import React, { useState } from "react";
import Sidebar from "../../components/PatientSidebar";
import {
  FaUserMd,
  FaUserInjured,
  FaCalendarCheck,
  FaClock,
} from "react-icons/fa";

const PatientDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main className="flex-1 transition-all duration-300 overflow-y-auto px-6 mt-0 md:mt-8 mr-0 md:mr-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Patient Dashboard</h1>
          <div className="flex items-center gap-2 bg-white shadow rounded-md px-4 py-2 text-gray-700 text-sm">
            📅 <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-2">Welcome!</h2>
          <p className="text-gray-600 text-sm">
            Don't know which doctor to consult? Visit{" "}
            <span className="font-medium text-blue-600 cursor-pointer hover:underline">
              All Doctors
            </span>{" "}
            or{" "}
            <span className="font-medium text-blue-600 cursor-pointer hover:underline">
              Sessions
            </span>{" "}
            to see your appointment history.
          </p>
        </div>

        {/* Stat Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { icon: FaUserMd, count: 10, label: "All Doctors" },
            { icon: FaUserInjured, count: 24, label: "All Patients" },
            { icon: FaCalendarCheck, count: 3, label: "New Bookings" },
            { icon: FaClock, count: 5, label: "Today's Sessions" },
          ].map(({ icon: Icon, count, label }, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition flex items-center justify-between"
            >
              <div>
                <p className="text-2xl font-bold text-gray-800">{count}</p>
                <p className="text-gray-500">{label}</p>
              </div>
              <Icon className="text-blue-500 text-3xl" />
            </div>
          ))}
        </section>

        {/* Add Appointment Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={toggleModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition"
          >
            + Book Appointment
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white p-8 rounded-lg w-full max-w-lg shadow-lg relative">
              <button
                onClick={toggleModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-6 text-center">
                Book New Appointment
              </h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select Doctor
                  </label>
                  <select
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-300"
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Doctor --</option>
                    <option value="1">Dr. Jane Doe – Dermatology</option>
                    <option value="2">Dr. John Smith – Cardiology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select Schedule
                  </label>
                  <select
                    className={`w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-300 ${
                      !selectedDoctor ? "bg-gray-100 cursor-not-allowed text-gray-400" : ""
                    }`}
                    disabled={!selectedDoctor}
                    required
                  >
                    <option value="">-- Choose Schedule --</option>
                    <option value="1">Mon, May 6 – 10:00 AM</option>
                    <option value="2">Tue, May 7 – 3:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Reason
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Notes
                  </label>
                  <textarea
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-300"
                    placeholder="Optional notes"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md shadow-md"
                >
                  Confirm Appointment
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Upcoming Appointments */}
        <section>
          <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
          <ul className="space-y-4">
            <li className="bg-white p-4 rounded-lg shadow flex flex-col">
              <span className="text-lg font-semibold text-blue-700">
                Skin Check – Dr. Jane Doe
              </span>
              <span className="text-sm text-gray-600 mt-1">
                Mon, May 6, 2025 – 10:00 AM
              </span>
            </li>
            <li className="bg-white p-4 rounded-lg shadow flex flex-col">
              <span className="text-lg font-semibold text-blue-700">
                Heart Consultation – Dr. John Smith
              </span>
              <span className="text-sm text-gray-600 mt-1">
                Tue, May 7, 2025 – 3:00 PM
              </span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default PatientDashboard;