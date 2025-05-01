import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateQueue = () => {
    const departments = [
        'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology', 
        'Hematology', 'Infectious Diseases', 'Nephrology', 'Neurology', 
        'Oncology', 'Ophthalmology', 'Orthopedics', 'Pediatrics', 
        'Psychiatry', 'Pulmonology', 'Rheumatology', 'Urology'
    ];
    const [formData, setFormData] = useState({
        department: '',
        patientName: ''
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/queue/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to create queue entry');
            }

            const data = await response.json();
            console.log(data.queueEntry.queueNumber);
            alert(`Queue Number: ${data.queueEntry.queueNumber} for ${data.queueEntry.patientName}`);
            navigate('/queue'); // Redirect to the queue page after successful creation

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex h-screen w-full bg-gray-100 p-10">
            <div className="flex justify-center items-start w-full gap-10">
                {/* Current Queue */}
                <div className="w-full">
                <div className="mt-5 bg-white p-5 rounded-md shadow-md">
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
                        </div>
                </div>

            </div>
        </div>
    );
};

export default CreateQueue;
