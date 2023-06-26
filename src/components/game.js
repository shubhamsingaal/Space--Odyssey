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
Question 1: As you move forward through the vast expanse of space, you encounter a dense and treacherous asteroid belt blocking your path. Fortunately, you have a set of navigation instructions to guide you through the perilous obstacles. However, these instructions are encoded in a peculiar way, adding an extra layer of complexity to your mission.
The encoded navigation instructions consist of a series of maneuvers represented by numerical codes. Each code corresponds to a specific action you must take to navigate through the asteroid belt. However, deciphering these instructions and determining the minimum number of maneuvers required to reach your destination safely is crucial for the success of your mission.
In this particular scenario, the numerical codes represent the current coordinates of your spacecraft and the destination coordinates you need to reach in the asteroid belt. Each maneuver involves choosing an integer k from the range of 1 to 10 and either adding it to or subtracting it from the current coordinates of your spacecraft. The objective is to transform the starting coordinates to match the destination coordinates by carefully selecting the maneuvers.
Now, utilizing your problem-solving skills and understanding of the encoded instructions, how can you decipher the numerical codes and calculate the minimum number of maneuvers needed to transform the starting coordinates of your spacecraft to match the destination coordinates? Your expertise in unraveling the encoded instructions and determining the optimal sequence of maneuvers will be vital in navigating through the asteroid belt and ensuring a safe and successful journey through space.
<br>
Example 1 <br>
Input: current coordinate = 13 , distination = 42<br>
Output: 3<br>
Explanation:<br>
13→23→32→42 (add 10, add 9, add 10).`,
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
