import React, { useState, useEffect } from "react";

const Convo = ({ setUserRollNumbers }) => {
  const [users, setUsers] = useState([]); // To store all users data
  const [error, setError] = useState(""); // To track error message

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/checkuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({  }), // You can keep this or remove it if you want to fetch all users
      });

      const json = await response.json();

      if (json.success) {
        setUsers(json.users); // Store all users' data if successful
        // Pass users' names to the parent component
        setUserRollNumbers(json.users); 
      } else {
        setError(json.message); // Display error message if no users are found
      }
    } catch (error) {
      setError("Login failed. Try with correct credentials...");
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch all users when the component mounts
  }, []);

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h3>Communities</h3>
        </div>
      )}
    </div>
  );
};


export default Convo;
