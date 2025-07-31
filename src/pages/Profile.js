// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { ref, get, set, update, child } from 'firebase/database';
import { db, auth } from '../firebase';
import '../styles/Profile.css';
import Navbar from '../components/Navbar';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    age: '',
    grade: '',
    schoolCode: '',
    rollnumber: '',
    blood_group: '',
    address: '',
    phone_number: '',
    father_name: '',
    parents_number: '',
    approved: false,
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [joinStatus, setJoinStatus] = useState('');

  const fetchProfile = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const snapshot = await get(ref(db, `users/${uid}`));
    if (snapshot.exists()) {
      setProfile(prev => ({ ...prev, ...snapshot.val() }));
    }
    setLoading(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    await update(ref(db, `users/${uid}`), profile);
    setEditing(false);
    alert('Profile updated!');
  };

  const handleSchoolJoin = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    if (!profile.schoolCode) {
      setJoinStatus('Please enter your school code.');
      return;
    }

    const schoolRef = ref(db, `schools/${profile.schoolCode}`);
    const schoolSnap = await get(schoolRef);

    if (!schoolSnap.exists()) {
      setJoinStatus('School code not found.');
      return;
    }

    // Create a request entry for teacher to approve
    await set(ref(db, `schoolRequests/${profile.schoolCode}/${uid}`), {
      ...profile,
      approved: false,
      timestamp: Date.now(),
    });

    setJoinStatus('Request sent to school admin. Please wait for approval.');
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  if (loading) return <div className="profile-container">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <h2>User Profile</h2>

        <div className="profile-form">
          {/* Standard profile fields */}
          <label>
            Name:
            <input type="text" name="name" value={profile.name} onChange={handleChange} disabled={!editing} />
          </label>

          <label>
            Email:
            <input type="email" name="email" value={profile.email} onChange={handleChange} disabled />
          </label>

          <label>
            Phone Number:
            <input type="number" name="phone_number" value={profile.phone_number} onChange={handleChange} disabled={!editing} />
          </label>

          <label>
            Age:
            <input type="number" name="age" value={profile.age} onChange={handleChange} disabled={!editing} />
          </label>

          <label>
            Blood Group:
            <input type="text" name="blood_group" value={profile.blood_group} onChange={handleChange} disabled={!editing} />
          </label>

          <label>
            Roll Number:
            <input type="number" name="rollnumber" value={profile.rollnumber} onChange={handleChange} disabled={!editing} />
          </label>

          <label>
            Grade:
            <input type="text" name="grade" value={profile.grade} onChange={handleChange} disabled={!editing} />
          </label>

          <label>
            School Code:
            <input type="text" name="schoolCode" value={profile.schoolCode} onChange={handleChange} disabled={!editing} />
          </label>

          {/* Join school code button */}
          {!profile.approved && !editing && (
            <button onClick={handleSchoolJoin} className="join-btn">
              Request to Join School
            </button>
          )}
          {joinStatus && <p className="join-status">{joinStatus}</p>}

          <label>
            Address:
            <input type="text" name="address" value={profile.address} onChange={handleChange} disabled={!editing} />
          </label>

          <label>
            Father Name:
            <input type="text" name="father_name" value={profile.father_name} onChange={handleChange} disabled={!editing} />
          </label>

          <label>
            Parents Phone Number:
            <input type="number" name="parents_number" value={profile.parents_number} onChange={handleChange} disabled={!editing} />
          </label>

          <div className="profile-actions">
            {!editing ? (
              <button onClick={() => setEditing(true)}>Edit</button>
            ) : (
              <button onClick={handleSave}>Save</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
