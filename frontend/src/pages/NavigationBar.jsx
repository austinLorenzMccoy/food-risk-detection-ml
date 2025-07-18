import React from 'react';
import { Shield, Search, BarChart3, FileText, TrendingUp, Bell, User, ChevronDown } from 'lucide-react';

const NavigationBar = ({ activeTab, setActiveTab, darkMode, setDarkMode, notifications }) => (
  <nav className={`navbar ${darkMode ? 'dark' : ''}`}>
    <div className="navbar-container">
      {/* Logo Section */}
      <div className="logo-section">
        <div className="logo-icon">
          <Shield className="w-6 h-6 text-blue-600" />
        </div>
        <div className="logo-text">
          <h1>FoodGuard Pro</h1>
          <p>Advanced Analysis System</p>
        </div>
      </div>

      {/* Navigation Tabs */}
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
            className={`nav-button ${activeTab === id ? 'active' : ''}`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="nav-actions">
        <button onClick={() => setDarkMode(!darkMode)} className="action-button">
          {darkMode ? '🌞' : '🌙'}
        </button>

        <div className="relative">
          <button className="action-button">
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="notification-badge">{notifications}</span>
            )}
          </button>
        </div>

        <div className="relative">
          <button className="action-button">
            <User className="w-5 h-5" />
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </nav>
);

export default NavigationBar;
