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
  const [submittedData, setSubmittedData] = useState(null);
  const [isVerified, setIsVerified] = useState(null); // null = unknown, true/false = status

  // For verification code flow
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Fetch profile and verification status on mount
  useEffect(() => {
    const fetchProfileAndStatus = async () => {
      try {
        const profileRes = await fetch("/api/patient/my-profile", {
          method: "GET",
          credentials: "include",
        });

        if (profileRes.ok) {
          const data = await profileRes.json();
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

            // Fetch verification status
            if (data.profile._id) {
              const statusRes = await fetch(
                `/api/patient/verification-status/${data.profile._id}`,
                {
                  method: "GET",
                  credentials: "include",
                }
              );
              if (statusRes.ok) {
                const statusData = await statusRes.json();
                setIsVerified(statusData.isVerified);
              } else {
                setIsVerified(false);
              }
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfileAndStatus();
  }, []);

  // Handle input changes as before
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form validation and submit handlers remain unchanged
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
            : "Profile created successfully!"
        );
        setSubmittedData(formData);
        setIsEditing(false);
        // After update, re-fetch verification status if you want:
        // Or keep existing status if it doesn't change
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

  // --- Verification handlers ---

  // Send verification code button handler
  const handleSendVerificationCode = async () => {
    try {
      const res = await fetch("/api/auth/send-verification-code", {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Verification code sent to your email!");
        setVerificationSent(true);
      } else {
        toast.error(data.message || "Failed to send verification code.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error sending verification code.");
    }
  };

  // Verify code submit handler
  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      toast.error("Please enter the verification code.");
      return;
    }
    setVerifying(true);

    try {
      const res = await fetch("/api/auth/verify-verification-code", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          providedCode: verificationCode,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Your account has been verified!");
        setIsVerified(true);
        setVerificationSent(false);
        setVerificationCode("");
      } else {
        toast.error(data.message || "Verification failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Verification error.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 pt-20 sm:pt-24 bg-gray-100">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">

          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-xl font-bold mb-4 text-center">Enter Verification Code</h3>
                <input
                  type="text"
                  value={userCode}
                  onChange={handleVerificationCodeChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Code"
                />
                {errorMessage && <p className="text-red-500 mb-2 text-center">{errorMessage}</p>}
                <div className="flex justify-between">
                  <button
                    onClick={verifyCode}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

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

                {/* Verification Status */}
                {isVerified === false && (
                  <div className="mt-4 p-4 border border-red-400 bg-red-100 rounded">
                    <p className="text-red-700 mb-2">
                      Your account is not yet verified.
                    </p>
                    {!verificationSent ? (
                      <button
                        onClick={handleSendVerificationCode}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Verify Account
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <p>Please enter the verification code sent to your email:</p>
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs"
                          maxLength={6}
                          placeholder="Enter code"
                        />
                        <button
                          onClick={handleVerifyCode}
                          disabled={verifying}
                          className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${
                            verifying ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {verifying ? "Verifying..." : "Submit Code"}
                        </button>
                      </div>
                    )}
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
                    <label className="block text-sm font-medium mb-1">Birth Date</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Number</label>
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className={`bg-blue-600 text-white px-6 py-2 rounded-lg transition transform ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </>
          )}

        </div>
      </main>
    </div>
  );
};

export default PatientProfile;