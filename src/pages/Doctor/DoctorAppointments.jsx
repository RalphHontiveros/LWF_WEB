import React, { useEffect, useState } from "react";
import Sidebar from "../../components/DoctorSidebar";
import { FaClock } from "react-icons/fa";
import axios from "axios";

const DoctorAppointments = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [rescheduleModal, setRescheduleModal] = useState({ open: false, appointmentId: null });
  const [newDateTime, setNewDateTime] = useState("");
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(5);
  const [totalAppointments, setTotalAppointments] = useState(0); // New state for total appointments

  useEffect(() => {
    fetchAppointments();
  }, [currentPage]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/doctor/appointments/confirmed?page=${currentPage}&limit=${appointmentsPerPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setAppointments(data.appointments || []);
        setTotalAppointments(data.totalAppointments || 0); // Assuming the API returns the total number of appointments
      } else {
        console.error("Failed to fetch:", data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleCancel = async (id) => {
    const confirmed = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/admin/appointments/cancel/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        alert("Appointment canceled.");
        fetchAppointments();
      } else {
        alert("Failed to cancel appointment.");
      }
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Something went wrong.");
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
  
      // Convert to ISO string in UTC to avoid timezone issues
      const localDate = new Date(newDateTime);
      const isoString = localDate.toISOString(); // This ensures it's in UTC (Render-compatible)
  
      await axios.patch(
        `/api/admin/appointments/reschedule/${rescheduleModal.appointmentId}`,
        {
          newScheduledDateTime: isoString,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      await fetchAppointments(); // Refresh the updated list
      setRescheduleModal({ open: false, appointmentId: null });
      setNewDateTime("");
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      alert("Failed to reschedule appointment. You may not have permission.");
    } finally {
      setLoading(false);
    }
  };

  // Pagination controls
  const handleNextPage = () => {
    if (appointments.length < appointmentsPerPage) return; // Prevent fetching if we are on the last page
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className="flex-1 p-8 transition-all duration-300 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">My Appointments</h1>
          <div className="bg-white p-3 rounded-md shadow-md text-gray-600 flex items-center">
            🩺 <span className="ml-2 text-sm">Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {appointments.length === 0 ? (
          <p className="text-gray-600">You currently have no scheduled sessions.</p>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((session) => {
              const date = new Date(session.scheduledDateTime);
              const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              const dateStr = date.toLocaleDateString();

              return (
                <article
                  key={session._id}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <header className="mb-4">
                    <h2 className="text-xl font-semibold">{session.patientProfile?.name || "Unknown Patient"}</h2>
                    <p className="text-gray-700 text-sm">Reason: {session.reason}</p>
                    <p className="text-gray-700 text-sm">Email: {session.patient?.email}</p>
                    <p className="text-gray-700 text-sm">Contact: {session.contactInfo?.phone || "N/A"}</p>
                    {session.patientProfile && (
                      <>
                        <p className="text-gray-600 text-sm">Age: {session.patientProfile.age}</p>
                        <p className="text-gray-600 text-sm">Gender: {session.patientProfile.gender}</p>
                        <p className="text-gray-600 text-sm">Address: {session.patientProfile.address}</p>
                      </>
                    )}
                    <p className="text-gray-600 text-sm">Time: {time}</p>
                    <p className="text-gray-600 text-sm">Date: {dateStr}</p>
                    <div className="flex items-center mt-2 text-blue-500 text-sm">
                      <FaClock className="mr-1" />
                      <span>{session.status || "scheduled"}</span>
                    </div>
                  </header>

                  <div className="mt-4 flex justify-between gap-4">
                    <button
                      onClick={() => setRescheduleModal({ open: true, appointmentId: session._id })}
                      className="bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-500 transition duration-300"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancel(session._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={appointments.length < appointmentsPerPage}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg"
          >
            Next
          </button>
        </div>

        {/* Reschedule Modal */}
        {rescheduleModal.open && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
              <h3 className="text-xl font-semibold mb-4">Reschedule Appointment</h3>
              <label className="block text-sm mb-2">New Date & Time</label>
              <input
                type="datetime-local"
                className="w-full border p-3 rounded mb-6"
                value={newDateTime}
                onChange={(e) => setNewDateTime(e.target.value)}
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setRescheduleModal({ open: false, appointmentId: null })}
                  className="px-6 py-3 bg-gray-300 text-black rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRescheduleSubmit}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorAppointments;
