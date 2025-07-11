import React, { useEffect, useState } from 'react';

function FinancialRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from your API endpoint
    fetch('http://34.217.130.235:8080/financial-records')
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        
        // Safely extract records from the response
        const recordsList = json?._embedded?.financialRecordsList || [];
        setRecords(recordsList);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching financial records:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2>Financial Records</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Current Age</th>
              <th>Retirement Age</th>
              <th>Starting Balance</th>
              <th>Monthly Contribution</th>
              <th>Annual Return</th>
              <th>Current Tax Rate</th>
              <th>Retirement Tax Rate</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.firstName}</td>
                <td>{record.lastName}</td>
                <td>{record.currentAge}</td>
                <td>{record.retirementAge}</td>
                <td>${typeof record.startingBalance === 'number' ? record.startingBalance.toLocaleString() : record.startingBalance}</td>
                <td>${typeof record.monthlyContribution === 'number' ? record.monthlyContribution.toLocaleString() : record.monthlyContribution}</td>
                <td>{typeof record.annualReturn === 'number' ? record.annualReturn : record.annualReturn}%</td>
                <td>{typeof record.currentTaxRate === 'number' ? record.currentTaxRate : record.currentTaxRate}%</td>
                <td>{typeof record.retirementTaxRate === 'number' ? record.retirementTaxRate : record.retirementTaxRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FinancialRecords;