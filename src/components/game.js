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
Question 1: As a space explorer, you embark on a mission to navigate through a complex asteroid belt. Your spacecraft starts at a safe location in space. While preparing for your journey, you receive a peculiar set of navigation instructions encoded in a mysterious transmission. The instructions are crucial for safely maneuvering through the treacherous asteroid belt.
Curious and determined, you begin decoding the instructions, and to your surprise, they seem to be related to a unique concept called "Stellar Sequences." Each instruction corresponds to a particular maneuver you need to make, but the nature of the maneuvers is intertwined with these sequences.
The encoded instructions guide you through the asteroid belt based on the properties of Stellar Sequences. A Stellar Sequence is defined as a sequence whose the decimal notations of all its digits are the same.
You swiftly implement an algorithm to calculate the number Stellar Sequence from 1 to n. As you traverse the asteroid belt, you encounter various obstacles, and for each obstacle, you decode the corresponding instruction using the algorithm. <br> <br> Example 1 <br>
Input: 5 <br>
Output: 5 <br>

Since in the range of 1 to n(5)
1 -> steller sequence (all digits are equal to 1)
2 -> steller sequence (all digits are equal to 2)
3 -> steller sequence (all digits are equal to 3)
4 -> steller sequence (all digits are equal to 4)
5 -> steller sequence (all digits are equal to 5) <br> <br> Example 2 <br>
Input: 11 <br>
Output: 10 <br> <br>
1 -> steller sequence <br>
2 -> steller sequence <br>
3 -> steller sequence<br>
4 -> steller sequence<br>
5 -> steller sequence<br>
6 -> steller sequence<br>
7 -> steller sequence<br>
8 -> steller sequence<br>
9 -> steller sequence<br>
10 -> not steller sequence (since one digit is 1 and other is 0)<br>
11 -> steller sequence <br> <br>
Case: <br> Input : 49500 <br>
Output: ? `,
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
        const next_date = new Date(`Jun ${new Date().getDate() + 1} 2023 16:00:00 GMT+0530 (India Standard Time)`)
        setTimeLeft(parseInt((next_date - new Date()) / 1000)); // Set the timer for 10 seconds for the next question
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
      <h1>Space Odyssey</h1>
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
