import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  LineChart, Line, Legend
} from 'recharts';
import './Profile.css';

const getDepressionLevel = (score) => {
  if (score >= 20) return 'Severe Depression';
  if (score >= 15) return 'Moderately Severe Depression';
  if (score >= 10) return 'Moderate Depression';
  if (score >= 5) return 'Mild Depression';
  return 'Minimal or No Depression';
};

const Profile = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [submissions, setSubmissions] = useState({ PHQ9: [], HADS: [], BDI: [] });

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(`http://localhost:5003/users/${user.userId}/submissions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Fetched submissions:', response.data);
        setSubmissions(response.data.submissions);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    fetchSubmissions();
  }, [user.userId, token]);

  const combineData = () => {
    const combined = [];
    const mapData = (data, label) => {
      if (data && Array.isArray(data)) {
        data.forEach(sub => {
          combined.push({
            date: new Date(sub.submittedAt).toLocaleDateString(),
            [label]: sub.score,
          });
        });
      }
    };

    mapData(submissions.PHQ9, 'PHQ9');
    mapData(submissions.HADS, 'HADS');
    mapData(submissions.BDI, 'BDI');

    return combined;
  };

  const combinedData = combineData();

  const renderBarChart = (data, title) => {
    if (!data || data.length === 0) {
      return <p>Take the test</p>; 
    }
    console.log(data);
    return (
      <div className="chart-container">
        <h2>{title}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.map(sub => ({ date: new Date(sub.submittedAt).toLocaleDateString(), score: sub.score }))}>
            <XAxis dataKey="date" tickFormatter={tick => tick} />
            <YAxis tickFormatter={tick => tick} />
            <Tooltip formatter={(value) => [`Score: ${value}`, getDepressionLevel(value)]} />
            <Bar dataKey="score">
              {data.map((entry, index) => {
                const level = getDepressionLevel(entry.score);
                let fillColor;
                switch (level) {
                  case 'Severe Depression': fillColor = '#ff0000'; break;
                  case 'Moderately Severe Depression': fillColor = '#ff7f00'; break;
                  case 'Moderate Depression': fillColor = '#ffff00'; break;
                  case 'Mild Depression': fillColor = '#7fff00'; break;
                  default: fillColor = '#00ff00';
                }
                return <Cell key={`cell-${index}`} fill={fillColor} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="profile-container">
      <div className="user-info">
        <h2>User Profile</h2>
        <p><strong>Name:</strong> {user.user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone Number:</strong> {user.user.phoneNo}</p>
        <p><strong>Age:</strong> {user.user.age}</p>
        <p><strong>Address:</strong> {user.user.address}</p>
      </div>
      {submissions.PHQ9 && renderBarChart(submissions.PHQ9, 'PHQ-9 Submissions')}
      {submissions.HADS && renderBarChart(submissions.HADS, 'HADS Submissions')}
      {submissions.BDI && renderBarChart(submissions.BDI, 'BDI Submissions')}

      <div className="chart-container">
        {(!submissions.PHQ9 && !submissions.HADS && !submissions.BDI) ? (<h2>Take the test to display results</h2>):
        (<><h2>Combined Questionnaire Scores Over Time</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={combinedData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="PHQ9" stroke="#8884d8" />
            <Line type="monotone" dataKey="HADS" stroke="#82ca9d" />
            <Line type="monotone" dataKey="BDI" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
     </>)
        }
         </div>
    </div>
  );
};

export default Profile;


