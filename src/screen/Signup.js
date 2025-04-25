import React, { useState } from 'react';
import '../css/signup.css';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Signup() {
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState({uname:'', rno: '', email: '', password: '' });
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const validateRollNumber = (value) => {
    const pattern = /^2[1-4][A-Z]{2}[BM]0[ABCF][0-9]{2}$/;
    return pattern.test(value) ? '' : 'Invalid Roll Number format. Example: 22EEB0B25';
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'rno') {
      const formattedValue = value.toUpperCase();
      setCredentials({ ...credentials, rno: formattedValue });
      const validationError = validateRollNumber(formattedValue);
      setError(validationError);
    } else {
      setCredentials({ ...credentials, [name]: value });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (error) {
      alert('Please fix the errors before submitting.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/createuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Name:credentials.uname,
          Roll_no: credentials.rno,
          Email: credentials.email,
          Password: credentials.password,
        }),
      });

      const json = await response.json();
      console.log(json);

      if (response.ok && json.success) {
        setSuccess(true);
        localStorage.setItem("rollNo", credentials.rno);
        navigate('/interests');
      } else {
        alert('Signup failed: ' + (json.message || 'Unknown error occurred.'));
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again later.');
    }
  };

  return (
    <>
      <div className='entire_signup'>
        <div className='signup_navbar'>
          <Navbar />
        </div>
        <div className='signup_container'>
          <div className='login'>
            <form className="form" onSubmit={handleSignup}>
              <h1 className="loginheading">SIGN UP</h1>
              <input
                type="text"
                id="uname"
                name="uname"
                placeholder="Your Name"
                className="uname"
                value={credentials.uname}
                onChange={handleInputChange}
              />
              <input
                type="text"
                id="rno"
                name="rno"
                placeholder="Roll Number"
                className="rno"
                value={credentials.rno}
                onChange={handleInputChange}
              />
              {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
              <input
                type="text"
                id="email"
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
              <button type="submit" className="loginbtn" disabled={!!error}>
                Sign up
              </button>
            </form>
            <div>
              <p style={{ color: 'white', marginBottom: '50px', marginLeft: '40px', padding: '20px' }}>
                ALREADY HAVE AN ACCOUNT?{' '}
                <Link
                  to="/Login"
                  style={{
                    color: 'rgb(15, 134, 238)',
                  }}
                >
                  Login here
                </Link>
              </p>
            </div>
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
    </>
  );
}
