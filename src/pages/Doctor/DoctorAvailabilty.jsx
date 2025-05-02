import React, { useState } from "react";
import Sidebar from "../../components/DoctorSidebar";

const DoctorAvailability = () => {
  const initialData = [
    { id: 1, date: "2025-05-01", timeSlots: "09:00, 13:00", availability: "Available" },
    { id: 2, date: "2025-05-02", timeSlots: "10:00, 14:00", availability: "Unavailable" },
    { id: 3, date: "2025-05-03", timeSlots: "09:00, 11:00", availability: "Available" },
    { id: 4, date: "2025-05-04", timeSlots: "08:00, 12:00", availability: "Unavailable" },
    { id: 5, date: "2025-05-05", timeSlots: "10:00, 14:00", availability: "Available" },
    { id: 6, date: "2025-05-06", timeSlots: "09:00, 13:00", availability: "Available" },
    { id: 7, date: "2025-05-07", timeSlots: "11:00, 15:00", availability: "Unavailable" },
    { id: 8, date: "2025-05-08", timeSlots: "09:00, 13:00", availability: "Available" },
    { id: 9, date: "2025-05-09", timeSlots: "10:00, 14:00", availability: "Unavailable" },
    { id: 10, date: "2025-05-10", timeSlots: "09:00, 13:00", availability: "Available" },
    { id: 11, date: "2025-05-11", timeSlots: "10:00, 14:00", availability: "Unavailable" },
    { id: 12, date: "2025-05-12", timeSlots: "09:00, 13:00", availability: "Available" },
    { id: 13, date: "2025-05-13", timeSlots: "08:00, 12:00", availability: "Unavailable" },
    { id: 14, date: "2025-05-14", timeSlots: "09:00, 13:00", availability: "Available" },
    { id: 15, date: "2025-05-15", timeSlots: "10:00, 14:00", availability: "Unavailable" },
  ];

  const [schedules, setSchedules] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editTimeSlots, setEditTimeSlots] = useState("");
  const [editAvailability, setEditAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const rowsPerPage = 10;

  const openModal = (schedule) => {
    setSelectedSchedule(schedule);
    setEditDate(schedule.date);
    setEditTimeSlots(schedule.timeSlots);
    setEditAvailability(schedule.availability);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSchedule(null);
  };

  const handleSave = () => {
    const updated = schedules.map((item) =>
      item.id === selectedSchedule.id
        ? {
            ...item,
            date: editDate,
            timeSlots: editTimeSlots,
            availability: editAvailability,
          }
        : item
    );
    setSchedules(updated);
    closeModal();
  };

  const handleDelete = (id) => {
    const filtered = schedules.filter((item) => item.id !== id);
    setSchedules(filtered);
  };

  const filteredSchedules = schedules.filter((schedule) =>
    schedule.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
    schedule.timeSlots.toLowerCase().includes(searchQuery.toLowerCase()) ||
    schedule.availability.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedSchedules = filteredSchedules.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleNextPage = () => {
    if (currentPage * rowsPerPage < filteredSchedules.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Doctor's Schedule</h2>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Schedule History</h3>

          {/* Search Box - Positioned outside the table */}
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Date, Time Slots, or Availability"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Time Slots</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Availability</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedSchedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td className="px-4 py-3">{schedule.date}</td>
                  <td className="px-4 py-3">{schedule.timeSlots}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        schedule.availability === "Available"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {schedule.availability}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
                      onClick={() => openModal(schedule)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                      onClick={() => handleDelete(schedule.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Prev
            </button>
            <span className="text-gray-700">{`Page ${currentPage} of ${Math.ceil(filteredSchedules.length / rowsPerPage)}`}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage * rowsPerPage >= filteredSchedules.length}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && selectedSchedule && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Edit Schedule</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Slots</label>
                <input
                  type="text"
                  value={editTimeSlots}
                  onChange={(e) => setEditTimeSlots(e.target.value)}
                  placeholder="e.g. 09:00, 13:00"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <select
                  value={editAvailability}
                  onChange={(e) => setEditAvailability(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option>Available</option>
                  <option>Unavailable</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAvailability;
