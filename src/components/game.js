import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../components/firebase';
import '../styles/game.css';
import { addDoc, doc, collection, getDoc, getDocs } from 'firebase/firestore';

import ReactMarkdown from 'react-markdown'
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"

const QuestionPage = () => {
  document.title = "Question- Space Odyssey| ISTE Students' Chapter NIT Durgapur";
  const [user, setUser] = useState(null);
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(-1);
  const [submitted, setSubmitted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(new Date().getDate() - 26); // Track the current question index
  const navigate = useNavigate();

  const questions = [
    {
      id: 1,
      text: `
Question 1: You are in a space shuttle about to land on the Moon.
While you must be wondering how and why would you be solving this question if you are already
going to the moon and doing such an important mission. But let me tell you this is going to be the
most important question of your life. Given this code predict the output
\`\`\`python
print("hello world")
\`\`\`
what else do you think`,
    },
    {
      id: 2,
      text: 'Question 2: Who painted the Mona Lisa?',
    },
    // Add more questions here
  ];

  useEffect(() => {
    if (!submitted) return;

    if (timeLeft === 0) {
      setQuestionIndex((prevIndex) => prevIndex + 1); // Move to the next question
      setTimeLeft(-1); // Reset the timer
    }

    let timer = null;

    if (timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [timeLeft, submitted]);

  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unregisterAuthObserver();
  }, []);

  const postAnswer = async (e) => {
    e.preventDefault();

    e.target.setAttribute('disabled', true);
    e.target.innerHTML = 'please wait...';

    const currentTime = new Date().getTime();

    await addDoc(collection(db, 'answers'), {
      questionId: questions[questionIndex].id,
      answer: answer,
      userId: user.uid,
      timestamp: currentTime,
    })
      .then(() => {
        console.log('Answer submitted successfully!');
        setSubmitted(true);
        setAnswer('');
        const next_date = new Date(`Jun ${new Date().getDate()+1} 2023 16:00:00 GMT+0530 (India Standard Time)`)
        setTimeLeft(parseInt((next_date-new Date())/1000)); // Set the timer for 10 seconds for the next question
      })
      .catch((error) => {
        console.error('Error submitting answer:', error);
      });
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/'); // Redirect to the home page after logout
  };

  if (questionIndex >= questions.length) {
    navigate('/completed', { replace: true });
    return null; // Redirect to the completed page if all questions have been answered
  }

  const currentQuestion = questions[questionIndex];

  if (timeLeft !== -1 && timeLeft > 0) {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    return (
      <div className="question-page">
        <h2>Time Left</h2>
        <p>Get back tomorrow to see the next question </p>
        <div className="time-left">
          {hours < 10 ? '0' + hours : hours}:
          {minutes < 10 ? '0' + minutes : minutes}:
          {seconds < 10 ? '0' + seconds : seconds}
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="question-page">
      <h1 className="question-heading">Space Odyssey</h1>
      <h2>Question Page</h2>
      <div className="question-div">
        <p>
          <ReactMarkdown 
            children={currentQuestion.text} 
            rehypePlugins={[rehypeRaw, remarkGfm]}>
          </ReactMarkdown>
        </p>
      </div>
      <form onSubmit={postAnswer}>
        <label>
          Answer:
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </label>
        <div className="button-container">
          <button className="submit-button" type="submit">
            Submit Answer
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionPage;
