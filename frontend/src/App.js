import React, { useState, useEffect } from 'react';
import NavigationBar from './pages/NavigationBar';
import AnalysisForm from './pages/AnalysisForm';
import RecentAnalysisList from './pages/RecentAnalysisList';
import LandingPage from './pages/LandingPage';
import './App.css';

const App = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('analysis');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [notifications, setNotifications] = useState(3);
  const [darkMode, setDarkMode] = useState(false);
  const [recentAnalyses, setRecentAnalyses] = useState([
    { id: 1, product: 'Milk Sample A', severity: 'Medium', date: '2024-01-15', status: 'Completed' },
    { id: 2, product: 'Spice Mix B', severity: 'High', date: '2024-01-14', status: 'In Progress' },
    { id: 3, product: 'Cooking Oil C', severity: 'Low', date: '2024-01-13', status: 'Completed' }
  ]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById("detection_date");
    if (dateInput) dateInput.value = today;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    const formData = {
      product_name: document.getElementById('product_name').value,
      brand: document.getElementById('brand').value,
      adulterant: document.getElementById('adulterant').value,
      detection_date: document.getElementById('detection_date').value,
      category: document.getElementById('category').value,
      detection_method: document.getElementById('detection_method').value,
      severity: document.getElementById('severity').value,
      action_taken: document.getElementById('action_taken').value
    };

    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setSubmitStatus('success');

    const newAnalysis = {
      id: Date.now(),
      product: formData.product_name,
      severity: formData.severity,
      date: formData.detection_date,
      status: 'Completed'
    };
    setRecentAnalyses(prev => [newAnalysis, ...prev.slice(0, 4)]);
    setTimeout(() => setSubmitStatus(''), 3000);
  };

  const getSeverityBadgeClass = (severity) => {
    switch(severity) {
      case 'Low': return 'badge badge-low';
      case 'Medium': return 'badge badge-medium';
      case 'High': return 'badge badge-high';
      case 'Critical': return 'badge badge-critical';
      default: return 'badge';
    }
  };

  const getStatusBadgeClass = (status) => {
    return status === 'Completed' ? 'badge badge-completed' : 'badge badge-progress';
  };

  if (showLanding) {
    return <LandingPage onStart={() => setShowLanding(false)} />;
  }

  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      <NavigationBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        notifications={notifications}
      />

      {activeTab === 'analysis' && (
        <AnalysisForm
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitStatus={submitStatus}
        />
      )}

      {activeTab === 'dashboard' && (
        <RecentAnalysisList
          recentAnalyses={recentAnalyses}
          getSeverityBadgeClass={getSeverityBadgeClass}
          getStatusBadgeClass={getStatusBadgeClass}
        />
      )}
    </div>
  );
};

export default App;
