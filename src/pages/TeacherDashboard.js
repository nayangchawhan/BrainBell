import React, { useEffect, useState } from 'react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/StudentDashboard.css';

const TeacherDashboard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quizzes, setQuizzes] = useState([]);

  const handleAddQuiz = async (e) => {
    e.preventDefault();
    if (!title || !description) return alert('Please enter title and description');
    await addDoc(collection(db, 'quizzes'), { title, description });
    setTitle('');
    setDescription('');
    fetchQuizzes();
  };

  const fetchQuizzes = async () => {
    const querySnapshot = await getDocs(collection(db, 'quizzes'));
    const quizList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setQuizzes(quizList);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>🧑‍🏫 Teacher Dashboard</h2>
      <form onSubmit={handleAddQuiz} className="add-quiz-form">
        <input type="text" value={title} placeholder="Quiz Title" onChange={(e) => setTitle(e.target.value)} />
        <textarea value={description} placeholder="Quiz Description" onChange={(e) => setDescription(e.target.value)} />
        <button type="submit">Add Quiz</button>
      </form>

      <h3>📋 Existing Quizzes</h3>
      <ul className="quiz-list">
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            <strong>{quiz.title}</strong>: {quiz.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherDashboard;
