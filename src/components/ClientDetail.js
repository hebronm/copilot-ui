import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../CSS_Files/ClientDetail.css';

import Overview from './Overview'
import IRACalculator from './IRACalculator'
import DataAnalysis from './DataAnalysis'

function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState(null);

  /*
  // Dummy client data (replace with backend fetch later)
  const dummyClient = {
    1: {
        name: 'John Doe',
        age: 45,
        assets: '$' + 500000,
        overview: 'John is a long-term investor with a diversified portfolio.',
        totalAssets: '$500,000',
        annualIncome: '$120,000',
        taxBracket: '24%',
        targetRetirementAge: 65,
        financialGoal: 'Retire comfortably by age 65 while maintaining current lifestyle.',
        personalInfo: {
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            phone: '123-456-7890',
            age: 45,
            occupation: 'Software Engineer',
            address: '123 Main Street, Anytown, USA',
        },
        financialSummary: {
            netWorth: '$850,000',
            annualSalaryGrowth: '3%',
            rothIRA: '$150,000',
            traditionalIRA: '$200,000',
            monthlyContribution: '$1,000',
            retirementIncomeGoal: '$80,000/year',
        },
      
    },
    2: {
      name: 'Jane Smith',
      age: 37,
      assets: '$750,000',
      overview: 'Jane focuses on sustainable and ESG investing strategies.',
    },
  };*/


  // Tab management
  const tabs = ['Overview', 'Calculators', 'Investments', 'Retirement'];
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeCalculatorTab, setActiveCalculatorTab] = useState('Simple'); // Track sub-tabs for Calculators

  useEffect(() => {
    fetch(`http://34.217.130.235:8080/clients/${id}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
        }
      }
    )
      .then(res => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then(data => setClient(data))
      .catch(err => console.error("Error fetching client data:", err));
  }, [id]);

  if (!client) {
    return <p>Loading client details...</p>;
  }


  return (
    <div className="client-detail">
      {/* Header Section */}
      <div className="client-header">
        <h1>Client Details</h1>
        <p>
          Comprehensive view of client information and financial planning tools.
        </p>
      </div>

      {/* Navigation Tabs */}
      <nav className="client-nav">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'Overview' && <Overview client={client} />}

        {activeTab === 'Calculators' && (
          <>
            {/* Sub-tabs only visible in Calculators tab */}
            <nav className="calculator-sub-nav">
              <button
                className={`sub-nav-tab ${activeCalculatorTab === 'Simple' ? 'active' : ''}`}
                onClick={() => setActiveCalculatorTab('Simple')}
              >
                Simple
              </button>
              <button
                className={`sub-nav-tab ${activeCalculatorTab === 'Analysis' ? 'active' : ''}`}
                onClick={() => setActiveCalculatorTab('Analysis')}
              >
                Analysis
              </button>
            </nav>

            {/* Content based on active sub-tab */}
            {activeCalculatorTab === 'Simple' && <IRACalculator client={client} />}
            {activeCalculatorTab === 'Analysis' && <DataAnalysis client={client} />}
          </>
        )}
        
        {activeTab !== 'Overview' && activeTab !== 'Calculators' && (
          <p>{activeTab} content will eventually be here. Stay up to date with us!</p>
        )}
      </div>
    </div>
  )




}

export default ClientDetail