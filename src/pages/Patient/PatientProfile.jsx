import React, { useState } from "react";
import Sidebar from "../../components/PatientSidebar";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const PatientProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    contactNumber: "",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [userCode, setUserCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = {
      firstName: "First Name",
      lastName: "Last Name",
      birthDate: "Birth Date",
      gender: "Gender",
      contactNumber: "Contact Number",
      address: "Address",
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !formData[key])
      .map(([, label]) => label);

    if (missingFields.length > 0) {
      toast.error(`Please fill in the following: ${missingFields.join(", ")}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const name = `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim();
      const dob = formData.birthDate;
      const age = new Date().getFullYear() - new Date(dob).getFullYear();
      const contact = formData.contactNumber;
      const address = formData.address;

      const response = await axios.post(
        "/api/patient/create-profile",
        {
          name,
          dob,
          gender: formData.gender,
          age,
          contact,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Patient data submitted successfully! A verification code has been sent to your contact.");
        const code = "123456"; // simulate
        setVerificationCode(code);
        setIsCodeSent(true);

        setSubmittedData(formData);
        setIsEditing(false);
      } else {
        toast.error("Failed to submit profile.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationCodeChange = (e) => {
    setUserCode(e.target.value);
  };

  const verifyCode = () => {
    if (userCode === verificationCode) {
      setIsVerified(true);
      toast.success("Verification successful!");
      setErrorMessage("");
      setIsModalOpen(false);
    } else {
      setErrorMessage("Invalid verification code. Please try again.");
      setIsVerified(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(submittedData);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData(submittedData);
  };

  const handleClearForm = () => {
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      birthDate: "",
      gender: "",
      contactNumber: "",
      address: "",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
          {submittedData && !isEditing ? (
            <>
              <h2 className="text-2xl font-bold mb-6">Submitted Patient Profile</h2>
              <div className="space-y-4">
                <div><strong>First Name:</strong> {submittedData.firstName}</div>
                <div><strong>Middle Name:</strong> {submittedData.middleName}</div>
                <div><strong>Last Name:</strong> {submittedData.lastName}</div>
                <div><strong>Birth Date:</strong> {submittedData.birthDate}</div>
                <div><strong>Gender:</strong> {submittedData.gender}</div>
                <div><strong>Contact Number:</strong> {submittedData.contactNumber}</div>
                <div><strong>Address:</strong> {submittedData.address}</div>
                <div>
                  <strong>Status:</strong>{" "}
                  <span className={`font-bold ${isVerified ? "text-green-600" : "text-red-600"}`}>
                    {isVerified ? "Verified" : "Not Verified"}
                  </span>
                </div>

                {!isVerified && (
                  <div className="mt-4">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-blue-600 text-white px-6 py-2 rounded transition hover:bg-blue-700"
                    >
                      Verify Profile
                    </button>
                  </div>
                )}
                <div className="mt-4">
                  <button
                    onClick={handleEdit}
                    className="bg-yellow-500 text-white px-6 py-2 rounded transition hover:bg-yellow-600"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">Patient Profile Form</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Middle Name</label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Birth Date</label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Number</label>
                    <input
                      type="text"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-blue-600 text-white px-6 py-2 rounded transition ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                    }`}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Modal for Verification Code */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
              <h3 className="text-xl font-bold mb-4">Enter Verification Code</h3>
              <input
                type="text"
                value={userCode}
                onChange={handleVerificationCodeChange}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              />
              {errorMessage && <div className="text-red-600 text-sm mb-4">{errorMessage}</div>}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={verifyCode}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientProfile;