import React from 'react';
import '../CSS_Files/Overview.css';

function Overview({ client }) {
  const { 
    totalAssets, 
    annualIncome, 
    taxBracket, 
    targetRetirementAge, 
    financialGoal, 
    personalInfo, 
    financialSummary 
} = client;

  return (
    <div className="overview-container">
      {/* Top Stats */}
      <div className="overview-top-stats">
        <div className="stat-box">
          <h3>Total Assets</h3>
          <p>{totalAssets}</p>
        </div>
        <div className="stat-box">
          <h3>Annual Income</h3>
          <p>{annualIncome}</p>
        </div>
        <div className="stat-box">
          <h3>Tax Bracket</h3>
          <p>{taxBracket}</p>
        </div>
        <div className="stat-box">
          <h3>Target Retirement Age</h3>
          <p>{targetRetirementAge}</p>
        </div>
      </div>

      {/* Financial Goal */}
      <div className="goal-box">
        <h3>Financial Goal</h3>
        <p>{financialGoal}</p>
      </div>

      {/* Personal Info + Financial Summary */}
      <div className="info-summary-section">
        {/* Personal Info */}
        <div className="info-box">
          <h3>Personal Information</h3>
          <ul>
            {Object.entries(personalInfo).map(([label, value]) => (
              <li key={label}>
                <span className="label">{formatLabel(label)}:</span>
                <span className="value">{value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Financial Summary */}
        <div className="info-box">
          <h3>Financial Summary</h3>
          <ul>
            {Object.entries(financialSummary).map(([label, value]) => (
              <li key={label}>
                <span className="label">{formatLabel(label)}:</span>
                <span className="value">{value}</span >
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Helper function to format labels
function formatLabel(label) {
  return label
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
}

export default Overview;
