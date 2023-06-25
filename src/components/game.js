import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import AlreadyCompleted from './alreadycompleted';
import { auth, db } from '../components/firebase';
import '../styles/game.css';
import { addDoc, doc, collection, getDoc, getDocs } from 'firebase/firestore';

const QuestionPage = () => {
  document.title = "Question- Space Odyssey| ISTE Students' Chapter NIT Durgapur"
  const [user, setUser] = useState(null);
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(-1);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // comment this down on production
  // to check for all answers
  const checkAnswers = async (e) => {
    const queryRef = collection(db, 'answer')  // users
    const querySnapshot = await getDocs(queryRef)
    let greatUsers = []
    querySnapshot.forEach((doc) => {
      let data = doc.data()
      if (data.answer === 'correct') greatUsers.add(data.userID)
      console.log(`Document ID: ${doc.id} Data: ${doc.data()}`)
    })
    console.log(greatUsers)

    let correctUserNames = []
    for (let user_id of greatUsers) {
      let user_data = await getDoc(doc(db, 'user', user_id))
      correctUserNames.add(user_data.data().name)
    }

    console.log('Correct users are:')
    console.log(correctUserNames)
  }

  const [authState, setAuthState] = useState({
    isSignedIn: false,
    pending: true,
    user: null,
  })

  useEffect(() => {
    if(!submitted) return 

    if (timeLeft === 0) {
      navigate('/completed', {replace:true});
      console.log("trigger"); // Navigate to the next page after the timer ends
    }

    let timer = null;

    if (timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [timeLeft, navigate, submitted]);


  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged(user => {
      setAuthState({ user, pending: false, isSignedIn: !!user })
      setUser(user)
    }
    )
    return () => unregisterAuthObserver()
  }, [])
  // const navigate = useNavigate()


  if (authState.pending) {
    return (<h1> loading... </h1>)
  }
  else if (authState.isSignedIn)
    navigate('/game', { replace: true });



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
        setSubmitted(true);
        setAnswer('');
        setTimeLeft(2); // Set the timer for 10 seconds for the next question
      })
      .catch((error) => {
        console.error('Error submitting answer:', error);
      });
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/'); // Redirect to the home page after logout
  };




  if (timeLeft !== -1 && timeLeft > 0) {
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
          As a space explorer, you embark on a mission to navigate through a complex asteroid belt. Your spacecraft starts at a safe location in space. While preparing for your journey, you receive a peculiar set of navigation instructions encoded in a mysterious transmission. The instructions are crucial for safely maneuvering through the treacherous asteroid belt.
          Curious and determined, you begin decoding the instructions, and to your surprise, they seem to be related to a unique concept called "Stellar Sequences." Each instruction corresponds to a particular maneuver you need to make, but the nature of the maneuvers is intertwined with these sequences.
          The encoded instructions guide you through the asteroid belt based on the properties of Stellar Sequences. A Stellar Sequence is defined as a sequence whose the decimal notations of all its digits are the same.
          You swiftly implement an algorithm to calculate the number Stellar Sequence from 1 to n. As you traverse the asteroid belt, you encounter various obstacles, and for each obstacle, you decode the corresponding instruction using the algorithm.

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
