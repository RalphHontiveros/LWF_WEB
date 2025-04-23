import React, { useState } from 'react';
import Sidebar from "../../components/PatientSidebar";
import { useNavigate } from "react-router-dom";

const PatientProfile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    gender: '',
    address: '',
    contactNumber: '',
    email: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [userInputCode, setUserInputCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Whenever formData or verification status changes, save them to localStorage
    localStorage.setItem("formData", JSON.stringify(formData));
    localStorage.setItem("isVerified", JSON.stringify(isVerified));
  }, [formData, isVerified]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Skip verification if already verified
    if (isVerified) {
      setSubmittedData(formData); // If already verified, just save the data and skip verification
      setStep("done");
      setMessage("Profile updated successfully!");
      return;
    }

    // Simulate generating a verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);
    setSubmitted(true);
    localStorage.setItem('verificationEmail', formData.email);
    localStorage.setItem('verificationCode', code);

    setMessage(`A verification code has been sent to ${formData.email}. (code: ${code})`);
    // In real setup, hide the code and send via actual email
  };

  const handleVerify = () => {
    const storedCode = localStorage.getItem('verificationCode');
    const storedEmail = localStorage.getItem('verificationEmail');

    if (userInputCode === storedCode && formData.email === storedEmail) {
      setIsVerified(true);
      setMessage('Email verified successfully!');
      localStorage.removeItem('verificationCode');
      localStorage.removeItem('verificationEmail');
    } else {
      setMessage('Invalid verification code. Try again.');
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {step === "done" ? "✅ Verified" : "📝 Patient Profile Form"}
          </h2>

          {message && (
            <div className="mb-4 text-sm text-blue-600 text-center">{message}</div>
          )}

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg"
                placeholder="Full Name"
                required
              />
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg"
                required
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border px-4 py-2 rounded-lg" placeholder="Address" required />
              <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="w-full border px-4 py-2 rounded-lg" placeholder="Contact Number" required />
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border px-4 py-2 rounded-lg" placeholder="Email" required />

              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Submit & Send Code
              </button>
            </form>
          ) : !isVerified ? (
            <div className="space-y-4">
              <input
                type="text"
                value={userInputCode}
                onChange={(e) => setUserInputCode(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg"
                placeholder="Enter verification code"
              />
              <button
                onClick={handleVerify}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Verify
              </button>
            </div>
          ) : (
            <div className="text-center text-green-600 font-semibold text-lg">
              🎉 Your profile has been successfully submitted and verified!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
