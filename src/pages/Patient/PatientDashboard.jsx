import React, { useEffect, useState } from "react";
import Sidebar from "../../components/PatientSidebar";
import { FaUserMd, FaUserInjured, FaCalendarCheck, FaClock } from "react-icons/fa";

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

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
  };

  const userId = getCookie("UserID");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/patient/dashboard");
        const data = await res.json();
        setDashboardData(data);
        setAppointments(data.upcomingAppointments || []); // Ensure it's always an array
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setAppointments([]); // Fallback to an empty array if there is an error
      }
    };

    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/patient/available-doctors");
        const data = await res.json();
        setAvailableDoctors(data);
      } catch (err) {
        console.error("Available doctors fetch error:", err);
      }
    };

    const fetchAppointmentStatus = async () => {
      try {
        const res = await fetch("/api/patient/my-appointments/status");
        if (res.status === 404) {
          console.log("No appointments found for this patient");
          setAppointments([]); // Fallback to an empty array if no appointments exist
          return;
        }
        const data = await res.json();
        setAppointments(data.appointments || []); // Ensure it's always an array
      } catch (err) {
        console.error("Error fetching appointment status:", err);
        setAppointments([]); // Fallback to an empty array if there's an error
      }
    };

    fetchDashboardData();
    fetchDoctors();
    fetchAppointmentStatus();
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!selectedDoctor) return;
      try {
        const res = await fetch(`/api/patient/available-schedules/${selectedDoctor}`);
        const data = await res.json();
        setAvailableSchedules(data.availableSchedules || []);
        setSelectedSchedule(""); // Reset selection when doctor changes
      } catch (err) {
        console.error("Schedule fetch error:", err);
      }
    };
    fetchSchedules();
  }, [selectedDoctor]);

  const handleSubmitAppointment = async (e) => {
    e.preventDefault();
    if (!userId) return console.error("Missing patient ID in cookie");

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

      setAppointments((prev) => [...prev, result.newAppointment]);
      toggleModal();
    } catch (err) {
      console.error("Error creating appointment:", err.message);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "rescheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Pagination Logic
  const indexOfLastAppointment = currentPage * rowsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - rowsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

  const handleNextPage = () => {
    if (currentAppointments.length === rowsPerPage && currentAppointments.length < appointments.length) {
      setCurrentPage((prev) => prev + 1);
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

        {/* Welcome */}
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

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[ 
            { icon: FaUserMd, count: dashboardData.doctorsCount, label: "All Doctors" },
            { icon: FaUserInjured, count: dashboardData.patientsCount, label: "All Patients" },
            { icon: FaCalendarCheck, count: dashboardData.newBookingsCount, label: "New Bookings" },
            { icon: FaClock, count: dashboardData.todaySessionsCount, label: "Today's Sessions" },
          ].map(({ icon: Icon, count, label }, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition flex items-center justify-between"
            >
              <div>
                <p className="text-2xl font-bold text-gray-800">{count ?? 0}</p>
                <p className="text-gray-500">{label}</p>
              </div>
              <Icon className="text-blue-500 text-3xl" />
            </div>
          ))}
        </section>

        {/* Book Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={toggleModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md"
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
                  <label className="block text-sm font-semibold">Select Doctor</label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Choose a doctor</option>
                    {availableDoctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedDoctor && (
                  <div>
                    <label className="block text-sm font-semibold">Select Schedule</label>
                    <select
                      value={selectedSchedule}
                      onChange={(e) => setSelectedSchedule(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Choose a schedule</option>
                      {availableSchedules.map((schedule) => (
                        <option key={schedule.id} value={schedule.dateTime}>
                          {new Date(schedule.dateTime).toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold">Reason</label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold">Contact Info</label>
                  <input
                    type="text"
                    placeholder="Phone or Email"
                    value={contactInfo.phone || contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    disabled={!selectedDoctor || !selectedSchedule || !reason}
                    className="bg-blue-600 text-white py-2 px-6 rounded-md"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Upcoming Appointments */}
        {appointments.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Upcoming Appointments</h3>
            <table className="w-full border-separate border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left border-b-2 border-gray-300 py-3 px-6 font-semibold text-sm text-gray-700">Doctor</th>
                  <th className="text-left border-b-2 border-gray-300 py-3 px-6 font-semibold text-sm text-gray-700">Date/Time</th>
                  <th className="text-left border-b-2 border-gray-300 py-3 px-6 font-semibold text-sm text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentAppointments.map((appointment, index) => (
                  <tr key={appointment.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <td className="border-b border-gray-300 py-3 px-6 text-sm text-gray-800">{appointment.doctorName}</td>
                    <td className="border-b border-gray-300 py-3 px-6 text-sm text-gray-800">{new Date(appointment.scheduledDateTime).toLocaleString()}</td>
                    <td
                      className={`border-b border-gray-300 py-3 px-6 text-sm font-medium ${getStatusClass(appointment.status)}`}
                    >
                      {appointment.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="bg-gray-300 text-gray-700 py-1 px-4 rounded-md"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                className="bg-gray-300 text-gray-700 py-1 px-4 rounded-md"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;
