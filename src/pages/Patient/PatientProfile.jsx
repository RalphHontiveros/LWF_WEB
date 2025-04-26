import React, { useState, useEffect } from "react";
import Sidebar from "../../components/PatientSidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PatientProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    contact: "",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [userCode, setUserCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/patient/my-profile", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setFormData({
              name: data.profile.name || "",
              dob: data.profile.dob ? data.profile.dob.slice(0, 10) : "",
              gender: data.profile.gender || "",
              contact: data.profile.contact || "",
              address: data.profile.address || "",
            });
            setSubmittedData({
              name: data.profile.name || "",
              dob: data.profile.dob ? data.profile.dob.slice(0, 10) : "",
              gender: data.profile.gender || "",
              contact: data.profile.contact || "",
              address: data.profile.address || "",
            });
            setIsVerified(data.profile.isVerified || false);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = {
      name: "Name",
      dob: "Birth Date",
      gender: "Gender",
      contact: "Contact Number",
      address: "Address",
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !formData[key])
      .map(([, label]) => label);

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(", ")}`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        dob: formData.dob,
        gender: formData.gender,
        age: new Date().getFullYear() - new Date(formData.dob).getFullYear(),
        contact: formData.contact,
        address: formData.address,
      };

      const endpoint = submittedData
        ? "/api/patient/update-profile"
        : "/api/patient/create-profile";
      const method = submittedData ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(
          submittedData
            ? "Profile updated successfully!"
            : "Profile created! Verification code sent."
        );
        if (!submittedData) {
          // simulate code only on creation (or you could remove this line if backend sends real code)
          setVerificationCode("123456"); 
          setIsCodeSent(true);
          setIsModalOpen(true);
        }
        setSubmittedData(formData);
        setIsEditing(false);
      } else {
        toast.error(data.message || "Failed to submit profile.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData(submittedData);
  };

  const handleSendVerificationCode = async () => {
    try {
      const res = await fetch("/api/auth/send-verification-code", {
        method: "PATCH",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Verification code sent successfully!");
        setIsCodeSent(true);
        setIsModalOpen(true);
      } else {
        toast.error(data.message || "Failed to send verification code.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  // Added missing input handler here
  const handleVerificationCodeChange = (e) => {
    setUserCode(e.target.value);
  };

  const verifyCode = async () => {
    try {
      const res = await fetch("/api/auth/verify-verification-code", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ code: userCode }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsVerified(true);
        toast.success("Verification successful!");
        setIsModalOpen(false);
        setErrorMessage("");
      } else {
        setIsVerified(false);
        setErrorMessage(
          data.message || "Invalid verification code. Try again."
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong during verification.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
          {submittedData && !isEditing ? (
            <>
              <h2 className="text-2xl font-bold mb-6">Patient Profile</h2>
              <div className="space-y-4">
                <div>
                  <strong>Name:</strong> {submittedData.name}
                </div>
                <div>
                  <strong>Birth Date:</strong> {submittedData.dob}
                </div>
                <div>
                  <strong>Gender:</strong> {submittedData.gender}
                </div>
                <div>
                  <strong>Contact Number:</strong> {submittedData.contact}
                </div>
                <div>
                  <strong>Address:</strong> {submittedData.address}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-bold ${
                      isVerified ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isVerified ? "Verified" : "Not Verified"}
                  </span>
                </div>
                {!isVerified && (
                  <div className="mt-4">
                    <button
                      onClick={handleSendVerificationCode}
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                      Verify Profile
                    </button>
                  </div>
                )}
                <div className="mt-4">
                  <button
                    onClick={handleEdit}
                    className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
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
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Birth Date
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Gender
                    </label>
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
                    <label className="block text-sm font-medium mb-1">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                </div>

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

                <div className="flex justify-end gap-4">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-blue-600 text-white px-6 py-2 rounded transition ${
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

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
              {errorMessage && (
                <div className="text-red-600 text-sm mb-4">{errorMessage}</div>
              )}
              <div className="flex justify-end gap-4">
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
