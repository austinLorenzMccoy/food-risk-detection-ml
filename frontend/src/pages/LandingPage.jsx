import React from 'react';

const LandingPage = ({ onStart }) => {
  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1>Welcome to FoodGuard Pro</h1>
        <p>Your trusted platform for food adulteration analysis and safety insights.</p>
        <button onClick={onStart}>Get Started</button>
      </div>
    </div>
  );
};

export default LandingPage;
