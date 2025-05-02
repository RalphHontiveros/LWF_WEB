import React, { useEffect, useState } from "react";
import Sidebar from "../../components/DoctorSidebar";
import { FaClock } from "react-icons/fa";

const MySessions = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [rescheduleModal, setRescheduleModal] = useState({ open: false, appointmentId: null });
  const [newDateTime, setNewDateTime] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/doctor/appointments/confirmed", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setAppointments(data.appointments || []);
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

  const handleReschedule = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/admin/appointments/reschedule/${rescheduleModal.appointmentId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newDateTime }),
      });

      if (res.ok) {
        alert("Appointment rescheduled.");
        setRescheduleModal({ open: false, appointmentId: null });
        setNewDateTime("");
        fetchAppointments();
      } else {
        alert("Failed to reschedule.");
      }
    } catch (err) {
      console.error("Reschedule error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className="flex-1 p-8 transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Appointments</h1>
          <div className="bg-white p-3 rounded-md shadow text-gray-600 flex items-center">
            🩺 <span className="ml-2">Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {appointments.length === 0 ? (
          <p className="text-gray-600">You currently have no scheduled sessions.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((session) => {
              const date = new Date(session.scheduledDateTime);
              const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              const dateStr = date.toLocaleDateString();

              return (
                <div
                  key={session._id}
                  className="bg-white p-5 rounded-md shadow-md hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-bold">
                        Appointment with {session.patientProfile?.name || "Unknown Patient"}
                      </h2>
                      <p className="text-gray-700">Email: {session.patient?.email}</p>
                      <p className="text-gray-700">Contact: {session.patient?.contactNumber}</p>
                      {session.patientProfile && (
                        <>
                          <p className="text-gray-600">Age: {session.patientProfile.age}</p>
                          <p className="text-gray-600">Gender: {session.patientProfile.gender}</p>
                          <p className="text-gray-600">Address: {session.patientProfile.address}</p>
                        </>
                      )}
                      <p className="text-gray-600">Time: {time}</p>
                      <p className="text-gray-600">Date: {dateStr}</p>
                    </div>
                    <div className="text-right text-blue-500">
                      <FaClock className="text-2xl mb-2" />
                      <p className="text-sm capitalize">{session.status || "scheduled"}</p>
                      <div className="mt-2 space-x-2">
                        <button
                          onClick={() =>
                            setRescheduleModal({ open: true, appointmentId: session._id })
                          }
                          className="text-sm bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancel(session._id)}
                          className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reschedule Modal */}
        {rescheduleModal.open && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Reschedule Appointment</h3>
              <label className="block mb-2 text-sm">New Date & Time</label>
              <input
                type="datetime-local"
                className="w-full border p-2 rounded mb-4"
                value={newDateTime}
                onChange={(e) => setNewDateTime(e.target.value)}
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setRescheduleModal({ open: false, appointmentId: null })}
                  className="px-4 py-2 bg-gray-300 text-black rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReschedule}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MySessions;
