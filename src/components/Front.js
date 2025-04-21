import React from 'react';
import '../css/Front.css'; // Import the CSS file for styling
import movie from '../images/movie.jpg' 
import sport from '../images/sport.jpg' 
import travel from '../images/travel.jpg' 
import tech from '../images/tech.jpg' 
export default function Front() {
  return (
    <div>
      <div
        id="carouselExampleFade"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="https://static.vecteezy.com/system/resources/previews/035/974/483/non_2x/ai-generated-multi-ethnic-diverse-group-of-people-free-photo.jpg"
              alt="..."
              className="carousel-image"
            />
          </div>
          {/* <div className="carousel-item">
            <img
              src="https://i.pinimg.com/736x/e2/67/6b/e2676b81dbed0ac9bf854da99483c781.jpg"
              alt="..."
              className="carousel-image"
            />
          </div> */}
          <div className="carousel-item">
            <img
              src={movie}
              alt="..."
              className="carousel-image"
            />
          </div>
          <div className="carousel-item">
            <img
              src={sport}
              alt="..."
              className="carousel-image"
            />
          </div>
          <div className="carousel-item">
            <img
              src={travel}
              alt="..."
              className="carousel-image"
            />
          </div>
          <div className="carousel-item">
            <img
              src={tech}
              alt="..."
              className="carousel-image"
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <div className="description-container">
      <h3><i class="fas fa-users"></i> Find Your Tribe</h3>

      <div className="description-container">
      <div className="bg-dark text-light p-4 rounded shadow">
  
      <h4 className="fw-bold mb-3 custom-font">
  Our app is designed to bring like-minded people together in the vibrant campus of NITW. 
  Whether you're a coder, an artist, a gamer, or a fitness enthusiast, this platform helps 
  you connect with individuals who share your passions and interests.
</h4>
<h4 className="fw-bold custom-font">
  Build meaningful friendships, collaborate on exciting projects, and strengthen the NITW 
  community like never before. Let's make our campus a hub of connection, creativity, and 
  collaboration. The journey to finding your tribe starts here.
</h4>



</div>

</div>

      </div>
    </div>
  );
}
