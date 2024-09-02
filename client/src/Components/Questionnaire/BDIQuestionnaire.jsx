import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Countdown from '../CountDown/Countdown';
import './Questionnaire.css';
import { BASE_URL } from '../../constants';
import Result from './Result';
const questions = [
  { question: 'Sadness', options: ['I do not feel sad.', 'I feel sad much of the time.', 'I am sad all the time.', 'I am so sad or unhappy that I can’t stand it.'] },
  { question: 'Pessimism', options: ['I am not discouraged about my future.', 'I feel more discouraged about my future than I used to be.', 'I do not expect things to work out for me.', 'I feel my future is hopeless and will only get worse.'] },
  { question: 'Past Failure', options: ['I do not feel like a failure.', 'I have failed more than I should have.', 'As I look back, I see a lot of failures.', 'I feel I am a total failure as a person.'] },
  { question: 'Loss of Pleasure', options: ['I get as much pleasure as I ever did from the things I enjoy.', 'I don’t enjoy things as much as I used to.', 'I get very little pleasure from the things I used to enjoy.', 'I can’t get any pleasure from the things I used to enjoy.'] },
  { question: 'Guilty Feelings', options: ['I don’t feel particularly guilty.', 'I feel guilty over many things I have done or should have done.', 'I feel quite guilty most of the time.', 'I feel guilty all of the time.'] },
  { question: 'Punishment Feelings', options: ['I don’t feel I am being punished.', 'I feel I may be punished.', 'I expect to be punished.', 'I feel I am being punished.'] },
  { question: 'Self-Dislike', options: ['I feel the same about myself as ever.', 'I have lost confidence in myself.', 'I am disappointed in myself.', 'I dislike myself.'] },
  { question: 'Self-Criticalness', options: ['I don’t criticize or blame myself more than usual.', 'I am more critical of myself than I used to be.', 'I criticize myself for all of my faults.', 'I blame myself for everything bad that happens.'] },
  { question: 'Suicidal Thoughts or Wishes', options: ['I don’t have any thoughts of killing myself.', 'I have thoughts of killing myself, but I would not carry them out.', 'I would like to kill myself.', 'I would kill myself if I had the chance.'] },
  { question: 'Crying', options: ['I don’t cry any more than I used to.', 'I cry more than I used to.', 'I cry over every little thing.', 'I feel like crying, but I can’t.'] },
  { question: 'Agitation', options: ['I am no more restless or wound up than usual.', 'I feel more restless or wound up than usual.', 'I am so restless or agitated that it’s hard to stay still.', 'I am so restless or agitated that I have to keep moving or doing something.'] },
  { question: 'Loss of Interest', options: ['I have not lost interest in other people or activities.', 'I am less interested in other people or things than before.', 'I have lost most of my interest in other people or things.', 'It’s hard to get interested in anything.'] },
  { question: 'Indecisiveness', options: ['I make decisions about as well as ever.', 'I find it more difficult to make decisions than usual.', 'I have much greater difficulty in making decisions than I used to.', 'I have trouble making any decisions.'] },
  { question: 'Worthlessness', options: ['I do not feel I am worthless.', 'I don’t consider myself as worthwhile and useful as I used to.', 'I feel more worthless as compared to other people.', 'I feel utterly worthless.'] },
  { question: 'Loss of Energy', options: ['I have as much energy as ever.', 'I have less energy than I used to have.', 'I don’t have enough energy to do very much.', 'I don’t have enough energy to do anything.'] },
  { question: 'Changes in Sleeping Pattern', options: ['I can sleep as well as usual','I dont sleep as well as I used to.','I wake up 1-2 hours earlier than usual and find it hard to get back to sleep','I wake up several hours earlier than I used to and cannot get back to sleep.'] },
  { question: 'Irritability', options: ['I am no more irritable than usual.', 'I am more irritable than usual.', 'I am much more irritable than usual.', 'I am irritable all the time.'] },
  { question: 'Changes in Appetite', options: ['My appetite is no worse than usual.', 'My appetite is not as good as it used to be.', 'My appetite is much worse now.', 'I have no appetite at all anymore.'] },
  { question: 'Concentration Difficulty', options: ['I can concentrate as well as ever.', 'I can’t concentrate as well as usual.', 'It’s hard to keep my mind on anything for very long.', 'I find I can’t concentrate on anything.'] },
  { question: 'Tiredness or Fatigue', options: ['I am no more tired or fatigued than usual.', 'I get more tired or fatigued more easily than usual.', 'I am too tired or fatigued to do a lot of the things I used to do.', 'I am too tired or fatigued to do most of the things I used to do.'] },
  { question: 'Loss of Interest in Sex', options: ['I have not noticed any recent change in my interest in sex.', 'I am less interested in sex than I used to be.', 'I am much less interested in sex now.', 'I have lost interest in sex completely.'] }
];

const calculateScore = (responses) => {
  return responses.reduce((total, response) => {
    const score = response.answer;
    return total + (score !== undefined ? score : 0);
  }, 0);
};

const getDepressionLevel = (score) => {
  if (score > 40) return 'Extreme depression';
  if (score >= 31) return 'Severe depression';
  if (score >= 21) return 'Moderate Depression';
  if (score >= 17) return 'Borderline clinical depression';
  if (score >= 11) return 'Mild mood disturbance';
  return 'These ups and downs are considered normal';
};

const BDIQuestionnaire = () => {
  const { user, token } = useSelector((state) => state.auth);
  const userId = user.userId;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState(Array(questions.length).fill(null));
  const [result, setResult] = useState(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showStartButton, setShowStartButton] = useState(true);

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

      const response = await axios.post(`${BASE_URL}/submit-bdi`, {
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
          <h1>Beck Depression Inventory questionnaire</h1>
        <button className='start-btn' onClick={() => { setShowStartButton(false); setShowCountdown(true); }}>
          Start BDI Questionnaire
        </button>
        </div>
      ) : showCountdown ? (
        <Countdown onComplete={() => setShowCountdown(false)} />
      ) : result ? (
        <Result score={result.score} depressionLevel={result.depressionLevel} />
      ) : (
        <div className="card">
          <div className="question-container">
            <h2>{questions[currentQuestionIndex].question}</h2>
            <div className="options-container">
              {questions[currentQuestionIndex].options.map((option, idx) => (
                <button
                  key={idx}
                  className={`option-button ${responses[currentQuestionIndex]?.answer === idx ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(currentQuestionIndex, idx)}
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

export default BDIQuestionnaire;
