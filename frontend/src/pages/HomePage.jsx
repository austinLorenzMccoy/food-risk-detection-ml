/* eslint-disable */
import React from "react";
import { useEffect } from "react";

const NavigationBar = () => {
    return (
        <nav style={{
            backgroundColor: '#1f2937',
            padding: '1rem 0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 1rem'
            }}>
                {/* Logo/Brand */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <span style={{ fontSize: '2rem' }}>🔬</span>
                    <div>
                        <h1 style={{
                            color: 'white',
                            margin: 0,
                            fontSize: '1.5rem',
                            fontWeight: 'bold'
                        }}>
                            FoodGuard
                        </h1>
                        <p style={{
                            color: '#9ca3af',
                            margin: 0,
                            fontSize: '0.8rem'
                        }}>
                            Adulterant Detection System
                        </p>
                    </div>
                </div>

                {/* Navigation Links */}
                <ul style={{
                    display: 'flex',
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    gap: '2rem',
                    alignItems: 'center'
                }}>
                    <li>
                        <a href="#home" style={{
                            color: '#e5e7eb',
                            textDecoration: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#374151';
                            e.target.style.color = '#ffffff';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#e5e7eb';
                        }}>
                            🏠 Home
                        </a>
                    </li>
                    <li>
                        <a href="#analysis" style={{
                            color: '#e5e7eb',
                            textDecoration: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#374151';
                            e.target.style.color = '#ffffff';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#e5e7eb';
                        }}>
                            📊 Analysis
                        </a>
                    </li>
                    <li>
                        <a href="#results" style={{
                            color: '#e5e7eb',
                            textDecoration: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#374151';
                            e.target.style.color = '#ffffff';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#e5e7eb';
                        }}>
                            📋 Results
                        </a>
                    </li>
                    <li>
                        <a href="#reports" style={{
                            color: '#e5e7eb',
                            textDecoration: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#374151';
                            e.target.style.color = '#ffffff';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#e5e7eb';
                        }}>
                            📈 Reports
                        </a>
                    </li>
                    <li>
                        <a href="#settings" style={{
                            color: '#e5e7eb',
                            textDecoration: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#374151';
                            e.target.style.color = '#ffffff';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#e5e7eb';
                        }}>
                            ⚙️ Settings
                        </a>
                    </li>
                </ul>

                {/* User Actions */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <button style={{
                        backgroundColor: '#059669',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#047857'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#059669'}>
                        🔍 Quick Test
                    </button>
                    <div style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        backgroundColor: '#6366f1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1rem',
                        cursor: 'pointer'
                    }}>
                        👤
                    </div>
                </div>
            </div>
        </nav>
    );
};

const PredictionForm = () => {
    useEffect(() => {
        // Set default date to current day
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById("detection_date");
        if (dateInput) dateInput.value = today;
    }, []);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add loading state
        const submitBtn = e.target.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.classList.add('loading');
            
            // Simulate form submission
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.classList.add('success');
                alert('Form Submitted Successfully');
                
                // Remove success class after animation
                setTimeout(() => {
                    submitBtn.classList.remove('success');
                }, 600);
            }, 2000);
        }
    };
    
    return (
        <div>
            {/* Navigation Bar */}
            <NavigationBar />
            
            <div className="form-container">
                {/* Header Section */}
                <div className="form-header">
                    <div className="form-icon">
                        🔬
                    </div>
                    <h1 className="form-title">Food Adulterant Analysis</h1>
                    <p className="form-subtitle">
                        Advanced detection and analysis system for food safety compliance
                    </p>
                </div>
                
                {/* Main Form Card */}
                <div className="form-card">
                    <div className="card-header">
                        <h2>Sample Analysis Form</h2>
                        <p>Please fill in all required information</p>
                    </div>
                    
                    <div className="form-content">
                        <div>
                            {/* Basic Information Grid */}
                            <div className="form-grid">
                                {[
                                    { id: 'product_name', label: 'Product Name', type: 'text', emoji: '🥛' },
                                    { id: 'brand', label: 'Brand', type: 'text', emoji: '🏷' },
                                    { id: 'adulterant', label: 'Adulterant', type: 'text', emoji: '⚠' },
                                    { id: 'detection_date', label: 'Detection Date', type: 'date', emoji: '📅' }
                                ].map(({ id, label, type, emoji }) => (
                                    <div key={id} className="form-group">
                                        <label htmlFor={id} className="form-label">
                                            <span className="emoji">{emoji}</span>
                                            {label}
                                        </label>
                                        <input 
                                            type={type} 
                                            id={id} 
                                            name={id} 
                                            required 
                                            className="form-input"
                                            placeholder={`Enter ${label.toLowerCase()}...`}
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            {/* Category and Detection Method Grid */}
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="category" className="form-label">
                                        <span className="emoji">🏪</span>
                                        Category
                                    </label>
                                    <select id="category" name="category" required className="form-select">
                                        <option value="">Select a category</option>
                                        <option value="Dairy">🥛 Dairy</option>
                                        <option value="Meat">🥩 Meat</option>
                                        <option value="Spices">🌶 Spices</option>
                                        <option value="Beverages">🧃 Beverages</option>
                                        <option value="Oils">🫒 Oils</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="detection_method" className="form-label">
                                        <span className="emoji">🔬</span>
                                        Detection Method
                                    </label>
                                    <select id="detection_method" name="detection_method" required className="form-select">
                                        <option value="">Select a method</option>
                                        <option value="Chemical Analysis">🧪 Chemical Analysis</option>
                                        <option value="Spectroscopy">📊 Spectroscopy</option>
                                        <option value="Chromatography">📈 Chromatography</option>
                                        <option value="Visual Inspection">👁 Visual Inspection</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* Severity and Action Grid */}
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="severity" className="form-label">
                                        <span className="emoji">⚡</span>
                                        Severity Level
                                    </label>
                                    <select id="severity" name="severity" required className="form-select">
                                        <option value="">Select severity level</option>
                                        <option value="Low">🟢 Low</option>
                                        <option value="Medium">🟡 Medium</option>
                                        <option value="High">🟠 High</option>
                                        <option value="Critical">🔴 Critical</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="action_taken" className="form-label">
                                        <span className="emoji">🎯</span>
                                        Action Taken
                                    </label>
                                    <select id="action_taken" name="action_taken" required className="form-select">
                                        <option value="">Select action</option>
                                        <option value="Product Recall">🚨 Product Recall</option>
                                        <option value="Warning Issued">⚠ Warning Issued</option>
                                        <option value="Further Testing">🔍 Further Testing</option>
                                        <option value="No Action Required">✅ No Action Required</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* Submit Button */}
                            <button type="submit" className="submit-btn" onClick={handleSubmit}>
                                <div className="btn-content">
                                    <span className="btn-icon">✨</span>
                                    Analyze Sample
                                </div>
                            </button>
                            
                            {/* Footer */}
                            <div className="form-footer">
                                <p className="footer-text">
                                    🔒 All data is processed securely and in compliance with food safety regulations
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictionForm;
