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
        const response = await fetch(
          `/api/patient/available-schedules/${selectedDoctor}`
        );
        const data = await response.json();
        setAvailableSchedules(data);
      } catch (err) {
        console.error("Schedule fetch error:", err);
      }
    };

    fetchAvailableSchedules();
    setSelectedSchedule(""); // Reset the selected schedule when doctor changes
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
          patientId: "", // backend should identify using JWT
          contactInfo,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unknown error");
      }

      setAppointments((prev) => [...prev, result.newAppointment]);
      toggleModal(); // Close the modal on success
    } catch (err) {
      console.error("Error creating appointment:", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main
        className={`flex-1 px-4 sm:px-6 md:px-8 py-4 transition-all duration-300 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-16"
        } overflow-y-auto`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">Home</h1>
          <div className="bg-white px-4 py-2 rounded-md shadow text-gray-600 flex items-center text-sm sm:text-base">
            📅{" "}
            <span className="ml-2">
              Today's Date: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        <section className="bg-blue-100 p-4 sm:p-6 rounded-md mt-5">
          <h2 className="text-lg sm:text-xl font-bold">Welcome!</h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Haven't any idea about doctors? No problem. Visit "All Doctors" or
            "Sessions" to view your appointment history.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[
            {
              icon: FaUserMd,
              count: dashboardData.doctorsCount,
              label: "All Doctors",
            },
            {
              icon: FaUserInjured,
              count: dashboardData.patientsCount,
              label: "All Patients",
            },
            {
              icon: FaCalendarCheck,
              count: dashboardData.newBookingsCount,
              label: "New Booking",
            },
            {
              icon: FaClock,
              count: dashboardData.todaySessionsCount,
              label: "Today Sessions",
            },
          ].map(({ icon: Icon, count, label }, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-md shadow-md flex items-center justify-between"
            >
              <div>
                <p className="text-lg font-bold">{count ?? 0}</p>
                <p className="text-gray-600 text-sm">{label}</p>
              </div>
              <Icon className="text-blue-500 text-xl sm:text-2xl" />
            </div>
          ))}
        </section>

        <button
          onClick={toggleModal}
          className="bg-blue-500 text-white px-6 py-2 rounded-md mt-6 w-full sm:w-auto"
        >
          Add Appointment
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 overflow-y-auto">
            <div className="bg-white p-6 rounded-md w-full max-w-md mx-4 relative">
              <button
                onClick={toggleModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                &times;
              </button>
              <h2 className="text-lg font-bold mb-4">Add Appointment</h2>
              <form onSubmit={handleSubmitAppointment} className="space-y-4">
                {/* Doctor and Specialization */}
                <div>
                  <label className="block text-gray-600">
                    Doctor and Specialization
                  </label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select Doctor</option>
                    {availableDoctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Available Date & Time Dropdown */}
                <div>
                  <label className="block text-gray-600">Available Date & Time</label>
                  <select
                    value={selectedSchedule}
                    onChange={(e) => setSelectedSchedule(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select Available Date & Time</option>
                    {availableSchedules
                      .sort((a, b) => new Date(a) - new Date(b)) // Optional: sort by earliest time
                      .map((schedule, i) => (
                        <option key={i} value={schedule}>
                          {new Date(schedule).toLocaleString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Reason for Appointment */}
                <div>
                  <label className="block text-gray-600">Reason</label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Reason for the visit"
                    required
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-gray-600">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Any additional notes"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-md w-full"
                >
                  Save Appointment
                </button>
              </form>
            </div>
          </div>
        )}

        <section className="mt-8">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            Upcoming Appointments
          </h2>
          {appointments.length > 0 ? (
            <ul>
              {appointments.map((appointment) => (
                <li
                  key={appointment._id}
                  className="bg-white p-4 rounded-md shadow mb-4"
                >
                  <p className="text-gray-800 font-bold">
                    {appointment.reason} with Dr. {appointment.doctorName}
                  </p>
                  <p className="text-sm text-gray-600">
                    Scheduled for:{" "}
                    {new Date(appointment.scheduledDateTime).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming appointments.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default PatientDashboard;