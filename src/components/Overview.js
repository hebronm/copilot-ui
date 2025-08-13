import React from 'react';
import '../CSS_Files/Overview.css';

function Overview({ client }) {
  //stop crashing if no client
  if (!client) return <p>Client data not available.</p>;

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    age,
    occupation,
    address,
    totalSavings,
    rothIRABalance,
    traditionalIRABalance,
    totalDebt,
    annualIncome,
    annualSalaryGrowth,
    monthlyContribution,
    desiredAnnualRetirementIncome,
    targetRetirementAge,
    financialGoals,
  } = client;

  //Calc Total Asset
  //This obviously needs updating in later updates, this is just a temporary case for now
  const totalAssets =
    (totalSavings || 0) +
    (rothIRABalance || 0) +
    (traditionalIRABalance || 0) -
    (totalDebt || 0);

  //Get Annual Income (take first value if array)
  //Maybe update this to show income of the current year
  const income = Array.isArray(annualIncome) ? annualIncome[0] : annualIncome;

  //Figure Tax Brack using 2024 U.S. Federal single filer brackets
  //Need to update later with married/single/HOH tax options
  const calculateTaxBracket = (income) => {
    if (income <= 11600) return '10%';
    if (income <= 47150) return '12%';
    if (income <= 100525) return '22%';
    if (income <= 191950) return '24%';
    if (income <= 243725) return '32%';
    if (income <= 609350) return '35%';
    return '37%';
  };
  const taxBracket = calculateTaxBracket(income);

  //personalInfo constructor
  const personalInfo = {
    fullName: `${firstName || ''} ${lastName || ''}`.trim(),
    email: email || 'N/A',
    phone: phoneNumber || 'N/A',
    age: age || 'N/A',
    occupation: occupation || 'N/A',
    address: address || 'N/A',
  };

  //financialSummary constructor
  const financialSummary = {
    netWorth: `$${totalAssets.toLocaleString()}`,
    annualSalaryGrowth: (annualSalaryGrowth ?? 0) + '%',
    rothIRA: `$${(rothIRABalance || 0).toLocaleString()}`,
    traditionalIRA: `$${(traditionalIRABalance || 0).toLocaleString()}`,
    monthlyContribution: `$${(Array.isArray(monthlyContribution)
      ? monthlyContribution[0]
      : monthlyContribution || 0
    ).toLocaleString()}`,
    retirementIncomeGoal: `$${(desiredAnnualRetirementIncome || 0).toLocaleString()}/year`,
  };


  return (
    <div className="overview-container">
      {/* Top Stats */}
      <div className="overview-top-stats">
        <div className="stat-box">
          <h3>Total Assets</h3>
          <p>${totalAssets.toLocaleString()}</p>
        </div>
        <div className="stat-box">
          <h3>Annual Income</h3>
          <p>${income.toLocaleString()}</p>
        </div>
        <div className="stat-box">
          <h3>Tax Bracket</h3>
          <p>{taxBracket}</p>
        </div>
        <div className="stat-box">
          <h3>Target Retirement Age</h3>
          <p>{targetRetirementAge || 'N/A'}</p>
        </div>
      </div>

      {/* Financial Goal */}
      <div className="goal-box">
        <h3>Financial Goal</h3>
        <p>{financialGoals || 'N/A'}</p>
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
