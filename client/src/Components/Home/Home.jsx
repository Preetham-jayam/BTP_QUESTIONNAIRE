import React from 'react';
import { useSelector } from 'react-redux';
import './Home.css';
import main from '../Assets/main.webp'

const Home = () => {
    const auth = useSelector((state) => state.auth);

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome to the Health Questionnaire App</h1>
                {auth.token ? (
                    <p>Welcome back, {auth.user.user.name}!</p>
                ) : (
                    <p>Please log in to access your questionnaires and more features.</p>
                )}
            </header>
            <main className="home-main">
                {auth.token ? (
                    <div className="logged-in-content">
                        <h2>Your Health Dashboard</h2>
                        <img src={main} alt="Health Dashboard" className="dashboard-image" />
                        <p>Access and manage your health questionnaires here.</p>
                    </div>
                ) : (
                    <div className="logged-out-content">
                        <img src={main} alt="Health Questionnaire" className="questionnaire-image" />
                        <p>This app helps you monitor your health through various questionnaires. Register or log in to get started.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
