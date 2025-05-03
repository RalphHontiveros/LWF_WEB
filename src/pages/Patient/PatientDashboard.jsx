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
  const [warningMessage, setWarningMessage] = useState(""); // 👈 NEW

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setWarningMessage(""); // Clear warning on modal close/open
  };

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
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setAppointments([]);
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
          setAppointments([]);
          return;
        }
        const data = await res.json();
        setAppointments(data.appointments || []);
      } catch (err) {
        console.error("Error fetching appointment status:", err);
        setAppointments([]);
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
        const res = await fetch(
          `/api/patient/available-schedules/${selectedDoctor}`
        );
        const data = await res.json();
        setAvailableSchedules(data.availableSchedules || []);
        setSelectedSchedule("");
      } catch (err) {
        console.error("Schedule fetch error:", err);
      }
    };
    fetchSchedules();
  }, [selectedDoctor]);

  const handleSubmitAppointment = async (e) => {
    e.preventDefault();
    if (!userId) return console.error("Missing patient ID in cookie");

    const hasPending = appointments.some((appt) => appt.status === "pending");
    if (hasPending) {
      setWarningMessage(
        "You already have a pending appointment. Please wait for it to be confirmed."
      );
      return;
    }

    setWarningMessage(""); // clear warning

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

  const getStatusReminder = (status) => {
    if (status === "pending") {
      return (
        <span className="text-xs text-red-600 mt-1">
          Reminder: Your appointment is still pending confirmation.
        </span>
      );
    }
    return null;
  };

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

        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-2">Welcome!</h2>
          <p className="text-gray-600 text-sm">
            To book an appointment, please verify your account. Visit your
            Patient Profile, fill out the required form, and complete email
            verification.
          </p>
        </div>

        {/* Stats */}
        {/* <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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
        </section> */}

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
              <h2 className="text-xl font-bold mb-6 text-center">
                Book New Appointment
              </h2>

              {/* Warning Message */}
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
                    {availableDoctors
                      .filter((doc) => doc?.doctor?._id)
                      .map((doc) => (
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
                    {availableSchedules
                      .sort((a, b) => new Date(a) - new Date(b))
                      .map((schedule, idx) => (
                        <option key={idx} value={schedule}>
                          {new Date(schedule).toLocaleString("en-PH", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            timeZone: "Asia/Manila",
                          })}
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

                {/* <div>
                  <label className="block text-sm font-medium mb-1">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border rounded-md p-2"
                    rows="2"
                  />
                </div> */}

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

        {/* Appointments List */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">Appointments</h2>
          {Array.isArray(appointments) && appointments.length ? (
            <ul className="space-y-4">
              {appointments
                .filter((appt) => appt.status === "pending")
                .map((appt) => (
                  <li
                    key={appt.appointmentId}
                    className={`bg-white p-4 rounded-lg shadow flex flex-col ${getStatusClass(
                      appt.status
                    )}`}
                  >
                    <span className="text-lg font-semibold text-blue-700">
                      {appt.reason} - Dr. {appt.doctorName || "Unknown"}
                    </span>
                    <span className="text-sm text-gray-600 mt-1">
                      {new Date(appt.scheduledDateTime).toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      Status: {appt.status}
                    </span>
                    {getStatusReminder(appt.status)}
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-gray-500">No Appointments yet.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default PatientDashboard;
