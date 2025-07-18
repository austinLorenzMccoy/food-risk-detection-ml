import React from 'react';

const RecentAnalysisList = ({ recentAnalyses, getSeverityBadgeClass, getStatusBadgeClass }) => (
  <div className="recent-analysis">
    <h2>Recent Analyses</h2>
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

export default RecentAnalysisList;
