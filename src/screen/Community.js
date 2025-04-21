import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Community() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Fetching data from:', `http://localhost:5000/api/${id}/community`);
        const response = await fetch(`http://localhost:5000/api/${id}/community`);
        const json = await response.json();
        if (json.success) {
          setUserData(json.group_members); // Update to store group members directly
          console.log(json.group_members);
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  return (
    <div>
      <h1>Community</h1>
      <h2>Bye</h2>
      {isLoading ? (
        <p>Loading user data...</p> // Display a loading message while waiting for data
      ) : userData ? (
        <div>
          <h2>Welcome {id}</h2>
          <h3>Group Members:</h3>
          <ul>
            {userData.map((member, index) => (
              <li key={index}>
                <p>Roll Number: {member.Roll_no}</p>
                <p>Sports: {member.Sports}</p>
                <p>Binge Watch: {member.Binge_watch}</p>
                <p>Group Assigned: {member.group_assigned}</p>
                <p>Technology: {member.Technology}</p>
                <p>Music: {member.Music}</p>
                <p>Movies: {member.Movies}</p>
                <hr />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No user data found</p>
      )}
    </div>
  );
}
