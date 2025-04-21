import React from 'react';
import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <div>
      <footer className="text-center bg-body-tertiary">
        {/* Grid container */}
        <div className="container pt-4">
          {/* Section: Social media */}
          <section className="mb-4">
            {/* Facebook */}
            <a
              data-mdb-ripple-init
              className="btn btn-link btn-floating btn-lg text-body m-1"
              href="#!"
              role="button"
              data-mdb-ripple-color="dark"
              style={{ color: 'blue' }}  // Blue text color
            >
              <i className="fab fa-facebook-f"></i>
            </a>

            {/* Twitter */}
            <a
              data-mdb-ripple-init
              className="btn btn-link btn-floating btn-lg text-body m-1"
              href="#!"
              role="button"
              data-mdb-ripple-color="dark"
              style={{ color: 'blue' }}  // Blue text color
            >
              <i className="fab fa-twitter"></i>
            </a>

            {/* Google */}
            <a
              data-mdb-ripple-init
              className="btn btn-link btn-floating btn-lg text-body m-1"
              href="#!"
              role="button"
              data-mdb-ripple-color="dark"
              style={{ color: 'blue' }}  // Blue text color
            >
              <i className="fab fa-google"></i>
            </a>

            {/* Instagram */}
            <a
              data-mdb-ripple-init
              className="btn btn-link btn-floating btn-lg text-body m-1"
              href="#!"
              role="button"
              data-mdb-ripple-color="dark"
              style={{ color: 'blue' }}  // Blue text color
            >
              <i className="fab fa-instagram"></i>
            </a>

            {/* Linkedin */}
            <a
              data-mdb-ripple-init
              className="btn btn-link btn-floating btn-lg text-body m-1"
              href="#!"
              role="button"
              data-mdb-ripple-color="dark"
              style={{ color: 'blue' }}  // Blue text color
            >
              <i className="fab fa-linkedin"></i>
            </a>

            {/* Github */}
            <a
              data-mdb-ripple-init
              className="btn btn-link btn-floating btn-lg text-body m-1"
              href="#!"
              role="button"
              data-mdb-ripple-color="dark"
              style={{ color: 'blue' }}  // Blue text color
            >
              <i className="fab fa-github"></i>
            </a>
          </section>
          {/* Section: Social media */}
        </div>
        {/* Grid container */}

        {/* Copyright */}
        <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
          <span style={{ color: 'blue' }}>© 2024 Copyright:</span> {/* Blue text color */}
          <Link className="text-body" to="/" style={{ color: 'blue' }}>
            EA AND HAM 2024 Software team
          </Link>
        </div>
        {/* Copyright */}
      </footer>
    </div>
  );
}
