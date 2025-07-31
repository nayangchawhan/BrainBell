import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import Navbar from '../components/Navbarl';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!role) return alert('Please select a role');
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;
    await set(ref(db, `users/${uid}`), { email, name, role });
    navigate(role === 'student' ? '/student-dashboard' : '/teacher-dashboard');
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSignup}>
          <h2>Create a BrainBell Account</h2>
          <input type="text" placeholder="Full Name" required onChange={e => setName(e.target.value)} />
          <input type="email" placeholder="Email" required onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required onChange={e => setPassword(e.target.value)} />
          <div className="role-select">
            <label><input type="radio" name="role" value="student" onChange={e => setRole(e.target.value)} /> Student</label>
            <label><input type="radio" name="role" value="teacher" onChange={e => setRole(e.target.value)} /> Teacher</label>
          </div>
          <button type="submit">Sign Up</button>
          <p className="switch-link">Already have an account? <span onClick={() => navigate('/login')}>Login</span></p>
        </form>
      </div>
    </>
  );
};

export default Signup;
