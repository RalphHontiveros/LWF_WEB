import React, { useEffect, useState } from "react";
import Sidebar from "../../components/AdminSidebar";
import { FaEye } from "react-icons/fa";
// Modal Component (Details View)
const Modal = ({ emr, onClose, onEditClick }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-x-hidden px-4 sm:px-6">
     <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-3xl max-h-screen overflow-y-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">EMR Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <p><span className="font-semibold">Name:</span> {emr.name || "N/A"}</p>
        <p><span className="font-semibold">Date of Birth:</span> {emr.dob ? new Date(emr.dob).toLocaleDateString() : "N/A"}</p>
        <p><span className="font-semibold">Age:</span> {emr.age || "N/A"}</p>
        <p><span className="font-semibold">Gender:</span> {emr.gender || "N/A"}</p>
        <p><span className="font-semibold">Blood Type:</span> {emr.bloodType || "N/A"}</p>
        <p><span className="font-semibold">Contact:</span> {emr.contact || "N/A"}</p>
        <p><span className="font-semibold">Email:</span> {emr.email || "N/A"}</p>
        <p><span className="font-semibold">Address:</span> {emr.address || "N/A"}</p>
        <p className="md:col-span-2"><span className="font-semibold">Allergies:</span> {emr.allergies?.join(", ") || "N/A"}</p>
        <p className="md:col-span-2"><span className="font-semibold">Conditions:</span> {emr.conditions?.join(", ") || "N/A"}</p>
      </div>
  
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Medications</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          {emr.medications && emr.medications.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {emr.medications.map((med, index) => (
                <li key={index}>{med.name} - {med.frequency}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">N/A</p>
          )}
        </div>
      </div>
  
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Visit History</h3>
        {emr.visitHistory && emr.visitHistory.length > 0 ? (
          <div className="space-y-4">
            {emr.visitHistory.map((visit, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <p><span className="font-semibold">Date:</span> {new Date(visit.date).toLocaleDateString()}</p>
                <p><span className="font-semibold">Reason:</span> {visit.reason}</p>
                <p><span className="font-semibold">Notes:</span> {visit.notes}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">N/A</p>
        )}
      </div>
  
      <div className="flex justify-end gap-3 mt-8">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
        >
          Close
        </button>
        <button
          onClick={onEditClick}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
        >
          Edit
        </button>
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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow-lg mx-auto max-h-screen overflow-y-auto">
        
        <h2 className="text-2xl font-bold mb-6 text-center">Edit EMR</h2>
        
        <div className="space-y-6">
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Name"
          />
  
          <input
            type="date"
            name="dob"
            value={formData.dob || ""}
            onChange={handleChange}
            className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
  
          <input
            type="number"
            name="age"
            value={formData.age || ""}
            onChange={handleChange}
            className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Age"
          />
  
          <select
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Blood Type"
          />
  
          <input
            type="text"
            name="contact"
            value={formData.contact || ""}
            onChange={handleChange}
            className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contact"
          />
  
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
          />
  
          <textarea
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Address"
          />
  
          <textarea
            name="allergies"
            value={formData.allergies?.join(", ") || ""}
            onChange={(e) => handleChange({ target: { name: "allergies", value: e.target.value.split(",") } })}
            className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Allergies (comma separated)"
          />
  
          <textarea
            name="conditions"
            value={formData.conditions?.join(", ") || ""}
            onChange={(e) => handleChange({ target: { name: "conditions", value: e.target.value.split(",") } })}
            className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Conditions (comma separated)"
          />
  
          <h3 className="font-semibold mt-6 text-lg">Medications:</h3>
          <div className="space-y-4">
            {formData.medications?.map((med, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  name={`medicationName-${index}`}
                  value={med.name || ""}
                  onChange={(e) => {
                    const updatedMedications = [...formData.medications];
                    updatedMedications[index].name = e.target.value;
                    setFormData({ ...formData, medications: updatedMedications });
                  }}
                  className="p-3 border rounded-lg w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="p-3 border rounded-lg w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Frequency"
                />
              </div>
            ))}
            <div className="flex justify-center gap-4 mt-4">
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, medications: [...formData.medications, { name: "", frequency: "" }] });
                }}
                className="p-3 bg-blue-600 text-white rounded-lg w-full sm:w-auto hover:bg-blue-700 transition duration-300"
              >
                Add Medication
              </button>
  
              <button
                type="button"
                onClick={() => {
                  const newMedications = [...formData.medications];
                  newMedications.pop();
                  setFormData({ ...formData, medications: newMedications });
                }}
                className="p-3 bg-red-600 text-white rounded-lg w-full sm:w-auto hover:bg-red-700 transition duration-300"
              >
                Remove Medication
              </button>
            </div>
          </div>
        </div>
  
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
          <button
            onClick={onClose}
            className="p-3 bg-gray-600 text-white rounded-lg w-full sm:w-auto hover:bg-gray-700 transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="p-3 bg-green-600 text-white rounded-lg w-full sm:w-auto hover:bg-green-700 transition duration-300"
          >
            Save
          </button>
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

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
  {loading ? (
    <p className="text-gray-500 italic p-4">Loading EMRs...</p>
  ) : error ? (
    <p className="text-red-500 font-medium p-4">{error}</p>
  ) : emrs.length === 0 ? (
    <p className="text-gray-500 italic p-4">No EMRs found.</p>
  ) : (
    <table className="min-w-full table-auto text-left">
      <thead className="bg-gray-200 text-gray-700">
        <tr>
          <th className="px-6 py-3">Name</th>
          <th className="px-6 py-3">Details</th>
        </tr>
      </thead>
      <tbody>
        {emrs.map((emr) => (
          <tr key={emr._id} className="border-t hover:bg-gray-50">
          <td className="px-6 py-4">{emr.name || <span className="text-gray-400">N/A</span>}</td>
          <td className="px-6 py-4">
          <button
          onClick={() => handleDetailsClick(emr)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 text-sm"
          title="View Details"
        >
          <FaEye />
          Details View
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
