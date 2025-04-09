import React, { useEffect, useState } from "react";
import Sidebar from "../../components/PatientSidebar";
import { FaUserMd, FaUserInjured, FaCalendarCheck, FaClock } from "react-icons/fa";

const PatientDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({});
  const [appointments, setAppointments] = useState([]);
  
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Fetch dashboard data and upcoming appointments from the backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/upcoming-appointments");
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchDashboardData();
    fetchAppointments();
  }, []);

  // Handle appointment form submission
  const handleSubmitAppointment = async (event) => {
    event.preventDefault();

    const doctor = event.target.doctor.value;
    const session = event.target.session.value;
    const dateTime = event.target.dateTime.value;

    try {
      const response = await fetch("/api/create-appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doctor, session, dateTime }),
      });
      const newAppointment = await response.json();
      setAppointments((prevAppointments) => [...prevAppointments, newAppointment]);
      toggleModal();
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className={`flex-1 p-8 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Home</h1>
          <div className="bg-white p-3 rounded-md shadow text-gray-600 flex items-center">
            📅 <span className="ml-2">Today's Date: 2022-06-03</span>
          </div>
        </div>

        <div className="bg-blue-100 p-6 rounded-md mt-5 flex items-center">
          <div>
            <h2 className="text-xl font-bold">Welcome!</h2>
            <p className="text-gray-600">
              Haven't any idea about doctors? No problem, jump to "All Doctors" or "Sessions"
              to track your past and future appointment history.
            </p>
            <div className="mt-3 flex items-center bg-white p-2 rounded-md shadow-md">
              <input
                type="text"
                placeholder="Search Doctor and We will Find The Session Available"
                className="flex-1 p-2 outline-none"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Search</button>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-4 gap-4 mt-5">
          <div className="bg-white p-5 rounded-md shadow-md flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">{dashboardData.doctorsCount}</p>
              <p className="text-gray-600">All Doctors</p>
            </div>
            <FaUserMd className="text-blue-500 text-2xl" />
          </div>
          <div className="bg-white p-5 rounded-md shadow-md flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">{dashboardData.patientsCount}</p>
              <p className="text-gray-600">All Patients</p>
            </div>
            <FaUserInjured className="text-blue-500 text-2xl" />
          </div>
          <div className="bg-white p-5 rounded-md shadow-md flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">{dashboardData.newBookingsCount}</p>
              <p className="text-gray-600">New Booking</p>
            </div>
            <FaCalendarCheck className="text-blue-500 text-2xl" />
          </div>
          <div className="bg-white p-5 rounded-md shadow-md flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">{dashboardData.todaySessionsCount}</p>
              <p className="text-gray-600">Today Sessions</p>
            </div>
            <FaClock className="text-blue-500 text-2xl" />
          </div>
        </div>

        {/* Button to open modal */}
        <button
          onClick={toggleModal}
          className="bg-blue-500 text-white px-6 py-2 rounded-md mt-5"
        >
          Add Appointment
        </button>

        {/* Modal for adding appointment */}
        {isModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 transition-opacity duration-500 opacity-100">
            <div className="bg-white p-6 rounded-md w-1/3">
              <h2 className="text-xl font-bold mb-4">Add Appointment</h2>
              <form onSubmit={handleSubmitAppointment}>
                <div className="mb-4">
                  <label className="block text-gray-600">Doctor</label>
                  <input
                    type="text"
                    name="doctor"
                    placeholder="Doctor Name"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600">Session</label>
                  <input
                    type="text"
                    name="session"
                    placeholder="Session Title"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600">Date & Time</label>
                  <input
                    type="datetime-local"
                    name="dateTime"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-2 rounded-md"
                  >
                    Save Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Upcoming Appointments */}
        <div className="mt-6">
          <h2 className="text-xl font-bold">Upcoming Appointments</h2>
          {appointments.map((appointment) => (
            <div key={appointment.appointmentNumber} className="mt-4">
              <div className="bg-white p-4 rounded-md shadow-md flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold">Appointment {appointment.appointmentNumber}</p>
                  <p className="text-gray-600">{appointment.sessionTitle}</p>
                  <p className="text-gray-600">Doctor: {appointment.doctorName}</p>
                  <p className="text-gray-600">Scheduled: {appointment.scheduledDateTime}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
