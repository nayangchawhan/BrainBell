import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, provider, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import Navbar from '../components/Navbarl';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      const snap = await get(ref(db, `users/${uid}/role`));

      if (!snap.exists()) {
        alert('User not registered. Please complete signup.');
        return;
      }

      const role = snap.val();
      console.log('Role:', role);

      if (role === 'student') {
        navigate('/student-dashboard');
      } else if (role === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        alert('Invalid role assigned to user.');
      }
    } catch (err) {
      console.error('Login Error:', err.message);
      alert('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const res = await signInWithPopup(auth, provider);
      const uid = res.user.uid;
      const snap = await get(ref(db, `users/${uid}/role`));

      if (!snap.exists()) {
        alert('Account not registered. Please sign up first.');
        return;
      }

      const role = snap.val();
      console.log('Google login role:', role);

      if (role === 'student') {
        navigate('/student-dashboard');
      } else if (role === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        alert('Invalid role assigned to Google user.');
      }
    } catch (err) {
      console.error('Google Login Error:', err.message);
      alert('Google login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <h2>Login to BrainBell</h2>
        <form className="login-form" onSubmit={handleEmailLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login with Email'}
          </button>
        </form>
        <div className="divider">OR</div>
        <button className="google-button" onClick={handleGoogleLogin} disabled={loading}>
          {loading ? 'Please wait...' : 'Sign in with Google'}
        </button>
        <p className="signup-link">
          Don’t have an account?{' '}
          <span onClick={() => navigate('/signup')}>Sign up</span>
        </p>
      </div>
    </>
  );
};

export default Login;
