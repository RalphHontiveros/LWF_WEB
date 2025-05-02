import React, { useEffect, useState, useRef } from "react";
import { getCurrentQueueEntry, getQueues } from "../api";
import { FaBell, FaUser, FaTimes, FaCheckCircle } from "react-icons/fa";

const Queue = () => {
    const [queueData, setQueueData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentQueueEntry, setCurrentQueueEntry] = useState(null);
    const prevQueueNumberRef = useRef(null);
    const dingSound = useRef(new Audio("/ding.mp3"));  // Corrected path

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [queuesRes, currentRes] = await Promise.all([
                    getQueues(),
                    getCurrentQueueEntry()
                ]);

                const newQueue = currentRes.data;
                const newQueueNumber = newQueue?.queueNumber;
                const prevQueueNumber = prevQueueNumberRef.current;

                // Check for change in queue number
                if (newQueueNumber && newQueueNumber !== prevQueueNumber) {
                    prevQueueNumberRef.current = newQueueNumber;
                    dingSound.current.play().then(() => {
                        speakAnnouncement(newQueueNumber, newQueue?.department);
                    });
                }

                setQueueData(queuesRes.data.filter(q => q.status === "waiting"));
                setCurrentQueueEntry(newQueue);
            } catch (err) {
                console.error("Error loading queue data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const speakAnnouncement = (queueNumber, department) => {
        const msg = `Now serving, queue number ${queueNumber}. Please proceed to the ${department || 'counter'}.`;
        const utterance = new SpeechSynthesisUtterance(msg);
        utterance.lang = "en-US";
        window.speechSynthesis.speak(utterance);
    };

    const renderStatus = (status) => {
        const statusIcons = {
            waiting: <FaUser />,
            cancelled: <FaTimes />,
            completed: <FaCheckCircle />,
            default: <FaBell />
        };

        const statusText = {
            waiting: "Waiting",
            cancelled: "Cancelled",
            completed: "Finished",
            default: "Ongoing"
        };

        const icon = statusIcons[status] || statusIcons.default;
        const displayText = statusText[status] || statusText.default;

        return (
            <p className="flex items-center gap-2">
                {icon}
                <span className="font-bold">{displayText}</span>
            </p>
        );
    };

    return (
        <div className="flex h-screen w-full bg-[#e6f7f1] p-5 sm:p-10">
            <div className="flex flex-col sm:flex-row justify-center items-start w-full gap-5 sm:gap-10">
                {/* Current Queue */}
                <div className="w-full sm:w-1/2">
                    <p className="text-sm">Current Serving</p>
                    <p className="text-lg font-bold">Queue Number</p>
                    <div className="border-2 p-3 border-blue-600 mt-2 font-bold text-4xl rounded-md text-center">
                        {currentQueueEntry?.queueNumber || "No Queue"}
                    </div>
                </div>

                {/* Waiting Queue Table */}
                <div className="w-full sm:w-1/2 overflow-auto max-h-[70vh] sm:max-h-[80vh]">
                    <table className="table w-full bg-white rounded-md shadow-md">
                        <thead className="bg-blue-200">
                            <tr>
                                <th className="px-4 py-2 text-left">Queue Number</th>
                                <th className="px-4 py-2 text-left">Department</th>
                                <th className="px-4 py-2 text-left">Patient Name</th>
                                <th className="px-4 py-2 text-left">Status</th>
                                <th className="px-4 py-2 text-left">Date & Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-blue-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : queueData.length > 0 ? (
                                queueData.map(queue => (
                                    <tr key={queue._id || queue.queueNumber} className="hover:bg-gray-100">
                                        <td className="px-4 py-2 text-center font-bold">{queue.queueNumber}</td>
                                        <td className="px-4 py-2 text-center">{queue.department}</td>
                                        <td className="px-4 py-2 text-center">{queue.patientName}</td>
                                        <td className="px-4 py-2 text-center">{renderStatus(queue.status)}</td>
                                        <td className="px-4 py-2 text-center">
                                            {new Date(queue.date).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-gray-500">
                                        No Data
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Queue;
