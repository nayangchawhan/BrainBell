import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { ref, get, set } from 'firebase/database';
import Navbar from '../components/Navbar';
import '../styles/StudentDashboard.css';

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    section: '',
    schoolCode: '',
  });

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;
    const userRef = ref(db, `users/${uid}`);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.val());
        setLoading(false);
      } else {
        setUserData(null);
        setLoading(false);
      }
    });
  }, [uid]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const schoolRef = ref(db, `schools/${formData.schoolCode}`);
    const schoolSnap = await get(schoolRef);

    if (schoolSnap.exists()) {
      // Save user data
      const userRef = ref(db, `users/${uid}`);
      await set(userRef, {
        ...formData,
        schoolName: schoolSnap.val().name,
      });
      setUserData({ ...formData, schoolName: schoolSnap.val().name });
    } else {
      alert('Invalid school code!');
    }
  };

  if (loading) return <div className="dashboard-loading">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="student-dashboard">
        {userData ? (
          <>
            <h2>Welcome, {userData.name} 👋</h2>
            <h4>School: {userData.schoolName}</h4>

            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>🏆 Leaderboard</h3>
                <p>See top performers in your school.</p>
              </div>
              <div className="dashboard-card">
                <h3>📘 Subjects</h3>
                <p>Access subjects and learning materials.</p>
              </div>
            </div>
          </>
        ) : (
          <div className="student-form-box">
            <h2>Complete Your Profile</h2>
            <form onSubmit={handleFormSubmit} className="student-form">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="grade"
                placeholder="Class / Grade"
                value={formData.grade}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="section"
                placeholder="Section"
                value={formData.section}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="schoolCode"
                placeholder="Enter School Code"
                value={formData.schoolCode}
                onChange={handleInputChange}
                required
              />
              <button type="submit">Join School & Continue</button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentDashboard;
