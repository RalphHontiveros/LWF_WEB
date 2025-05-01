import React, { useEffect, useState } from 'react';
import { getCurrentQueueEntry, getQueues } from '../api';

const Queue = () => {
    const [queueData, setQueueData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentQueueEntry, setCurrentQueueEntry] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [queuesRes, currentRes] = await Promise.all([
                    getQueues(),
                    getCurrentQueueEntry()
                ]);
                setQueueData(queuesRes.data.filter(q => q.status === "waiting"));
                setCurrentQueueEntry(currentRes.data);
            } catch (err) {
                console.error("Error loading queue data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        const interval = setInterval(fetchData, 5000); // Refetch every 5 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    const renderStatus = (status) => {
        const statusStyles = {
            waiting: 'text-yellow-600',
            cancelled: 'text-red-600',
            completed: 'text-green-600',
            default: 'text-gray-600'
        };

        const statusText = {
            waiting: 'Waiting',
            cancelled: 'Cancelled',
            completed: 'Finished',
            default: 'Ongoing'
        };

        const colorClass = statusStyles[status] || statusStyles.default;
        const displayText = statusText[status] || statusText.default;

        return <p className={`${colorClass} font-bold flex items-center gap-2`}>{displayText}</p>;
    };

    return (
        <div className="flex h-screen w-full bg-gray-100 p-10">
            <div className="flex justify-center items-start w-full gap-10">
                {/* Current Queue */}
                <div className="w-1/2">
                    <p className="text-sm">Current Serving</p>
                    <p className="text-lg font-bold">Queue Number</p>
                    <div className="border-2 p-3 border-red-600 mt-2 font-bold text-4xl rounded-md">
                        {currentQueueEntry?.queueNumber || "No Queue"}
                    </div>
                </div>

                {/* Waiting Queue Table */}
                <div className="w-1/2 overflow-auto max-h-[70vh]">
                    <table className="table w-full bg-white rounded-md shadow-md">
                        <thead className="bg-gray-200">
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
                                    <td colSpan="4" className="text-center py-4 text-blue-500">Loading...</td>
                                </tr>
                            ) : queueData.length > 0 ? (
                                queueData.map(queue => (
                                    <tr key={queue._id || queue.queueNumber} className="hover:bg-gray-100">
                                        <td className="px-4 py-2 text-center font-bold">{queue.queueNumber}</td>
                                        <td className="px-4 py-2 text-center">{queue.department}</td>
                                        <td className="px-4 py-2 text-center">{queue.patientName}</td>
                                        <td className="px-4 py-2 text-center">{renderStatus(queue.status)}</td>
                                        <td className="px-4 py-2 text-center">{new Date(queue.date).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-gray-500">No Data</td>
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
