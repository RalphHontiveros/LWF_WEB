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
  const [confirmAction, setConfirmAction] = useState(null); // 'confirm' or 'cancel'
  const [showConfirmModal, setShowConfirmModal] = useState(false); // confirm/cancel modal

  const [appointments, setAppointments] = useState([]);

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
  }, [setAppointments]);
  useEffect(() => {
    handleGetAppointments();
  }, [handleGetAppointments]);

  const handleConfirmAppointment = useCallback(
    async (appointmentId) => {
      try {
        setLoading(true);
        await axios.post(`/api/admin/appointments/confirm/${appointmentId}`);
        // Optionally refresh appointments after confirmation
        handleGetAppointments();
      } catch (error) {
        console.error("Error confirming appointment:", error);
      } finally {
        setLoading(false);
      }
    },
    [handleGetAppointments]
  );

  const handleRescheduleClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === selectedAppointment.id
          ? { ...appt, date: newDate, time: newTime }
          : appt
      )
    );
    setShowModal(false);
    setNewDate("");
    setNewTime("");
  };

  const openConfirmModal = (appointment, actionType) => {
    setSelectedAppointment(appointment);
    setConfirmAction(actionType); // 'confirm' or 'cancel'
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedAppointment) return;

    try {
      setLoading(true);

      if (confirmAction === "confirm") {
        await axios.post(
          `/api/admin/appointments/confirm/${selectedAppointment.id}`
        );
        console.log(
          `Appointment ${selectedAppointment.id} confirmed successfully.`
        );
      }

      // You can optionally handle cancel logic here (if your API supports it)
      if (confirmAction === "cancel") {
        console.log(
          `Appointment ${selectedAppointment.id} cancelled (local update only).`
        );
      }

      // Refresh the appointments list from server
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

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

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
                <th className="px-6 py-3">Doctor</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, index) => {
                const key =
                  appt.id ??
                  `${appt.patient?.fullName || "unknown"}-${appt.timeSlot}-${
                    appt.scheduledDateTime || index
                  }`;

                return (
                  <tr key={key} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {appt.patient?.fullName || "N/A"}
                    </td>
                    <td className="px-6 py-4">{appt.doctorName}</td>
                    <td className="px-6 py-4">
                      {DateFormat(appt.scheduledDateTime)}
                    </td>
                    <td className="px-6 py-4">{appt.timeSlot}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appt.status === "confirmed"
                            ? "bg-green-200 text-green-800"
                            : appt.status === "cancelled"
                            ? "bg-red-200 text-red-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => openConfirmModal(appt, "confirm")}
                        type="button"
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => openConfirmModal(appt, "cancel")}
                        type="button"
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleRescheduleClick(appt)}
                        type="button"
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Reschedule
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Reschedule Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Reschedule Appointment</h2>
              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full border px-3 py-2 rounded mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Time
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full border px-3 py-2 rounded mt-1"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirm/Cancel Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
              <p className="mb-6">
                Do you want to{" "}
                <strong>
                  {confirmAction === "confirm" ? "confirm" : "cancel"}
                </strong>{" "}
                this appointment for{" "}
                <strong>{selectedAppointment?.patient}</strong>?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                  No
                </button>
                <button
                  onClick={handleConfirmAction}
                  className={`${
                    confirmAction === "confirm"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white px-4 py-2 rounded`}
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
