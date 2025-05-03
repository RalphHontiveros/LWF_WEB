import React, { useState, useEffect } from "react";
import Sidebar from "../../components/DoctorSidebar";
import axios from "axios"; // Import axios for API calls

const DoctorAvailability = () => {
  const [schedules, setSchedules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editTimeSlots, setEditTimeSlots] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);  // State for the confirmation modal

  const rowsPerPage = 10;

  // Fetch doctor's availability schedule from backend
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await axios.get("/api/doctor/my-availability", {
          withCredentials: true,  // Include credentials (cookies) if necessary
        });

        // Combine available and unavailable schedules, keeping track of their status
        const combinedSchedules = [
          ...response.data.availability.available.map((slot) => ({
            ...slot,
            availability: "Available",
          })),
          ...response.data.availability.unavailable.map((slot) => ({
            ...slot,
            availability: "Unavailable",
          })),
        ];

        setSchedules(combinedSchedules);  // Set the schedules state
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchAvailability();
  }, []);

  const openModal = (schedule) => {
    setSelectedSchedule(schedule);
    setEditDate(schedule.date);
    setEditTimeSlots(schedule.timeSlots); // Ensure time slots are an array
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSchedule(null);
  };

  const handleSave = async () => {
    try {
      // Ensure timeSlots is an array (in case it's empty or malformed)
      const updatedTimeSlots = Array.isArray(editTimeSlots)
        ? editTimeSlots
        : editTimeSlots.split(",").map((slot) => slot.trim());
  
      // Prepare the data to be sent
      const updatedSchedule = {
        date: editDate,
        timeSlots: updatedTimeSlots,  // Now we're sure it's an array
      };
  
      // Send PUT request to update the schedule
      const response = await axios.put(
        `/api/doctor/reschedule/${selectedSchedule._id}`,
        updatedSchedule,
        { withCredentials: true } // Include credentials (cookies) if necessary
      );
  
      // Log response to check if update was successful
      console.log("Schedule updated:", response.data);
  
      // Update the state with the new schedule
      const updatedSchedules = schedules.map((schedule) =>
        schedule._id === selectedSchedule._id ? { ...schedule, ...updatedSchedule } : schedule
      );
  
      setSchedules(updatedSchedules);
      closeModal();
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedSchedule(schedules.find((schedule) => schedule._id === id));
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedSchedule(null);
  };

  const handleDelete = async () => {
    try {
      const scheduleToDelete = selectedSchedule;

      const deleteData = {
        date: scheduleToDelete.date,
        timeSlots: scheduleToDelete.timeSlots,
      };

      // Send DELETE request to delete the schedule or its time slots
      const response = await axios.delete(`/api/doctor/delete/${scheduleToDelete._id}`, {
        data: deleteData,  // Send data (date and timeSlots) in the body
        withCredentials: true,
      });

      console.log("Schedule deleted:", response.data);

      // Update the state to remove the deleted schedule
      const filteredSchedules = schedules.filter(
        (schedule) => schedule._id !== scheduleToDelete._id
      );
      setSchedules(filteredSchedules);
      closeDeleteModal();  // Close modal after deletion
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  const filteredSchedules = schedules.filter((schedule) =>
    schedule.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
    schedule.timeSlots.join(", ").toLowerCase().includes(searchQuery.toLowerCase()) ||
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

          {/* Search Box */}
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
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedSchedules.map((schedule) => (
                <tr key={schedule._id}>
                  <td className="px-4 py-3">{schedule.date}</td>
                  <td className="px-4 py-3">{schedule.timeSlots.join(", ")}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
                      onClick={() => openModal(schedule)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                      onClick={() => openDeleteModal(schedule._id)}  // Open delete confirmation modal
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Schedule</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Time Slots</label>
              <input
  type="text"
  value={editTimeSlots.join(", ")}  // Display time slots as a comma-separated string
  onChange={(e) => setEditTimeSlots(e.target.value.split(",").map(slot => slot.trim()))}  // Ensure timeSlots is an array
  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
/>

            </div>


            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSave}  // Save the updated schedule
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Are you sure you want to delete this schedule?</h3>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleDelete}  // Confirm delete
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAvailability;