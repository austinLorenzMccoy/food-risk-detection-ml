import React from 'react';
import { Search } from 'lucide-react';

const AnalysisForm = ({ handleSubmit, isSubmitting, submitStatus }) => (
  <div className="content-container">
    <div className="header-section">
      <div className="header-icon">
        <Search className="w-6 h-6 text-white" />
      </div>
      <h1 className="header-title">Food Adulterant Analysis</h1>
    </div>

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
    // eslint-disable-next-line jsx-all/accessible-emoji
        <div className="submit-success">✅ Analysis submitted successfully!</div>
      )}
    </form>
  </div>
);

export default AnalysisForm;
