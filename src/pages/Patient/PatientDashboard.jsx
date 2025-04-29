import React, { useEffect, useState } from "react";
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
  const [dashboardData, setDashboardData] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [availableSchedules, setAvailableSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [contactInfo, setContactInfo] = useState({ phone: "", email: "" });

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/patient/dashboard");
        const data = await response.json();
        setAppointments(data.upcomingAppointments || []);
        setDashboardData(data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/patient/available-doctors");
        const data = await response.json();
        setAvailableDoctors(data);
      } catch (err) {
        console.error("Available doctors fetch error:", err);
      }
    };

    fetchDashboardData();
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchAvailableSchedules = async () => {
      if (!selectedDoctor) return;
      try {
        const response = await fetch(`/api/patient/available-schedules/${selectedDoctor}`);
        const data = await response.json();
        setAvailableSchedules(data);
      } catch (err) {
        console.error("Schedule fetch error:", err);
      }
    };

    fetchAvailableSchedules();
    setSelectedSchedule("");
  }, [selectedDoctor]);

  const handleSubmitAppointment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/patient/book-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor: selectedDoctor,
          scheduledDateTime: selectedSchedule,
          reason,
          patientId: "", // backend should handle JWT
          contactInfo,
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Unknown error");

      setAppointments((prev) => [...prev, result.newAppointment]);
      toggleModal();
    } catch (err) {
      console.error("Error creating appointment:", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

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
            <span className="font-medium text-blue-600 cursor-pointer hover:underline">All Doctors</span> or{" "}
            <span className="font-medium text-blue-600 cursor-pointer hover:underline">Sessions</span> to see your appointment history.
          </p>
        </div>

        {/* Stat Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { icon: FaUserMd, count: dashboardData.doctorsCount, label: "All Doctors" },
            { icon: FaUserInjured, count: dashboardData.patientsCount, label: "All Patients" },
            { icon: FaCalendarCheck, count: dashboardData.newBookingsCount, label: "New Bookings" },
            { icon: FaClock, count: dashboardData.todaySessionsCount, label: "Today's Sessions" },
          ].map(({ icon: Icon, count, label }, idx) => (
            <div key={idx} className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-800">{count ?? 0}</p>
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
              <h2 className="text-xl font-bold mb-6 text-center">Book New Appointment</h2>
              <form onSubmit={handleSubmitAppointment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Doctor</label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-300"
                    required
                  >
                    <option value="">-- Choose Doctor --</option>
                    {availableDoctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        {doctor.name} ({doctor.specialization})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Select Schedule</label>
                  <select
                    value={selectedSchedule}
                    onChange={(e) => setSelectedSchedule(e.target.value)}
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-300"
                    required
                  >
                    <option value="">-- Choose Schedule --</option>
                    {availableSchedules
                      .sort((a, b) => new Date(a) - new Date(b))
                      .map((schedule, idx) => (
                        <option key={idx} value={schedule}>
                          {new Date(schedule).toLocaleString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Reason</label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
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
          {appointments.length > 0 ? (
            <ul className="space-y-4">
              {appointments.map((appt) => (
                <li key={appt._id} className="bg-white p-4 rounded-lg shadow flex flex-col">
                  <span className="text-lg font-semibold text-blue-700">
                    {appt.reason} - Dr. {appt.doctorName}
                  </span>
                  <span className="text-sm text-gray-600 mt-1">
                    {new Date(appt.scheduledDateTime).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No upcoming appointments yet.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default PatientDashboard;
