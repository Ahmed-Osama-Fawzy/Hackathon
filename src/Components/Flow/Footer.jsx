import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="site-footer text-center py-3 mt-5 mb-5 bg-dark text-white">
      <p className="mb-1">
        Built for clinicians, data scientists, and researchers.
      </p>
      <nav className="mb-4">
        <Link to="/" className="text-white mx-2">
          Home
        </Link>
        |
        <Link to="/register" className="text-white mx-2">
          Register
        </Link>
        |
        <Link to="/login" className="text-white mx-2">
          Login
        </Link>
      </nav>
      <div className="w-100 d-flex flex-wrap justify-content-between aling-items-center">
        <p className="m-auto "> © 2025 Radiology AI Hackathon Builder. All rights reserved. </p>
        <p className="m-auto small">Powered by <a href="https://ahmed-osama.vercel.app/"  className="text-white fw-bold" target="_blank" rel="noreferrer">Eng Ahmed Osama</a></p>
      </div>
    </footer>
  );
};

export default Footer;