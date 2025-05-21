import React from "react";

const ResultsPage = ({ prediction, confidenceScores, inputData, timestamp }) => {
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Analysis Results</h1>

          {/* Main Prediction */}
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Prediction</h2>
            <p className="text-3xl font-bold text-blue-600">{prediction}</p>
          </div>

          {/* Confidence Scores */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Confidence Scores</h2>
            <div className="space-y-3">
              {Object.entries(confidenceScores).map(([label, score]) => (
                <div key={label}>
                  <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                    <span>{label}</span>
                    <span>{(score * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${score * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input Data Summary */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Input Data Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(inputData).map(([key, value]) => (
                <div key={key} className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">
                    {key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                  <div className="font-medium text-gray-900">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Timestamp */}
          <div className="text-sm text-gray-500 mb-6">
            Analysis completed at: {timestamp}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <a
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              New Analysis
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;

