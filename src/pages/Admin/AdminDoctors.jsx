import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { FaUserMd } from "react-icons/fa";

const AdminDoctors = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [editData, setEditData] = useState({ fullName: "", specialization: "", phone: "" });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/patient/all-doctors");
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleEditClick = (doctor) => {
    setSelectedDoctor(doctor);
    setEditData({
      fullName: doctor.fullName || "",
      specialization: doctor.specialization || "",
      phone: doctor.phone || ""
    });
  };

  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/doctor/profile/${selectedDoctor.doctor._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${yourToken}` // Uncomment if token is needed
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        await fetchDoctors();
        setSelectedDoctor(null); // Close modal
      } else {
        const err = await response.json();
        alert(err.message || "Update failed.");
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className={`flex-1 p-8 transition-all duration-300`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaUserMd className="text-blue-600" /> Doctor's List
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {doctors.map((doc) => (
            <div key={doc._id} className="bg-white p-5 rounded-md shadow-md hover:shadow-lg transition">
              <h2 className="text-lg font-bold text-blue-700">{doc.fullName}</h2>
              <p className="text-gray-600"><span className="font-semibold">Specialization:</span> {doc.specialization}</p>
              <p className="text-gray-600"><span className="font-semibold">Email:</span> {doc.doctor?.email}</p>
              <p className="text-gray-600"><span className="font-semibold">Contact:</span> {doc.phone || "N/A"}</p>
              <button
                onClick={() => handleEditClick(doc)}
                className="mt-3 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
              >
                Edit
              </button>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedDoctor && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Edit Doctor Profile</h2>
              <label className="block mb-2">
                <span className="text-gray-700 font-medium">Full Name</span>
                <input
                  type="text"
                  name="fullName"
                  value={editData.fullName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                />
              </label>
              <label className="block mb-2">
                <span className="text-gray-700 font-medium">Specialization</span>
                <input
                  type="text"
                  name="specialization"
                  value={editData.specialization}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700 font-medium">Contact</span>
                <input
                  type="text"
                  name="phone"
                  value={editData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                />
              </label>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDoctors;
