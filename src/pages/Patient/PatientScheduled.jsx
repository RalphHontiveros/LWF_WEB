import React, { useEffect, useState } from "react";
import Sidebar from "../../components/PatientSidebar";
import { FaCalendarAlt } from "react-icons/fa";
import axios from "axios";

const ScheduledSessions = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("/api/patient/my-appointments/status", {
          withCredentials: true,
        });
        setAppointments(response.data.appointments || []);
      } catch (error) {
        console.error("Error fetching appointments:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);
console.log("Appointments:", appointments);
  const filteredAppointments = appointments.filter((appointment) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      appointment.doctorName?.toLowerCase().includes(lowerSearch) ||
      appointment.reason?.toLowerCase().includes(lowerSearch) ||
      new Date(appointment.scheduledDateTime)
        .toLocaleDateString()
        .toLowerCase()
        .includes(lowerSearch)
    );
  });

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };


  const handleCancel = (id) => {
  setSelectedAppointmentId(id);
  setCancelReason("");
  setShowCancelModal(true);
};

const confirmCancel = async () => {
  console.log("confirmCancel function called");

  if (!cancelReason.trim()) {
    alert("Please provide a reason for cancellation.");
    return;
  }

  try {
    await axios.post(
      `/appointments/cancel/${selectedAppointmentId}`,
      { reason: cancelReason },
      { withCredentials: true }
    );

    console.log("Cancel successful:", cancelReason, selectedAppointmentId);

    setAppointments((prev) =>
      prev.map((appt) =>
        appt._id === selectedAppointmentId
          ? { ...appt, status: "Cancelled", cancelNote: cancelReason }
          : appt
      )
    );

    setShowCancelModal(false);
  } catch (error) {
    console.error("Cancel error:", error.response?.data || error.message);
  }
};



  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Cancel Appointment</h2>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter reason for cancellation..."
              className="w-full h-24 p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Scheduled Sessions</h1>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow text-gray-600 mt-4 sm:mt-0">
            <FaCalendarAlt className="text-blue-500" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search by doctor, reason, or date"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-1/2 px-4 py-2 border rounded-md shadow-sm mb-6 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <p className="text-center text-gray-600">No matching sessions found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {paginatedAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
                >
                  <p className="text-lg font-semibold text-blue-700 mb-1">
                    Doctor: {appointment.doctorName || "Unknown"}
                  </p>
                  <p className="text-gray-700">Reason: {appointment.reason}</p>
                  <p className="text-gray-700">
                    Date: {new Date(appointment.scheduledDateTime).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">Time: {appointment.timeSlot}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Status: <span className="font-medium">{appointment.status || "Pending"}</span>
                  </p>
                  <button
                    onClick={() => handleCancel(appointment._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 mt-4"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center items-center space-x-2">
              <button
                className="px-3 py-1 border rounded bg-white hover:bg-blue-100 disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white hover:bg-blue-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 border rounded bg-white hover:bg-blue-100 disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ScheduledSessions;
