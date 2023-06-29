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
      text: `
As you move forward through the vast expanse of space, you encounter a dense and treacherous asteroid belt blocking your path. Fortunately, you have a set of navigation instructions to guide you through the perilous obstacles. However, these instructions are encoded in a peculiar way, adding an extra layer of complexity to your mission.

The encoded navigation instructions consist of a series of maneuvers represented by numerical codes. Each code corresponds to a specific action you must take to navigate through the asteroid belt. However, deciphering these instructions and determining the minimum number of maneuvers required to reach your destination safely is crucial for the success of your mission.

In this particular scenario, the numerical codes represent the current coordinates of your spacecraft and the destination coordinates you need to reach in the asteroid belt. Each maneuver involves choosing an integer k from the range of 1 to 10 and either adding it to or subtracting it from the current coordinates of your spacecraft. The objective is to transform the starting coordinates to match the destination coordinates by carefully selecting the maneuvers.

Now, utilizing your problem-solving skills and understanding of the encoded instructions, how can you decipher the numerical codes and calculate the minimum number of maneuvers needed to transform the starting coordinates of your spacecraft to match the destination coordinates? Your expertise in unraveling the encoded instructions and determining the optimal sequence of maneuvers will be vital in navigating through the asteroid belt and ensuring a safe and successful journey through space.

## Example 1
\`\`\`
Input: current coordinate = 13 , destination = 42
Output: 3
explanation:
13→23→32→42 (add 10, add 9, add 10)
\`\`\`

## Test Case 1:
\`Input: current coordinate = 100 , destination = 10000\`
## Test Case 2:
\`Input: current coordinate = 10000 , destination = 100\`
## Test Case 3:
\`Input: current coordinate = 123456789 , destination = 987654321\`

## Answer format:
\`\`\`
Let the answer for 1st, 2nd and 3rd test cases be a, b, c
return its sum, i.e a+b+c 
\`\`\`
`,
    },
    {
      id: 3,
      text: `
After successfully deciphering the previously encoded navigation instructions, you feel a surge of accomplishment and confidence. Your expertise in code-breaking has paid off, and now you are ready to put your piloting skills to the test as you navigate through the treacherous asteroid belt.

As you venture deeper into the asteroid belt, the complexity of the obstacles increases. Massive boulders float ominously, their jagged edges gleaming in the distant sunlight. Swift-moving clusters of smaller asteroids zip by, creating a dangerous labyrinth requiring utmost focus and precision.

As you move forward you encountered a planet, you wish to explore the planet, but soon found out that the planet is the residence of a highly advanced life form, they require a password to enter it.

Fortunately, your crewmate hacks into the system of the planet and steals the instructions to get the password and codes, the instructions are as follows, given the list of code, the password is obtained by getting the summation of the next prime number associated with the respective code
      
## Example 1
    input:
        codes = [2, 5, 12, 15, 20]
    output:
        password = 63
      
### Explanation:
    Next prime number of each of the code:
        nextPrime=[3,7,13,17,23]
    Now the password is supposed to be the sum of all the next primes of the corresponding codes.
    
    Therefore, password = 3+7+13+17+23 = 63
      
## Test Case 
    input: codes = [325235, 3254234, 213432, 87685, 5435244]   
      
## Answer format: 
    let nextPrime = [x, y, z, a, b]
    return ((x+y+z+a+b+c)%123)*123 
    
    i,e ((password%123)*123)      
`
    },
    {
      id: 4,
      text: `
As you delve deeper into the planet's security system, you realize that cracking the first layer of security was just the beginning. The planet's advanced defense mechanisms have an intricate second layer of security. It becomes clear that to progress further, you must decipher the second layer as well.
With renewed determination, you start investigating the nature of the second layer.
After further trial and error, you found out how the password is formed. You also discovered additional information that the password of this layer can only contain two possible values y and N (both uppercase letters)  representing yes and no respectively.
The relation is as follows, for every code in codes, check if the code is Holy. if it is then the codeValue is Y and if it isn't the codeValue is N. The password of this level is the string containing the codeValue of all the code in  codes.
Holy:
A Holy number is defined as a positive integer where the sum of the squares of its digits eventually converges to 1 after repeatedly replacing the number with the sum of the squares of its digits.


## Example of a Holy number:
    code = 19
    output: "Y"
    Explanation:
    1^2 + 9^2 = 82
    8^2 + 2^2 = 68
    6^2 + 8^2 = 100
    1^2 + 0^2 + 0^2 = 1

## Example of an unHoly number:
    code = 5
    output = "N"
    Explanation:
    5^2 = 25
    2^2 + 5^2 = 29
    2^2 + 9^2 = 85
    8^2 + 5^2 = 89
    8^2 + 9^2 = 145
    1^2 + 4^2+ 5^2 = 42
    4^2 + 2^2 = 20
    2^2 + 0^2 = 4
    4^2  = 16
    1^2 + 6^2 = 37
    3^2 + 7^2 = 58
    5^2 + 8^2 = 89

    We can see that '89' has already appeared in
    the process, by intuition, we can say that, 
    this sequence will go an infinite number of 
    times, and this same set of values will be 
    repeated over and over again. Hence never
    reaching 0.   



## Example 1
    input:
    codes = [2, 5, 12, 15, 20]
    output: 
    password = "NNNNN"

    Explanation:
    All the code of 'codes' are unHoly

## Example 2
    input: 
    codes = [6,7,8,9,19]
    output: 
    password = "NYNNY"

    Explanation:
    6 -> unHoly
    7 -> Holy
    8 -> unHoly
    9 -> unHoly
    19 -> Holy      
      

      
## Test Case 
    input: 
    codes = [2709653, 8475768, 891859, 9832694,
    2503163, 1288825, 9790551, 7544798, 5426506,
    6954477, 1082318, 5742104, 5299466, 4357213,
    6157215, 8990368, 4810999, 3059153, 1450309,
    710631]  
      
## Answer format: 
    return a string 'str',
    where str[i] is ‘Y’ 
    is codes[i] is 'Holy' 
    else str[i] is 'N'      
`
    },
    {
      id: 5,
      text: `
After cracking the second layer of security you finally landed on this unique planet. As you entered this unique planet, you were greeted with both awe and trepidation by the planet's inhabitants. The jubilant welcome quickly turned sour when the reigning king, feeling threatened by your achievement, challenged you to a duel.
Undeterred by the king's anger, you accepted the challenge with confidence. The duel took place in a grand arena, filled to the brim with curious spectators eager to witness this extraordinary clash of minds. The king, a formidable opponent with years of mental training, engaged you in a battle of wits and strategy.
The jury began explaining the rules, the rules are as follows:

## Example 1
    sequence:   A    B    C    D ......    z    AA    AB    AC   .......    ZZ
          |    |    |    |           |     |    |     |                |
    placeValue :1    2    3    4 ......    26   27    28    29   .......    720

    The jury will give you any element of this sequence (in the form of a string), and 
    whoever answers first wins the round, the answer should be its corresponding placeValue.


## Example 1
    input = "BA"
    output = 53   
   
## Example 2
    input = "JHOOPS"
    output = 122743783  
    
## Example 3
    input = "NITDGP"
    output = 170806470     

## Test Case 1:
    input = "ISTE"

## Test Case 2:
    input = "CHAPTER"

## Test Case 3:
    input = "NIT"  

## Test Case 4:
    input = "DGP"    

## Answer Format:
    Let the value of test case 1,2,3,and 4 be a,b,c,d respectively 
    return:
    (b-21700)%(a+c+d), where % is modulo operator

 Can you be the king?   
 



`
}

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

    await addDoc(collection(db, 'answers5'), {
      questionId: questions[questionIndex].id,
      answer: answer,
      userId: user.uid,
      timestamp: currentTime,
    })
      .then(() => {
        console.log('Answer submitted successfully!');
        setSubmitted(true);
        setAnswer('');
        const next_date = new Date(`Jun ${new Date().getDate() + 1} 2023 00:00:00 GMT+0530 (India Standard Time)`)
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
