/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Menu, X, Calendar, Shield, AlertTriangle, CheckCircle, TrendingUp, BarChart3, FileText, Settings, LogOut, ChevronDown, Filter, Download } from 'lucide-react';
import './styles.css';

const EnhancedFoodAnalysisApp = () => {
  const [activeTab, setActiveTab] = useState('analysis');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [notifications, setNotifications] = useState(3);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState('');
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

    // Get form data
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

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitStatus('success');
    
    // Add to recent analyses
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

  const NavigationBar = () => (
    <nav className={`navbar ${darkMode ? 'dark' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo and Brand */}
          <div className="logo-section">
            <div className="logo-brand">
              <div className="logo-icon">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="logo-text">
                <h1 className={darkMode ? 'dark' : ''}>
                  FoodGuard Pro
                </h1>
                <p className={darkMode ? 'dark' : ''}>
                  Advanced Analysis System
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="desktop-nav">
            {[
              { id: 'analysis', label: 'Analysis', icon: Search },
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'trends', label: 'Trends', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`nav-button ${activeTab === id ? 'active' : ''} ${darkMode ? 'dark' : ''}`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Right side actions */}
          <div className="nav-actions">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`action-button ${darkMode ? 'dark' : ''}`}
            >
              {darkMode ? '🌞' : '🌙'}
            </button>
            
            <div className="relative">
              <button className={`action-button ${darkMode ? 'dark' : ''}`}>
                <Bell className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                {notifications > 0 && (
                  <span className="notification-badge">
                    {notifications}
                  </span>
                )}
              </button>
            </div>

            <div className="relative">
              <button className={`action-button ${darkMode ? 'dark' : ''}`}>
                <User className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                <ChevronDown className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-button"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className={`mobile-menu ${darkMode ? 'dark' : ''}`}>
          <div className="mobile-menu-items">
            {[
              { id: 'analysis', label: 'Analysis', icon: Search },
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'trends', label: 'Trends', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setIsMobileMenuOpen(false);
                }}
                className={`mobile-nav-button ${activeTab === id ? 'active' : ''} ${darkMode ? 'dark' : ''}`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );

  const AnalysisForm = () => (
    <div className="content-container">
      {/* Header */}
      <div className="header-section">
        <div className="header-icon">
          <Search className="w-8 h-8 text-white" />
        </div>
        <h1 className={`header-title ${darkMode ? 'dark' : ''}`}>
          Food Adulterant Analysis
        </h1>
        <p className={`header-subtitle ${darkMode ? 'dark' : ''}`}></p>
      </div>

      {/* Analysis Form */}
      <form onSubmit={handleSubmit} className="analysis-form">
        <input id="product_name" type="text" placeholder="Product Name" required />
        <input id="brand" type="text" placeholder="Brand" />
        <input id="adulterant" type="text" placeholder="Adulterant Detected" required />
        <input id="detection_date" type="date" required />
        <input id="category" type="text" placeholder="Category" />
        <input id="detection_method" type="text" placeholder="Detection Method" />
        <select id="severity" required>
          <option value="">Select Severity</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
        <input id="action_taken" type="text" placeholder="Action Taken" />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Analysis'}
        </button>

        {submitStatus === 'success' && (
          <div className="submit-success">
            ✅ Analysis submitted successfully!
          </div>
        )}
      </form>
    </div>
  );

  const RecentAnalysisList = () => (
    <div className="recent-analysis">
      <h2 className={darkMode ? 'dark' : ''}>Recent Analyses</h2>
      <ul>
        {recentAnalyses.map(({ id, product, severity, date, status }) => (
          <li key={id} className="analysis-item">
            <span className="product-name">{product}</span>
            <span className={getSeverityBadgeClass(severity)}>{severity}</span>
            <span className="analysis-date">{date}</span>
            <span className={getStatusBadgeClass(status)}>{status}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      <NavigationBar />
      {activeTab === 'analysis' && <AnalysisForm />}
      {activeTab === 'dashboard' && <RecentAnalysisList />}
      {/* You can expand with reports/trends tabs too */}
    </div>
  );
};

export default EnhancedFoodAnalysisApp;
