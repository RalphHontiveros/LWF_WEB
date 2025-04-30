import React, { useEffect, useState } from "react";
import Sidebar from "../../components/AdminSidebar";

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
        window.location.reload(); // or re-fetch patient list instead
      } else {
        alert("Failed to update profile: " + data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main className="flex-1 p-8 transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
        </div>

        <div className="bg-white rounded-md shadow p-4">
          {patients.length === 0 ? (
            <p className="text-gray-600">No patients found.</p>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">DOB</th>
                  <th className="p-2">Gender</th>
                  <th className="p-2">Age</th>
                  <th className="p-2">Contact</th>
                  <th className="p-2">Address</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient._id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{patient.name}</td>
                    <td className="p-2">
                      {new Date(patient.dob).toLocaleDateString()}
                    </td>
                    <td className="p-2 capitalize">{patient.gender}</td>
                    <td className="p-2">{patient.age}</td>
                    <td className="p-2">{patient.contact}</td>
                    <td className="p-2">{patient.address}</td>
                    <td className="p-2">{patient.user?.email}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleEditClick(patient)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
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
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Edit Patient Profile</h2>
              <div className="space-y-2">
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
