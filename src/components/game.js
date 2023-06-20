import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../components/firebase';
import '../styles/game.css';


const QuestionPage = () => {
  const [user, setUser] = useState(null);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      navigate('/next-page'); // Navigate to the next page after the timer ends
    }

    let timer = 1000;

    if (timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [timeLeft, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      // User not logged in, handle the error or redirect to login page
      return;
    }

    setIsSubmitting(true);

    const currentTime = new Date().getTime();

    // Here, you should implement the logic to check if the answer is correct
    const isAnswerCorrect = answer === 'Correct Answer';

    firestore
      .collection('answer')
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
          setTimeLeft(10); // Set the timer for 10 seconds for the next question
        } else {
          setIsCorrect(false);
          alert('Wrong answer!'); // Show an alert for wrong answer
        }
      })
      .catch((error) => {
        console.error('Error submitting answer:', error);
        setIsSubmitting(false);
      });
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/'); // Redirect to the home page after logout
  };

  if (!user) {
    return <div>Please log in to access this page.</div>;
  }

  if (timeLeft !== null && timeLeft > 0) {
    return (
      <div className="question-page">
        <h2>Time Left</h2>
        <div className="time-left">{}</div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

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
        {isCorrect && (
          <div className="correct-answer-popup">
            Correct answer!
          </div>
        )}
      </form>
    </div>
  );
};

export default QuestionPage;
