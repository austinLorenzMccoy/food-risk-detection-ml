/* eslint-disable */
import React from "react";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ResultsPage from './ResultsPage';
import ErrorPage from './ErrorPage';
import './index.css'; // Make sure to import your CSS file

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
    
    return (
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
                    <form onSubmit={handleSubmit}>
                        {/* Basic Information Grid */}
                        <div className="form-grid">
                            {[
                                { id: 'product_name', label: 'Product Name', type: 'text', emoji: '🥛' },
                                { id: 'brand', label: 'Brand', type: 'text', emoji: '🏷️' },
                                { id: 'adulterant', label: 'Adulterant', type: 'text', emoji: '⚠️' },
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
                                    <option value="Spices">🌶️ Spices</option>
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
                                    <option value="Visual Inspection">👁️ Visual Inspection</option>
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
                                    <option value="Warning Issued">⚠️ Warning Issued</option>
                                    <option value="Further Testing">🔍 Further Testing</option>
                                    <option value="No Action Required">✅ No Action Required</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="submit-btn">
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
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PredictionForm;
