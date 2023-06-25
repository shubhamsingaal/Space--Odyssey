import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import AlreadyCompleted from './alreadycompleted';
import { auth, db} from '../components/firebase';
import '../styles/game.css';
import {addDoc, doc, collection, getDoc, getDocs} from 'firebase/firestore';

const QuestionPage = () => {
  document.title = "Question- Space Odyssey| ISTE Students' Chapter NIT Durgapur"
  const [user, setUser] = useState(null);
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const navigate = useNavigate();

  // comment this down on production
  // to check for all answers
  const checkAnswers = async (e) => {
    const queryRef = collection(db, 'answer')  // users
    const querySnapshot = await getDocs(queryRef)
    let greatUsers = []
    querySnapshot.forEach((doc) => {
      let data = doc.data()
      if(data.answer==='correct') greatUsers.add(data.userID)
      console.log(`Document ID: ${doc.id} Data: ${doc.data()}`)
    })
    console.log(greatUsers)

    let correctUserNames = []
    for(let user_id of greatUsers) {
      let user_data = await getDoc(doc(db, 'user', user_id))
      correctUserNames.add(user_data.data().name)
    }

    console.log('Correct users are:')
    console.log(correctUserNames)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      checkAnswers()
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      navigate('/AlreadyCompleted'); // Navigate to the next page after the timer ends
    }

    let timer = null;

    if (timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [timeLeft, navigate]);

  const postAnswer = async (e) => {
    e.preventDefault()

    e.target.setAttribute('disabled', true)
    e.target.innerHTML = 'please wait...'

    const currentTime = new Date().getTime();

    await addDoc(collection(db, 'answer'), {
      answer: answer,
      userID: user.uid,
      timestamp: currentTime,
    })
    .then(() => {
      console.log('Answer submitted successfully!');
      setAnswer('');
      setTimeLeft(10); // Set the timer for 10 seconds for the next question
    })
    .catch((error) => {
      console.error('Error submitting answer:', error);
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
        <div className="time-left">{timeLeft}</div>
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
          This is a sample question that spans across multiple lines. The question is long enough to showcase the styling applied to the question div. You can change the font, style, and add any additional CSS properties to make it visually appealing.
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
