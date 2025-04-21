import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "../css/login.css";

export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ rno: "", email: "", password: "" });
  const [emailForOTP, setEmailForOTP] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/loginuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Roll_no: credentials.rno,
          Email: credentials.email,
          Password: credentials.password,
        }),
      });

      const json = await response.json();
      console.log(json);

      if (json.success) {
        // Assuming the API sends user data as 'name' and 'rollNo'
const Roll_no=json.Roll_no;
const Name=json.Name;
const id=json.id;
console.log(id);
        // Save name and roll number in localStorage or use navigate to pass them
        localStorage.setItem('userName', Name);
        localStorage.setItem('userRollNo', Roll_no);
        localStorage.setItem('userid', id);
        // Redirect to Chats page and pass the name and roll number
        navigate("/chat", {
          state: { Name, Roll_no,id }
        });

      } else {
        alert("Login failed: " + json.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Try with correct credentials...");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleForgotPassword = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: credentials.email }), // Use credentials.email here
      });

      const json = await response.json();

      if (response.ok) {
        localStorage.setItem('email', credentials.email); // Use credentials.email instead of email
        alert("OTP sent successfully to your email.");
        setOtpSent(true);
        navigate("/EnterOTP");
      } else {
        alert(json.message || "Failed to send OTP"); // Handle error messages better
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };
  return (
    <div className="entire_signup">
      <div className='signup_navbar'>
        <Navbar />
      </div>
      <div className="signup_container">
      <div className="login">
        <form className="form" onSubmit={handleLogin}>
        <h1 className="loginheading">LOGIN</h1>
        <input
                type="text"
                id="rno"
                name="rno"
                placeholder="Roll Number"
                className="rno"
                value={credentials.rno}
                onChange={handleInputChange}
              />
              <input
                type="text"
                id="uname"
                name="email"
                placeholder="Email"
                className="email"
                value={credentials.email}
                onChange={handleInputChange}
              />
              <input
                type="password"
                id="pwd"
                name="password"
                placeholder="Password"
                className="pwd"
                value={credentials.password}
                onChange={handleInputChange}
              />
          <button type="submit" className="loginbtn">Login</button>
        </form>
        <p className="forgot-password" onClick={handleForgotPassword}>Forgot Password?</p>
      </div>
      <div className='signup_img_container'>
            <img
              src="https://static.vecteezy.com/system/resources/previews/035/974/483/non_2x/ai-generated-multi-ethnic-diverse-group-of-people-free-photo.jpg"
              alt="..."
              className='signup_image'
            />
          </div>
        </div>
      <div>
        <Footer />
      </div>
    </div>
  )
}
