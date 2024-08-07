import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './Questionnaire.css';
import Countdown from '../CountDown/Countdown';

const questions = [
  { question: 'Little interest or pleasure in doing things', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
  { question: 'Feeling down, depressed, or hopeless', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
  { question: 'Trouble falling or staying asleep, or sleeping too much', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
  { question: 'Feeling tired or having little energy', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
  { question: 'Poor appetite or overeating', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
  { question: 'Feeling bad about yourself — or that you are a failure or have let yourself or your family down', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
  { question: 'Trouble concentrating on things, such as reading the newspaper or watching television', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
  { question: 'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
  { question: 'Thoughts that you would be better off dead, or of hurting yourself in some way', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] }
];

const optionScores = {
  'Not at all': 0,
  'Several days': 1,
  'More than half the days': 2,
  'Nearly every day': 3
};

const calculateScore = (responses) => {
  return responses.reduce((total, response) => total + optionScores[response.answer], 0);
};

const getDepressionLevel = (score) => {
  if (score >= 20) return 'Severe Depression';
  if (score >= 15) return 'Moderately Severe Depression';
  if (score >= 10) return 'Moderate Depression';
  if (score >= 5) return 'Mild Depression';
  return 'Minimal or No Depression';
};

const Questionnaire = () => {
    const { user, token } = useSelector((state) => state.auth);
    const userId=user.userId;  
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState(Array(questions.length).fill(null));
    const [result, setResult] = useState(null);
    const [showStartButton, setShowStartButton] = useState(true);
    const [showCountdown, setShowCountdown] = useState(false);
  const handleOptionSelect = (index, answer) => {
    const newResponses = [...responses];
    newResponses[index] = { question: questions[index].question, answer };
    setResponses(newResponses);
  };

  const handleSubmit = async () => {
    try {
      const score = calculateScore(responses);
      const depressionLevel = getDepressionLevel(score);
      setResult({ score, depressionLevel });
      const response = await axios.post('http://localhost:5003/submit-phq9', {
        userId,
        responses,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log(response);
      
      console.log('Responses added to user submissions successfully');
    } catch (error) {
      console.error('Error adding responses to user submissions:', error);
    }
  };

  return (
    <div className="questionnaire-container">
      {showStartButton ? (
        <button className='start-btn' onClick={() => { setShowStartButton(false); setShowCountdown(true); }}>
          Start PHQ9 Questionnaire
        </button>
      ): showCountdown ? (
        <Countdown onComplete={() => setShowCountdown(false)} />
      ) : result ? (
        <div className='card'>
        <div className="result-container">
          <h2>Your Score: {result.score}</h2>
          <p><b>Depression Level:</b> {result.depressionLevel}</p>
        </div>
        </div>
      ) : (
        <div className="card">
          <div className="question-container">
            <h2>{questions[currentQuestionIndex].question}</h2>
            <div className="options-container">
              {questions[currentQuestionIndex].options.map(option => (
                <button
                  key={option}
                  className={`option-button ${responses[currentQuestionIndex]?.answer === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(currentQuestionIndex, option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="navigation-buttons">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              >
                Prev
              </button>
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  disabled={responses[currentQuestionIndex] === null}
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                >
                  Next
                </button>
              ) : (
                <button
                  disabled={responses.includes(null)}
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questionnaire;
