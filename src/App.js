import React from 'react';
import './App.css';
import ApplicantContainer from '../src/components/applicants/ApplicantContainer';

function App() {
  return (
    <div className="flex-container">
      <h1 className="app-title">Exam Generator</h1>
      <small className="app-description">send auto-emailing of exams to applicants</small>
      <ApplicantContainer />
    </div>
  );
}

export default App;
