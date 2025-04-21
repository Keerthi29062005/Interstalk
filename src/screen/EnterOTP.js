import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/EnterOTP.css";

export default function EnterOTP() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [otpInput, setOtpInput] = useState(""); // OTP input field
  const [otpError, setOtpError] = useState(""); // For handling OTP validation error
  const email = localStorage.getItem("email");
  const navigate = useNavigate();
  // Handle input change
  const handleChange = (e, index) => {
    const value = e.target.value;

    // Allow only single alphanumeric characters
    if (value.length <= 1 && /^[a-zA-Z0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value; 
      setOtp(newOtp);

      // Move focus to the next input if the current one is valid
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  // Handle key press for backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      // Move focus to the previous input
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Join the OTP array into a string
    const otpInput = otp.join("");

    try {
      const response = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otpInput: otpInput,
          email: email
        }),
      });

      const json = await response.json();

      if (json.success) {
        alert("OTP verified successfully!");
        // Optionally, redirect user to another page
        navigate("/ResetPassword");
      } else {
        setOtpError(json.message); // Show the error message if OTP is incorrect
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError("An error occurred while verifying OTP.");
    }
  };

  return (
    <div className="enterotp">
      <i
        className="fas fa-shield"
        style={{
          color: "rgb(49, 187, 218)",
          fontSize: "4vw",
        }}
      ></i>
      <h1 className="loginheading">Email Verification</h1>
      <p style={{ color: "white" }}>We have sent a code to your email</p>
      <form onSubmit={handleSubmit}>
        <div className="otpinput">
          {otp.map((value, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              value={value}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength={1}
              autoComplete="new-password"
              autoFocus={index === 0} // Focus the first input initially
            />
          ))}
        </div>
        {otpError && <p style={{ color: "red" }}>The OTP you entered is incorrect. Please check your email and try again.</p>} {/* Error message for OTP */}
        <button type="submit" className="otpsubmitbtn">
          Validate Code
        </button>
      </form>
    </div>
  );
}
