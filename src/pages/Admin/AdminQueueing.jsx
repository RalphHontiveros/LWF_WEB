import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { FaCheckCircle, FaClock, FaRegClock, FaStopCircle, FaUserMd } from "react-icons/fa";
import { createQueue, getCurrentQueueEntry, getQueues, cancelQueueEntry, nextQueueEntry, resetQueue } from "../../api";

const AdminQueueing = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const departments = [
        'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology', 
        'Hematology', 'Infectious Diseases', 'Nephrology', 'Neurology', 
        'Oncology', 'Ophthalmology', 'Orthopedics', 'Pediatrics', 
        'Psychiatry', 'Pulmonology', 'Rheumatology', 'Urology'
    ];
    const [queueData, setQueueData] = useState(null);
    const [currentQueue, setCurrentQueue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [awaitCount, setAwaitCount] = useState(0);
    const [cancelledCount, setCancelledCount] = useState(0);
    const [finishedCount, setFinishedCount] = useState(0);

    const [formData, setFormData] = useState({
        department: "",
        patientName: "",
    });

    useEffect(() => {
        const interval = setInterval(() => {
            fetchQueueData();
            fetchCurrentQueue();
        }, 5000);

        // Initial fetch
        fetchQueueData();
        fetchCurrentQueue();

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const fetchQueueData = async () => {
        try {
            const response = await getQueues();
            if (response.status === 200) {
                setQueueData(
                    response.data.filter(queue => queue.status === "waiting")
                );
                setAwaitCount(response.data.filter(queue => queue.status === "waiting").length);
                setCancelledCount(response.data.filter(queue => queue.status === "cancelled").length);
                setFinishedCount(response.data.filter(queue => queue.status === "completed").length);
                setLoading(false);
            } else {
                setError("Failed to fetch queue data.");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching queue data:", error);
            setError("An error occurred while fetching queue data.");
            setLoading(false);
        }
    };

    const handleResetQueue = async () => {
        try {
            const response = await resetQueue();
            if (response.status === 200) {
                alert("Queue reset successfully!");
                fetchQueueData(); // Refresh queue data after resetting
                fetchCurrentQueue(); // Refresh current queue data
            } else {
                alert("Failed to reset queue. Please try again.");

            }
        } catch (error) {
            console.error("Error resetting queue:", error);
            alert("An error occurred while resetting the queue. Please try again.");
        }
    };

    const handleNextQueue = async () => {
        try {
            const response = await nextQueueEntry();
            if (response.status === 200) {
                alert("Next queue entry processed successfully!");
                fetchQueueData(); // Refresh queue data after processing next queue
                fetchCurrentQueue(); // Refresh current queue data
            } else {
                alert("Failed to process next queue entry. Please try again.");
            }
        } catch (error) {
            fetchQueueData(); // Refresh queue data in case of error
            setCurrentQueue(null); // Reset current queue in case of error
        }
    };
    

    const fetchCurrentQueue = async () => {
        try {
            const response = await getCurrentQueueEntry();
            if (response.status === 200) {
                setCurrentQueue(response.data);
                setLoading(false);
            } else {
                setError("Failed to fetch queue data.");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching queue data:", error);
            setError("An error occurred while fetching queue data.");
            setCurrentQueue(null); // Reset current queue in case of error
            setLoading(false);
        }
    }

    const handleCancelQueue = async () => {
        try {
            const response = await cancelQueueEntry();
            if (response.status === 200) {
                fetchQueueData(); // Refresh queue data after cancelling
                fetchCurrentQueue(); // Refresh current queue data
            } else {
                alert("Failed to cancel queue entry. Please try again.");
            }
        } catch (error) {
            console.error("Error cancelling queue entry:", error);
            alert("An error occurred while cancelling the queue entry. Please try again.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        const queueData = {
            department: formData.department,
            patientName: formData.patientName,
        };

        try {
            const response = await createQueue(queueData);
            if (response.status === 200) {
                alert("Queue added successfully!");
                fetchQueueData(); // Refresh queue data after adding a new queue
            } else {
                alert("Failed to add queue. Please try again.");
            }
        } catch (error) {
            console.error("Error adding queue:", error);
            alert("An error occurred while adding the queue. Please try again.");
        }
        
        // Reset form data after submission
        setFormData({
            department: "",
            patientName: "",
        });
    }

    return (
        <div className="flex h-screen bg-gray-100">
                <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <main className={`flex-1 p-8 transition-all duration-300`}>
                        <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold flex items-center gap-2">
                                        Appointment Queueing
                                </h1>
                        </div>

                        <div className="overflow-x-auto">
                                <table className="table-auto w-full bg-white rounded-md shadow-md">
                                        <thead className="bg-gray-200">
                                                <tr>
                                                        <th className="px-4 py-2 text-left">Icon</th>
                                                        <th className="px-4 py-2 text-left">Description</th>
                                                        <th className="px-4 py-2 text-left">Count</th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                <tr className="hover:bg-gray-100">
                                                        <td className="px-4 py-2 text-blue-600 text-center">
                                                                <FaRegClock className="text-2xl" />
                                                        </td>
                                                        <td className="px-4 py-2">Awaiting Visits</td>
                                                        <td className="px-4 py-2 text-xl font-bold">
                                                                {awaitCount ? awaitCount : "0"}
                                                        </td>
                                                </tr>
                                                <tr className="hover:bg-gray-100">
                                                        <td className="px-4 py-2 text-red-600 text-center">
                                                                <FaStopCircle className="text-2xl" />
                                                        </td>
                                                        <td className="px-4 py-2">Cancelled Visits</td>
                                                        <td className="px-4 py-2 text-xl font-bold">
                                                                {cancelledCount ? cancelledCount : "0"}
                                                        </td>
                                                </tr>
                                                <tr className="hover:bg-gray-100">
                                                        <td className="px-4 py-2 text-green-600 text-center">
                                                                <FaCheckCircle className="text-2xl" />
                                                        </td>
                                                        <td className="px-4 py-2">Finished Visits</td>
                                                        <td className="px-4 py-2 text-xl font-bold">
                                                                {finishedCount ? finishedCount : "0"}
                                                        </td>
                                                </tr>
                                        </tbody>
                                </table>
                        </div>

                        <div className="mt-5 flex justify-between gap-2">
                                <div className="w-1/4 rounded-md bg-white shadow-md text-center items-center p-5 gap-3">
                                        <p className="text-sm">Current Serving</p>
                                        <p className="text-lg font-bold">Queue Number</p>
                                        <div className="border-2 p-3 border-red-600 mt-2 font-bold text-4xl rounded-md">
                                                {currentQueue ? currentQueue.queueNumber : "0"}
                                        </div>
                                </div>

                                <div className="w-3/4 overflow-auto max-h-[70vh]">
                                    <table className="table w-full bg-white rounded-md shadow-md">
                                            <thead className="bg-gray-200">
                                                    <tr>
                                                            <th className="px-4 py-1 text-left">Queue Number</th>
                                                            <th className="px-4 py-1 text-left">Department</th>
                                                            <th className="px-4 py-1 text-left">Patient Name</th>
                                                            <th className="px-4 py-1 text-left">Status</th>
        
                                                    </tr>
                                            </thead>
                                            <tbody>
                                                    {queueData && queueData.length > 0 ? (
                                                            queueData.map((queue) => (
                                                                    <tr key={queue.queueNumber} className="hover:bg-gray-100">
                                                                            <td className="px-4 py-2 text-center font-bold">{queue.queueNumber}</td>
                                                                            <td className="px-4 py-2 text-center">{queue.department}</td>
                                                                            <td className="px-4 py-2 text-center">{queue.patientName}</td>
                                                                            <td className="px-4 py-2 text-center ucfirst">
                                                                                {
                                                                                    queue.status === "waiting" ? (
                                                                                        <p className="text-yellow-600 font-bold flex items-center gap-2">
                                                                                            Waiting
                                                                                        </p>
                                                                                    ) : queue.status === "cancelled" ? (
                                                                                        <p className="text-red-600 font-bold flex items-center gap-2">
                                                                                            Cancelled
                                                                                        </p>
                                                                                    ) : queue.status === "completed" ? (
                                                                                        <p className="text-green-600 font-bold flex items-center gap-2">
                                                                                            Finished
                                                                                        </p>
                                                                                    ) : (
                                                                                        <p className="text-gray-600 font-bold flex items-center gap-2">
                                                                                            Ongoing
                                                                                        </p>
                                                                                    )
                                                                                }
                                                                            </td>
                                                                    </tr>
                                                                
                                                            ))
                                                    ) : (
                                                            <tr>
                                                                    <td colSpan="4" className="text-center py-4 text-gray-500">No Data</td>
                                                            </tr>
                                                    )}
                                                    {loading && (
                                                            <tr>
                                                                    <td colSpan="4" className="text-center py-4 text-red-500">Loading...</td>
                                                            </tr>
                                                    )}
                                            </tbody>
                                    </table>
                                </div>
                        </div>

                        <div className="grid grid-cols-3 mt-5 gap-2">
                                <button className="bg-white p-5 rounded-md shadow-md hover:shadow-lg transition text-center hover:cursor-pointer" onClick={handleNextQueue}>
                                        Next
                                </button>
                                <button className="bg-white p-5 rounded-md shadow-md hover:shadow-lg transition text-center hover:cursor-pointer" onClick={() => handleCancelQueue(currentQueue.queueNumber)}>
                                        Cancel
                                </button>
                                <button className="bg-white p-5 rounded-md shadow-md hover:shadow-lg transition text-center hover:cursor-pointer" onClick={() => handleResetQueue()}>
                                        Reset
                                </button>
                        </div>

                        {/* <div className="mt-5 bg-white p-5 rounded-md shadow-md">
                                <h2 className="text-lg font-bold mb-4">Add New Queue</h2>
                                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                        <select className="border p-2 rounded" name="department" id="department" onChange={handleChange} value={formData.department}>
                                                <option value="">Select Department</option>
                                                {departments.map((department) => (
                                                        <option key={department} value={department}>
                                                                {department}
                                                        </option>
                                                ))}
                                        </select>
                                        <input type="text" placeholder="Patient Name" className="border p-2 rounded" name="patientName" id="patientName" onChange={handleChange} value={formData.patientName} required />
                                        <button type="submit" className="bg-blue-600 text-white p-2 rounded" onClick={handleSubmit}>Add Queue</button>
                                </form>
                        </div> */}
                </main>
        </div>
    );
};

export default AdminQueueing;
