/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Menu, X, Calendar, Shield, AlertTriangle, CheckCircle, TrendingUp, BarChart3, FileText, Settings, LogOut, ChevronDown, Filter, Download } from 'lucide-react';

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
  };prev => [newAnalysis, ...prev.slice(0, 4)]);
    
    setTimeout(() => setSubmitStatus(''), 3000);
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const NavigationBar = () => (
    <nav className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b backdrop-blur-md bg-opacity-95`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  FoodGuard Pro
                </h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Advanced Analysis System
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { id: 'analysis', label: 'Analysis', icon: Search },
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'trends', label: 'Trends', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : `${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              {darkMode ? '🌞' : '🌙'}
            </button>
            
            <div className="relative">
              <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                <Bell className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>

            <div className="relative">
              <button className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                <User className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                <ChevronDown className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
          <div className="px-4 py-3 space-y-2">
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
                className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors ${
                  activeTab === id
                    ? 'bg-blue-500 text-white'
                    : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`
                }`}
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
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
          <Search className="w-8 h-8 text-white" />
        </div>
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
          Food Adulterant Analysis
        </h1>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Advanced detection and analysis system for food safety compliance
        </p>
      </div>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">Analysis submitted successfully!</span>
        </div>
      )}

      {/* Main Form */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-xl overflow-hidden`}>
        <div className={`${darkMode ? 'bg-gray-750' : 'bg-gray-50'} px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Sample Analysis Form
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Please provide detailed information about the sample
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { id: 'product_name', label: 'Product Name', type: 'text', icon: '🥛', placeholder: 'Enter product name' },
              { id: 'brand', label: 'Brand', type: 'text', icon: '🏷️', placeholder: 'Enter brand name' },
              { id: 'adulterant', label: 'Suspected Adulterant', type: 'text', icon: '⚠️', placeholder: 'Enter adulterant type' },
              { id: 'detection_date', label: 'Detection Date', type: 'date', icon: '📅', placeholder: '' }
            ].map(({ id, label, type, icon, placeholder }) => (
              <div key={id} className="space-y-2">
                <label htmlFor={id} className={`flex items-center space-x-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="text-lg">{icon}</span>
                  <span>{label}</span>
                </label>
                <input
                  type={type}
                  id={id}
                  name={id}
                  required
                  placeholder={placeholder}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200`}
                />
              </div>
            ))}
          </div>

          {/* Category and Detection Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="category" className={`flex items-center space-x-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="text-lg">🏪</span>
                <span>Product Category</span>
              </label>
              <select
                id="category"
                name="category"
                required
                className={`w-full px-4 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200`}
              >
                <option value="">Select category</option>
                <option value="Dairy">🥛 Dairy Products</option>
                <option value="Meat">🥩 Meat & Poultry</option>
                <option value="Spices">🌶️ Spices & Seasonings</option>
                <option value="Beverages">🧃 Beverages</option>
                <option value="Oils">🫒 Oils & Fats</option>
                <option value="Grains">🌾 Grains & Cereals</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="detection_method" className={`flex items-center space-x-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="text-lg">🔬</span>
                <span>Detection Method</span>
              </label>
              <select
                id="detection_method"
                name="detection_method"
                required
                className={`w-full px-4 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200`}
              >
                <option value="">Select method</option>
                <option value="Chemical Analysis">🧪 Chemical Analysis</option>
                <option value="Spectroscopy">📊 Spectroscopy</option>
                <option value="Chromatography">📈 Chromatography</option>
                <option value="Mass Spectrometry">🔬 Mass Spectrometry</option>
                <option value="Visual Inspection">👁️ Visual Inspection</option>
              </select>
            </div>
          </div>

          {/* Severity and Action */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="severity" className={`flex items-center space-x-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="text-lg">⚡</span>
                <span>Severity Level</span>
              </label>
              <select
                id="severity"
                name="severity"
                required
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200`}
              >
                <option value="">Select severity</option>
                <option value="Low">🟢 Low Risk</option>
                <option value="Medium">🟡 Medium Risk</option>
                <option value="High">🟠 High Risk</option>
                <option value="Critical">🔴 Critical Risk</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="action_taken" className={`flex items-center space-x-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="text-lg">🎯</span>
                <span>Recommended Action</span>
              </label>
              <select
                id="action_taken"
                name="action_taken"
                required
                className={`w-full px-4 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200`}
              >
                <option value="">Select action</option>
                <option value="Product Recall">🚨 Product Recall</option>
                <option value="Warning Issued">⚠️ Warning Issued</option>
                <option value="Further Testing">🔍 Further Testing Required</option>
                <option value="Monitoring">👁️ Continuous Monitoring</option>
                <option value="No Action Required">✅ No Action Required</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing Sample...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Submit for Analysis</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Analyses */}
      <div className={`mt-8 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-xl overflow-hidden`}>
        <div className={`${darkMode ? 'bg-gray-750' : 'bg-gray-50'} px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Analyses
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentAnalyses.map((analysis) => (
              <div key={analysis.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {analysis.product}
                      </h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {analysis.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(analysis.severity)}`}>
                      {analysis.severity}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      analysis.status === 'Completed' 
                        ? 'text-green-600 bg-green-100' 
                        : 'text-blue-600 bg-blue-100'
                    }`}>
                      {analysis.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Analyses', value: '1,234', change: '+12%', color: 'blue', icon: FileText },
          { title: 'High Risk Detected', value: '23', change: '-5%', color: 'red', icon: AlertTriangle },
          { title: 'Compliance Rate', value: '98.5%', change: '+2%', color: 'green', icon: CheckCircle },
          { title: 'Active Monitoring', value: '45', change: '+8%', color: 'yellow', icon: TrendingUp }
        ].map((stat, index) => (
          <div key={index} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </p>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}>
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
          Analysis Trends
        </h3>
        <div className="h-64 flex items-center justify-center">
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Chart visualization would go here
          </p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'analysis':
        return <AnalysisForm />;
      case 'dashboard':
        return <Dashboard />;
      case 'reports':
        return (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Reports Section
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Detailed reporting functionality would be implemented here
            </p>
          </div>
        );
      case 'trends':
        return (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Trends Analysis
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Trend analysis and predictive insights would be shown here
            </p>
          </div>
        );
      default:
        return <AnalysisForm />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      <NavigationBar />
      <main className="min-h-screen">
        {renderContent()}
      </main>
    </div>
  );
};

export default EnhancedFoodAnalysisApp;
