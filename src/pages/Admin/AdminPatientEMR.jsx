import React, { useEffect, useState } from "react";
import Sidebar from "../../components/AdminSidebar";

// Modal Component (Details View)
const Modal = ({ emr, onClose, onEditClick }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-2xl font-bold mb-4">EMR Details</h2>
        <div className="space-y-4">
          <p><strong>Name:</strong> {emr.name || "N/A"}</p>
          <p><strong>Date of Birth:</strong> {emr.dob ? new Date(emr.dob).toLocaleDateString() : "N/A"}</p>
          <p><strong>Age:</strong> {emr.age || "N/A"}</p>
          <p><strong>Gender:</strong> {emr.gender || "N/A"}</p>
          <p><strong>Blood Type:</strong> {emr.bloodType || "N/A"}</p>
          <p><strong>Contact:</strong> {emr.contact || "N/A"}</p>
          <p><strong>Email:</strong> {emr.email || "N/A"}</p>
          <p><strong>Address:</strong> {emr.address || "N/A"}</p>
          <p><strong>Allergies:</strong> {emr.allergies?.join(", ") || "N/A"}</p>
          <p><strong>Conditions:</strong> {emr.conditions?.join(", ") || "N/A"}</p>

          <h3 className="mt-4 font-semibold">Medications:</h3>
          <ul>
            {emr.medications && emr.medications.length > 0 ? (
              emr.medications.map((med, index) => (
                <li key={index}>{med.name} - {med.frequency}</li>
              ))
            ) : (
              <p>N/A</p>
            )}
          </ul>

          <h3 className="mt-4 font-semibold">Visit History:</h3>
          {emr.visitHistory && emr.visitHistory.length > 0 ? (
            emr.visitHistory.map((visit, index) => (
              <div key={index} className="mt-2">
                <p><strong>Date:</strong> {new Date(visit.date).toLocaleDateString()}</p>
                <p><strong>Reason:</strong> {visit.reason}</p>
                <p><strong>Notes:</strong> {visit.notes}</p>
              </div>
            ))
          ) : (
            <p>N/A</p>
          )}
        </div>
        <div className="flex justify-between mt-4">
          <button onClick={onClose} className="p-2 bg-red-500 text-white rounded-lg">Close</button>
          <button onClick={onEditClick} className="p-2 bg-blue-500 text-white rounded-lg">Edit</button>
        </div>
      </div>
    </div>
  );
};

// Modal Component (Edit View)
const EditModal = ({ emr, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...emr });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-2xl font-bold mb-4">Edit EMR</h2>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            className="p-2 w-full border"
            placeholder="Name"
          />
          <input
            type="date"
            name="dob"
            value={formData.dob || ""}
            onChange={handleChange}
            className="p-2 w-full border"
          />
          <input
            type="number"
            name="age"
            value={formData.age || ""}
            onChange={handleChange}
            className="p-2 w-full border"
            placeholder="Age"
          />
          <select
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            className="p-2 w-full border"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            name="bloodType"
            value={formData.bloodType || ""}
            onChange={handleChange}
            className="p-2 w-full border"
            placeholder="Blood Type"
          />
          <input
            type="text"
            name="contact"
            value={formData.contact || ""}
            onChange={handleChange}
            className="p-2 w-full border"
            placeholder="Contact"
          />
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="p-2 w-full border"
            placeholder="Email"
          />
          <textarea
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            className="p-2 w-full border"
            placeholder="Address"
          />
          <textarea
            name="allergies"
            value={formData.allergies?.join(", ") || ""}
            onChange={(e) => handleChange({
              target: { name: "allergies", value: e.target.value.split(",") },
            })}
            className="p-2 w-full border"
            placeholder="Allergies (comma separated)"
          />
          <textarea
            name="conditions"
            value={formData.conditions?.join(", ") || ""}
            onChange={(e) => handleChange({
              target: { name: "conditions", value: e.target.value.split(",") },
            })}
            className="p-2 w-full border"
            placeholder="Conditions (comma separated)"
          />
          <h3 className="font-semibold mt-4">Medications:</h3>
          <div>
            {formData.medications?.map((med, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  name={`medicationName-${index}`}
                  value={med.name || ""}
                  onChange={(e) => {
                    const updatedMedications = [...formData.medications];
                    updatedMedications[index].name = e.target.value;
                    setFormData({ ...formData, medications: updatedMedications });
                  }}
                  className="p-2 w-1/2 border"
                  placeholder="Medication Name"
                />
                <input
                  type="text"
                  name={`medicationFrequency-${index}`}
                  value={med.frequency || ""}
                  onChange={(e) => {
                    const updatedMedications = [...formData.medications];
                    updatedMedications[index].frequency = e.target.value;
                    setFormData({ ...formData, medications: updatedMedications });
                  }}
                  className="p-2 w-1/2 border"
                  placeholder="Frequency"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  medications: [...formData.medications, { name: "", frequency: "" }],
                });
              }}
              className="mt-2 p-2 bg-blue-500 text-white rounded-lg"
            >
              Add Medication
            </button>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <button onClick={onClose} className="p-2 bg-red-500 text-white rounded-lg">Cancel</button>
          <button onClick={handleSave} className="p-2 bg-green-500 text-white rounded-lg">Save</button>
        </div>
      </div>
    </div>
  );
};


const AdminPatientEMR = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [emrs, setEmrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmr, setSelectedEmr] = useState(null); // Selected EMR for modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Edit modal state

  useEffect(() => {
    const fetchEMRs = async () => {
      try {
        const response = await fetch("/api/emr/get-all", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setEmrs(data.emrs);
        } else {
          setError(data.message || "Error fetching EMRs");
        }
      } catch (error) {
        setError("Error fetching EMRs: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEMRs();
  }, []);

  const handleDetailsClick = (emr) => {
    setSelectedEmr(emr);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmr(null);
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
    setIsModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveEdit = async (updatedEmr) => {
    try {
      const response = await fetch(`/api/emr/${selectedEmr.userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEmr),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update the EMRs list with the updated EMR
        setEmrs((prevEmrs) =>
          prevEmrs.map((emr) =>
            emr.userId === updatedEmr.userId ? updatedEmr : emr
          )
        );
        setIsEditModalOpen(false);
      } else {
        setError(data.message || "Failed to update EMR");
      }
    } catch (error) {
      setError("Error updating EMR: " + error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className="flex-1 p-8 transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Patient EMRs</h1>
        </div>

        <div className="bg-white rounded-md shadow p-4 overflow-auto">
          {loading ? (
            <p className="text-gray-600">Loading EMRs...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : emrs.length === 0 ? (
            <p className="text-gray-600">No EMRs found.</p>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">Details</th> {/* Removed Edit Column */}
                </tr>
              </thead>
              <tbody>
                {emrs.map((emr) => (
                  <tr key={emr._id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{emr.name || "N/A"}</td>
                    <td className="p-2">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => handleDetailsClick(emr)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Modal for Details */}
      {isModalOpen && <Modal emr={selectedEmr} onClose={handleCloseModal} onEditClick={handleEditClick} />}
      {/* Modal for Editing */}
      {isEditModalOpen && (
        <EditModal emr={selectedEmr} onClose={handleCloseEditModal} onSave={handleSaveEdit} />
      )}
    </div>
  );
};

export default AdminPatientEMR;
