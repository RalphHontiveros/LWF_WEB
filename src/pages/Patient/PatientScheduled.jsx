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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
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
