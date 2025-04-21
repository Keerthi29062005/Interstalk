import React, { useState } from 'react';
import { Dropdown, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Interests.css';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbaruser from '../components/Navbaruser';
import Footer from '../components/Footer';

export default function InterestsForm() {
  const { id } = useParams(); // Extract roll number from URL
  const navigate = useNavigate(); // Navigation hook for redirection

  const [selectedInterests, setSelectedInterests] = useState({
    Roll_no: id, // Initialize Roll_no with the extracted id
    sports: '',
    movies: '',
    music: '',
    technology: '',
    bingeWatch: '',
    group_assigned:0
  });

  // Handle selection of an interest
  const handleSelect = (category, interest) => {
    setSelectedInterests((prevState) => ({
      ...prevState,
      [category]: interest
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log(selectedInterests);
    try {
      const response = await fetch(`http://localhost:5000/api/${id}/interests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedInterests)
      });

      const json = await response.json();
      console.log(json);

      if (json.success) {
        alert('Interests submitted successfully!');
        navigate(`/${id}/community`);
      } else {
        alert('Submission failed: ' + json.message);
      }
    } catch (error) {
      console.error('Error submitting interests:', error);
      alert('Submission failed. Please try again later.');
    }
  };

  return (
    <div>
      <div className="navbar_div">
        <Navbaruser />
      </div>
      <div>
        <h2>FILL YOUR INTERESTS IN THE DROPDOWN MENU BELOW</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="pentagon-container">
          {/* Central Interest Title */}
          <div className="interest-title">Interests</div>

          {/* Pentagon Items */}
          <Dropdown className="pentagon-item" style={{ top: '10%', left: '50%' }}>
            <Dropdown.Toggle variant="secondary" id="dropdown-sports">
              {selectedInterests.sports || 'Sports'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleSelect('sports', 'Cricket')}>Cricket</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelect('sports', 'Football')}>Football</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelect('sports', 'Kabaddi')}>Kabaddi</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown className="pentagon-item" style={{ top: '40%', left: '20%' }}>
            <Dropdown.Toggle variant="secondary" id="dropdown-movies">
              {selectedInterests.movies || 'Movies'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleSelect('movies', 'Hollywood')}>Hollywood</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelect('movies', 'Bollywood')}>Bollywood</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelect('movies', 'Tollywood')}>Tollywood</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown className="pentagon-item" style={{ top: '40%', left: '80%' }}>
            <Dropdown.Toggle variant="secondary" id="dropdown-technology">
              {selectedInterests.technology || 'Technology'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleSelect('technology', 'AI & ML')}>AI & ML</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelect('technology', 'Robotics')}>Robotics</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelect('technology', 'Coding')}>Coding</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown className="pentagon-item" style={{ top: '70%', left: '30%' }}>
            <Dropdown.Toggle variant="secondary" id="dropdown-music">
              {selectedInterests.music || 'Music'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleSelect('music', 'Rock')}>Rock</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelect('music', 'Classical')}>Classical</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelect('music', 'Melody')}>Melody</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown className="pentagon-item" style={{ top: '70%', left: '70%' }}>
            <Dropdown.Toggle variant="secondary" id="dropdown-bingeWatch">
              {selectedInterests.bingeWatch || 'Binge & Watch'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleSelect('bingeWatch', 'Popular Series')}>Popular Series</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelect('bingeWatch', 'Anime')}>Anime</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelect('bingeWatch', 'Netflix Originals')}>Netflix Originals</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </motion.div>

        {/* Submit Button */}
        <div className="form-actions">
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </form>

      <div className="user_footer">
        <Footer />
      </div>
    </div>
  );
}
