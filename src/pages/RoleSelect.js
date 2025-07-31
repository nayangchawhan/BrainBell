import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const RoleSelect = () => {
  const navigate = useNavigate();

  const handleRole = async (role) => {
    const uid = auth.currentUser.uid;
    await setDoc(doc(db, 'users', uid), {
      email: auth.currentUser.email,
      role: role,
    });
    navigate(role === 'teacher' ? '/teacher' : '/'); // Replace with student dashboard when ready
  };

  return (
    <div className="p-4">
      <h1>Select your role:</h1>
      <button onClick={() => handleRole('student')}>Student</button>
      <button onClick={() => handleRole('teacher')}>Teacher</button>
    </div>
  );
};

export default RoleSelect;
