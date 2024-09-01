import React from 'react';
import './Result.css';

const Result = () => {
    const score=10;
    const depressionLevel='Moderate Depression';
  const recommendations = {
    'Severe Depression': {
      message: "It's important to seek professional help. Consider contacting a mental health professional.",
      links: [
        { text: 'Mental Health Resources', url: 'https://www.mentalhealth.gov/' },
        { text: 'Crisis Helpline', url: 'https://www.crisistextline.org/' }
      ],
      animationClass: 'severe-animation'
    },
    'Moderately Severe Depression': {
      message: 'Consider speaking to a counselor or therapist. Here are some helpful resources.',
      links: [
        { text: 'Find a Therapist', url: 'https://www.psychologytoday.com/us/therapists' },
        { text: 'Guided Meditation', url: 'https://www.headspace.com/meditation/guided-meditation' }
      ],
      animationClass: 'moderate-severe-animation'
    },
    'Moderate Depression': {
      message: 'Engaging in regular exercise and mindfulness practices can be beneficial.',
      links: [
        { text: 'Yoga for Mental Health', url: 'https://www.webmd.com/depression/yoga-for-depression-and-anxiety' },
        { text: 'Mindfulness Exercises', url: 'https://www.mindful.org/mindfulness-how-to-do-it/' }
      ],
      animationClass: 'moderate-animation'
    },
    'Mild Depression': {
      message: 'Consider incorporating light exercises and relaxation techniques into your routine.',
      links: [
        { text: 'Simple Yoga Routines', url: 'https://artoflivingretreatcenter.org/blog/7-easy-yoga-poses-for-depression-and-anxiety/' },
        { text: 'Basic Meditation Guide', url: 'https://www.mindful.org/how-to-meditate/' }
      ],
      animationClass: 'mild-animation'
    },
    'Minimal or No Depression': {
      message: 'You seem to be in good mental health. Keep up with healthy habits!',
      links: [
        { text: 'Daily Yoga Practices', url: 'https://www.yogajournal.com/practice/yoga-sequences-level/yoga-sequence-help-commit-daily-practice/' },
        { text: '10 Yoga Poses', url: 'https://www.verywellfit.com/do-these-10-yoga-poses-every-day-to-feel-great-3567179' }
      ],
      animationClass: 'minimal-animation'
    }
  };

  const { message, links, animationClass } = recommendations[depressionLevel];

  return (
    <div className={`result-card ${animationClass}`}>
      <h2>Your Score: {score}</h2>
      <p><b>Depression Level:</b> {depressionLevel}</p>
      <p>{message}</p>
      <ul>
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">{link.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Result;
