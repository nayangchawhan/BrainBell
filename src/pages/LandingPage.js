import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/landing.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <nav className="nav">
        <div className="logo">BrainBell</div>
        <div className="nav-buttons">
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </nav>

      <div className="hero">
        <h1>Smart MCQ Testing for Schools</h1>
        <p>Daily randomized tests, automated performance reports, and leaderboards — built for modern classrooms.</p>
        <button className="cta" onClick={() => navigate('/signup')}>Get Started</button>
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} BrainBell. Built with ❤️ for education.
      </footer>
    </div>
  );
};

export default LandingPage;
