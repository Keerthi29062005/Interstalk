import React, { useEffect, useState } from 'react';
import Navbaruser from '../components/Navbaruser';
import Footer from '../components/Footer';
import '../css/userpage.css';
import { useParams } from 'react-router-dom';

export default function UserPage() {
  const { id } = useParams(); // Extract the dynamic id from the route
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user-specific data based on id
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/${id}`); // Make the API request
        const json = await response.json();
        console.log(json); // Log the response to check its structure
        if (json.success) {
          setUserData(json); // Store the user data in state
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [id]); // Dependency on id, will re-run when id changes

  return (
    <div className='user_container'>
      <div className='user_navbar'>
        <Navbaruser />
      </div>
      <div className='user_content'>
        <h1>Welcome, User {id}!</h1>
        {userData ? (
          <div>
            <p>Email: {userData.Email}</p>
            <p>Roll Number: {userData.Roll_no}</p>
            {/* Display other user data as needed */}
          </div>
        ) : (
          <p>Loading user data...</p> // Display a loading message while waiting for data
        )}
      </div>
      <div className='user_footer'>
        <Footer />
      </div>
    </div>
  );
}
