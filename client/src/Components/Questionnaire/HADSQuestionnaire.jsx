import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './Questionnaire.css';
import Countdown from '../CountDown/Countdown';
import { BASE_URL } from '../../constants';
import Result from './Result';
const questions = [
  { question: 'I feel tense or "wound up"', options: ['Most of the time', 'A lot of the time', 'From time to time, occasionally', 'Not at all'] },
  { question: 'I still enjoy the things I used to enjoy', options: ['Definitely as much', 'Not quite so much', 'Only a little', 'Hardly at all'] },
  { question: 'I get a sort of frightened feeling as if something awful is about to happen', options: ['Very definitely and quite badly', 'Yes, but not too badly', 'A little, but it doesn\'t worry me', 'Not at all'] },
  { question: 'I can laugh and see the funny side of things', options: ['As much as I always could', 'Not quite so much now', 'Definitely not so much now', 'Not at all'] },
  { question: 'Worrying thoughts go through my mind', options: ['A great deal of the time', 'A lot of the time', 'From time to time, but not too often', 'Only occasionally'] },
  { question: 'I feel cheerful', options: ['Not at all', 'Not often', 'Sometimes', 'Most of the time'] },
  { question: 'I can sit at ease and feel relaxed', options: ['Definitely', 'Usually', 'Not Often', 'Not at all'] },
  { question: 'I feel as if I am slowed down', options: ['Nearly all the time', 'Very often', 'Sometimes', 'Not at all'] },
  { question: 'I get a sort of frightened feeling like "butterflies" in the stomach', options: ['Not at all', 'Occasionally', 'Quite Often', 'Very Often'] },
  { question: 'I have lost interest in my appearance', options: ['Definitely', 'I don\'t take as much care as I should', 'I may not take quite as much care', 'I take just as much care as ever'] },
  { question: 'I feel restless as if I have to be on the move', options: ['Very much indeed', 'Quite a lot', 'Not very much', 'Not at all'] },
  { question: 'I look forward with enjoyment to things', options: ['As much as I ever did', 'Rather less than I used to', 'Definitely less than I used to', 'Hardly at all'] },
  { question: 'I get sudden feelings of panic', options: ['Very often indeed', 'Quite often', 'Not very often', 'Not at all'] },
  { question: 'I can enjoy a good book or radio or TV program', options: ['Often', 'Sometimes', 'Not often', 'Very seldom'] }
];

const optionScores = {
  'Most of the time': 3,
  'A lot of the time': 2,
  'From time to time, occasionally': 1,
  'Not at all': 0,
  'Definitely as much': 0,
  'Not quite so much': 1,
  'Only a little': 2,
  'Hardly at all': 3,
  'Very definitely and quite badly': 3,
  'Yes, but not too badly': 2,
  'A little, but it doesn\'t worry me': 1,
  'As much as I always could': 0,
  'Not quite so much now': 1,
  'Definitely not so much now': 2,
  'A great deal of the time': 3,
  'A lot of the time': 2,
  'From time to time, but not too often': 1,
  'Only occasionally': 0,
  'Not often': 2,
  'Sometimes': 1,
  'Definitely': 0,
  'Usually': 1,
  'Not Often': 2,
  'Nearly all the time': 3,
  'Very often': 2,
  'Occasionally': 1,
  'Quite Often': 2,
  'Very Often': 3,
  'I don\'t take as much care as I should': 2,
  'I may not take quite as much care': 1,
  'Very much indeed': 3,
  'Quite a lot': 2,
  'Not very much': 1,
  'Rather less than I used to': 1,
  'Definitely less than I used to': 2,
  'Hardly at all': 3,
  'Very often indeed': 3,
  'Quite often': 2,
  'Not very often': 1,
  'Often': 0,
  'Very seldom': 3
};

const calculateScore = (responses) => {
  return responses.reduce((total, response) => {
    const score = optionScores[response.answer];
    return total + (score !== undefined ? score : 0);
  }, 0);
};

const getAnxietyDepressionLevel = (score) => {
  if (score >= 15) return 'Severe';
  if (score >= 11) return 'Moderate';
  if (score >= 8) return 'Mild';
  return 'Normal';
};

const HADSQuestionnaire = () => {
  const { user, token } = useSelector((state) => state.auth);
  const userId = user.userId;
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
      const anxietyLevel = getAnxietyDepressionLevel(score);
      setResult({ score, anxietyLevel });

      const response = await axios.post(`${BASE_URL}/submit-hads`, {
        userId,
        responses,
        score
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
        <div style={{display:'flex',flexDirection:'column'}}>
        <h1>Hospital Anxiety and Depression Scale questionnaire</h1>
        <button className='start-btn' onClick={() => { setShowStartButton(false); setShowCountdown(true); }}>
          Start HADS Questionnaire
        </button>
        </div>
      ): showCountdown ? (
        <Countdown onComplete={() => setShowCountdown(false)} />
      ) : result ? (
        <Result score={result.score} depressionLevel={result.anxietyLevel} />
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

export default HADSQuestionnaire;
