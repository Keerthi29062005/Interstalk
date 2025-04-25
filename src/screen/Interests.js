import React, { useState } from 'react';
import { Dropdown, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Interests.css';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

// Map each interest to a numeric group code:
const GROUP_CODES = {
  Sports: { Cricket: 0, Football: 1, Kabaddi: 2 },
  Movies: { Hollywood: 10, Bollywood: 11, Tollywood: 12 },
  Music: { Rock: 20, Classical: 21, Melody: 22 },
  Technology: { 'AI & ML': 30, Robotics: 31, Coding: 32 },
  Binge_watch: { 'Popular Series': 40, Anime: 41, 'Netflix Originals': 42 },
};

export default function InterestsForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Initialize state to match schema
  const [selectedInterests, setSelectedInterests] = useState({
    Roll_no: id,
    Sports: '',
    Movies: '',
    Music: '',
    Technology: '',
    Binge_watch: '',
    group_assigned: 0,
  });

  // When selecting an interest, also assign its numeric code
  const handleSelect = (categoryKey, value) => {
    const code = GROUP_CODES[categoryKey][value];
    setSelectedInterests(prev => ({
      ...prev,
      [categoryKey]: value,
      group_assigned: code,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // <-- Important to prevent full page reload
  
    const rollNo = localStorage.getItem("rollNo") || selectedInterests.Roll_no;
  
    if (!rollNo) {
      console.error("❌ Roll number is missing!");
      return;
    }
  
    const payload = {
      Roll_no: rollNo,
      Sports: selectedInterests.Sports,
      Movies: selectedInterests.Movies,
      Music: selectedInterests.Music,
      Technology: selectedInterests.Technology,
      Binge_watch: selectedInterests.Binge_watch,
      group_assigned: selectedInterests.group_assigned,
    };
  
    console.log("📦 Payload being sent:", payload);
  
    try {
      const response = await fetch("http://localhost:5000/api/interestsgrp/addinterests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("✅ Interests submitted:", data);
        navigate('/Login');
      } else {
        console.error("🚨 Submission failed:", data.message);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  };
  return (
    <div>
      <div className="interests-header">
        <h2>FILL YOUR INTERESTS IN THE DROPDOWN MENU BELOW</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="pentagon-container">
          <div className="interest-title">Interests</div>

          {/* Sports */}
          <Dropdown className="pentagon-item" style={{ top: '10%', left: '50%' }}>
            <Dropdown.Toggle variant="secondary" id="dropdown-sports">
              {selectedInterests.Sports || 'Sports'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {Object.keys(GROUP_CODES.Sports).map(item => (
                <Dropdown.Item key={item} onClick={() => handleSelect('Sports', item)}>
                  {item}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {/* Movies */}
          <Dropdown className="pentagon-item" style={{ top: '40%', left: '20%' }}>
            <Dropdown.Toggle variant="secondary" id="dropdown-movies">
              {selectedInterests.Movies || 'Movies'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {Object.keys(GROUP_CODES.Movies).map(item => (
                <Dropdown.Item key={item} onClick={() => handleSelect('Movies', item)}>
                  {item}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {/* Technology */}
          <Dropdown className="pentagon-item" style={{ top: '40%', left: '80%' }}>
            <Dropdown.Toggle variant="secondary" id="dropdown-technology">
              {selectedInterests.Technology || 'Technology'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {Object.keys(GROUP_CODES.Technology).map(item => (
                <Dropdown.Item key={item} onClick={() => handleSelect('Technology', item)}>
                  {item}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {/* Music */}
          <Dropdown className="pentagon-item" style={{ top: '70%', left: '30%' }}>
            <Dropdown.Toggle variant="secondary" id="dropdown-music">
              {selectedInterests.Music || 'Music'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {Object.keys(GROUP_CODES.Music).map(item => (
                <Dropdown.Item key={item} onClick={() => handleSelect('Music', item)}>
                  {item}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {/* Binge & Watch */}
          <Dropdown className="pentagon-item" style={{ top: '70%', left: '70%' }}>
            <Dropdown.Toggle variant="secondary" id="dropdown-bingeWatch">
              {selectedInterests.Binge_watch || 'Binge & Watch'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {Object.keys(GROUP_CODES.Binge_watch).map(item => (
                <Dropdown.Item key={item} onClick={() => handleSelect('Binge_watch', item)}>
                  {item}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </motion.div>

        <div className="form-actions">
          <Button variant="primary" type="submit">Submit</Button>
        </div>
      </form>

      <Footer />
    </div>
  );
}
