import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../components/firebase';
import '../styles/game.css';


const QuestionPage = () => {
  const [user, setUser] = useState(null);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
    navigate('/'); // Redirect to the home page after logout
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      // User not logged in, handle the error or redirect to the login page
      return;
    }

    setIsSubmitting(true);

    const currentTime = new Date().getTime();

    // Here, you should implement the logic to check if the answer is correct
    const isAnswerCorrect = answer === 'Correct Answer';

    firestore
      .collection('answers')
      .add({
        answer,
        userId: user.uid,
        timestamp: currentTime,
        isCorrect: isAnswerCorrect,
      })
      .then(() => {
        console.log('Answer submitted successfully!');
        setAnswer('');
        setIsSubmitting(false);

        if (isAnswerCorrect) {
          setIsCorrect(true);
        } else {
          setIsCorrect(false);
        }
      })
      .catch((error) => {
        console.error('Error submitting answer:', error);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="question-page">
      <h2>Question Page</h2>
      <div className="question-div">
        <p>
          This is a sample question that spans across multiple lines. The question is long enough to showcase the styling applied to the question div. You can change the font, style, and add any additional CSS properties to make it visually appealing.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          Answer:
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </label>
        <div className="button-container">
          <button className="submit-button" type="submit" disabled={isSubmitting}>
            Submit Answer
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        {isSubmitting && <div className="submitting">Submitting...</div>}
        {isCorrect !== null && (
          <div className={`answer-popup ${isCorrect ? 'correct' : 'wrong'}`}>
            {isCorrect ? 'Correct answer!' : 'Wrong answer!'}
          </div>
        )}
      </form>
    </div>
  );
};

export default QuestionPage;
