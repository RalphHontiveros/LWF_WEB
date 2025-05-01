import React, { useEffect, useState } from "react";
import Sidebar from "../../components/AdminSidebar";
import { FaEdit } from "react-icons/fa";

const AdminPatients = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [patients, setPatients] = useState([]);
  const [editingPatient, setEditingPatient] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    age: "",
    contact: "",
    address: "",
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("/api/patient/all-profiles", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setPatients(data.profiles);
        } else {
          console.error("Error fetching patients:", data.message);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  const handleEditClick = (patient) => {
    setEditingPatient(patient);
    setEditFormData({
      name: patient.name || "",
      dob: patient.dob ? patient.dob.slice(0, 10) : "",
      gender: patient.gender || "",
      age: patient.age || "",
      contact: patient.contact || "",
      address: patient.address || "",
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch("/api/patient/admin-update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: editingPatient.user._id, ...editFormData }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Profile updated successfully");
        setEditingPatient(null);
        window.location.reload(); // or re-fetch patient list
      } else {
        alert("Failed to update profile: " + data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className="flex-1 p-4 sm:p-6 md:p-8 transition-all duration-300 overflow-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Patients</h1>
        </div>

        <div className="w-full overflow-x-auto shadow-md rounded-lg p-2 sm:p-4 bg-white">
          {patients.length === 0 ? (
            <p className="text-gray-500 italic">No patients found.</p>
          ) : (
            <table className="min-w-full text-left text-sm table-auto">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">DOB</th>
                  <th className="px-4 py-3">Gender</th>
                  <th className="px-4 py-3">Age</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black">
                {patients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-t border-black">{patient.name}</td>
                    <td className="px-4 py-3 border-t border-black">
                      {new Date(patient.dob).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 border-t border-black capitalize">{patient.gender}</td>
                    <td className="px-4 py-3 border-t border-black">{patient.age}</td>
                    <td className="px-4 py-3 border-t border-black">{patient.contact}</td>
                    <td className="px-4 py-3 border-t border-black break-words max-w-xs">{patient.address}</td>
                    <td className="px-4 py-3 border-t border-black break-words max-w-xs">{patient.user?.email}</td>
                    <td className="px-4 py-3 border-t border-black">
                      <button
                        onClick={() => handleEditClick(patient)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit Patient"
                      >
                        <FaEdit className="text-xl" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Edit Profile Modal */}
        {editingPatient && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white p-4 sm:p-6 rounded shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Edit Patient Profile</h2>
              <div className="space-y-3">
                <input
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                  placeholder="Name"
                />
                <input
                  type="date"
                  name="dob"
                  value={editFormData.dob}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  name="gender"
                  value={editFormData.gender}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                  placeholder="Gender"
                />
                <input
                  type="number"
                  name="age"
                  value={editFormData.age}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                  placeholder="Age"
                />
                <input
                  name="contact"
                  value={editFormData.contact}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                  placeholder="Contact"
                />
                <input
                  name="address"
                  value={editFormData.address}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                  placeholder="Address"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setEditingPatient(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
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

export default AdminPatients;
