import React, { useEffect, useState } from "react";
import Sidebar from "../../components/PatientSidebar";
import { FaUserMd, FaUserInjured, FaCalendarCheck, FaClock } from "react-icons/fa";

const PatientDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [appointmentDateTime, setAppointmentDateTime] = useState("");

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/upcoming-appointments");
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        console.error("Appointments fetch error:", err);
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/available-doctors");
        const data = await response.json();
        setAvailableDoctors(data);
      } catch (err) {
        console.error("Available doctors fetch error:", err);
      }
    };

    fetchDashboardData();
    fetchAppointments();
    fetchDoctors();
  }, []);

  const handleSubmitAppointment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/create-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor: selectedDoctor.name,
          dateTime: appointmentDateTime,
          reason,
          notes,
          contactInfo,
        }),
      });

      const newAppointment = await response.json();
      setAppointments((prev) => [...prev, newAppointment]);
      toggleModal();
    } catch (err) {
      console.error("Error creating appointment:", err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <main className={`flex-1 p-6 md:p-8 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Home</h1>
          <div className="bg-white p-3 rounded-md shadow text-gray-600 flex items-center">
            📅 <span className="ml-2">Today's Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Welcome Box */}
        <section className="bg-blue-100 p-6 rounded-md mt-5">
          <h2 className="text-xl font-bold">Welcome!</h2>
          <p className="text-gray-600">
            Haven't any idea about doctors? No problem. Visit "All Doctors" or "Sessions"
            to view your appointment history.
          </p>
          <div className="mt-3 flex items-center bg-white p-2 rounded-md shadow-md">
            <input
              type="text"
              placeholder="Search Doctor and find session available"
              className="flex-1 p-2 outline-none"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Search</button>
          </div>
        </section>

        {/* Status Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[ 
            { icon: FaUserMd, count: dashboardData.doctorsCount, label: "All Doctors" },
            { icon: FaUserInjured, count: dashboardData.patientsCount, label: "All Patients" },
            { icon: FaCalendarCheck, count: dashboardData.newBookingsCount, label: "New Booking" },
            { icon: FaClock, count: dashboardData.todaySessionsCount, label: "Today Sessions" }
          ].map(({ icon: Icon, count, label }, index) => (
            <div key={index} className="bg-white p-5 rounded-md shadow-md flex items-center justify-between">
              <div>
                <p className="text-lg font-bold">{count ?? 0}</p>
                <p className="text-gray-600">{label}</p>
              </div>
              <Icon className="text-blue-500 text-2xl" />
            </div>
          ))}
        </section>

        {/* Add Appointment Button */}
        <button onClick={toggleModal} className="bg-blue-500 text-white px-6 py-2 rounded-md mt-6">
          Add Appointment
        </button>

        {/* Add Appointment Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md w-full max-w-md relative">
              <button
                onClick={toggleModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4">Add Appointment</h2>
              <form onSubmit={handleSubmitAppointment}>
                {/* Doctor and Specialization Dropdown */}
                <div className="mb-4">
                  <label className="block text-gray-600">Doctor and Specialization</label>
                  <select
                    value={selectedDoctor?.name || ""}
                    onChange={(e) => {
                      const doctor = availableDoctors.find(doc => doc.name === e.target.value);
                      setSelectedDoctor(doctor);
                    }}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select Doctor</option>
                    {availableDoctors.map((doctor, index) => (
                      <option key={index} value={doctor.name}>
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-600">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={appointmentDateTime}
                    onChange={(e) => setAppointmentDateTime(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-600">Reason</label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Reason for the visit"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-600">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Any additional notes"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-600">Contact Info</label>
                  <input
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Contact info"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-md"
                >
                  Save Appointment
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Upcoming Appointments */}
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
          {appointments.length > 0 ? (
            <ul>
              {appointments.map((appointment, index) => (
                <li key={index} className="mb-4 p-4 bg-white rounded-md shadow-md">
                  <p className="font-bold">{appointment.doctorName}</p>
                  <p>{appointment.specialization}</p>
                  <p>{appointment.dateTime}</p>
                  <p>{appointment.status}</p>
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
