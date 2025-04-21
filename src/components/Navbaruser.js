import React from 'react';
import { Link, useParams } from 'react-router-dom';

export default function Navbaruser() {
  const { id } = useParams(); // Extract the id from the route

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand text-white fs-3" to="/">
          EA AND HAM 2024
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav ms-auto">
            <Link className="nav-item nav-link text-white fs-5" to={`/${id}`}>
              Home
            </Link>
            <Link className="nav-item nav-link text-white fs-5" to={`/${id}/interests`}>
              Fill Your Interests
            </Link>
            <Link className="nav-item nav-link text-white fs-5" to={`/${id}/community`}>
              View Your Group
            </Link>
            <Link className="nav-item nav-link text-white fs-5" to="/">
              Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
