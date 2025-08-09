import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../CSS_Files/ClientDetail.css';

import Overview from './Overview'

function ClientDetail() {
  const { id } = useParams();

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
  };

  /* 
  This is what it is supposed to be but using dummy 1 as ex for now
  =================================================================

  const client = dummyClient[id];
  */

  const client = dummyClient[1];

  // Tab management
  const tabs = ['Overview', 'Calculators', 'Investments', 'Retirement'];
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    // Later: Fetch client data from API using ID
  }, [id]);

/* Do some backend API call like this later on
useEffect(() => {
  fetch(`/api/clients/${id}`)
    .then(res => res.json())
    .then(data => setClient(data));
}, [id]);
 */


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
        
        {activeTab !== 'Overview' && (
          <p>{activeTab} content goes here (placeholder)</p>
        )}
      </div>
    </div>
  )










}

export default ClientDetail