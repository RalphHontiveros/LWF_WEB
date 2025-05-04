import React, { useCallback, useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { FaClipboardList } from "react-icons/fa";
import DateFormat from "../../utils/dateFormat";
import axios from "axios";

const AdminAppointments = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false); // Add delete confirmation modal state
  const [appointments, setAppointments] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;

  const handleGetAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/appointments/");
      setAppointments(response.data.appointments);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleGetAppointments();
  }, [handleGetAppointments]);

  const handleRescheduleClick = (appointment) => {
    setSelectedAppointment(appointment);
    const existingDate = new Date(appointment.scheduledDateTime);
    setNewDate(existingDate.toISOString().split("T")[0]);  // Set date in YYYY-MM-DD format
    setNewTime(existingDate.toISOString().split("T")[1].substring(0, 5)); // Set time in HH:MM format
    setShowModal(true);
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    const newScheduledDateTime = `${newDate}T${newTime}:00`;  // Adding seconds for proper ISO 8601 format
    try {
      setLoading(true);
      await axios.patch(`/api/admin/appointments/reschedule/${selectedAppointment.appointmentId}`, {
        newScheduledDateTime,
      });
      await handleGetAppointments();  // Refresh the appointments after rescheduling
      setShowModal(false);
      setNewDate("");
      setNewTime("");
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
    } finally {
      setLoading(false);
    }
  }; 
  console.log(newTime);

  const openConfirmModal = (appointment, actionType) => {
    setSelectedAppointment(appointment);
    setConfirmAction(actionType);
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedAppointment) return;
    try {
      setLoading(true);
      if (confirmAction === "confirm") {
        await axios.patch(`/api/admin/appointments/confirm/${selectedAppointment.appointmentId}`);
      } else if (confirmAction === "cancel") {
        await axios.patch(`/api/admin/appointments/cancel/${selectedAppointment.appointmentId}`);
      }
      await handleGetAppointments();
    } catch (error) {
      console.error("Error during confirm/cancel action:", error);
    } finally {
      setShowConfirmModal(false);
      setSelectedAppointment(null);
      setConfirmAction(null);
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;
    try {
      setLoading(true);
      await axios.delete(`/api/admin/delete-appointment/${selectedAppointment.appointmentId}`);
      await handleGetAppointments();  // Refresh appointments list
      setShowDeleteConfirmModal(false); // Close delete confirmation modal
    } catch (error) {
      console.error("Error deleting appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination calculation
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className="flex-1 p-4 lg:p-8 transition-all duration-300">
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
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Doctor</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Reason</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentAppointments.map((appt, index) => (
                <tr key={appt.appointmentId} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{appt.patient?.fullName || "N/A"}</td>
                  <td className="px-6 py-4">{appt.patient.email}</td>
                  <td className="px-6 py-4">{appt.patient.contactNumber}</td>
                  <td className="px-6 py-4">{appt.doctorName}</td>
                  <td className="px-6 py-4">{DateFormat(appt.scheduledDateTime)}</td>
                  <td className="px-6 py-4">{appt.reason}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${appt.status === "confirmed" ? "bg-green-200 text-green-800" : appt.status === "cancelled" ? "bg-red-200 text-red-800" : appt.status === "rescheduled" ? "bg-blue-200 text-blue-800" : "bg-yellow-200 text-yellow-800"}`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => openConfirmModal(appt, "confirm")}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => openConfirmModal(appt, "cancel")}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleRescheduleClick(appt)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Reschedule
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        setSelectedAppointment(appt);
                        setShowDeleteConfirmModal(true); // Open delete confirmation modal
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Reschedule Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Reschedule Appointment</h2>
              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    className="w-full border px-3 py-2 rounded mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    required
                    className="w-full border px-3 py-2 rounded mt-1"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirm/Cancel Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {confirmAction === "confirm" ? "Confirm" : "Cancel"} Appointment
              </h2>
              <p>
                Are you sure you want to{" "}
                <strong>{confirmAction === "confirm" ? "confirm" : "cancel"}</strong> this
                appointment?
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  className={`${
                    confirmAction === "confirm" ? "bg-green-600" : "bg-red-600"
                  } text-white px-4 py-2 rounded`}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirmModal && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Delete Appointment</h2>
              <p>Are you sure you want to delete this appointment?</p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirmModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAppointment}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminAppointments; 