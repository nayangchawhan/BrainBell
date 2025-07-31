import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';
import { auth } from '../firebase'; // Import auth from firebase.js

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>BrainBell</div>
      <div className="navbar-links">
        <Link to="/student-dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>
        <button onClick={() => auth.signOut().then(() => navigate('/login'))}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
