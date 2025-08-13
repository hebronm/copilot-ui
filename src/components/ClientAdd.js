import React, { useState } from 'react';
import '../CSS_Files/ClientAdd.css';
import { useNavigate } from 'react-router-dom';

const TABS = ['Personal', 'Financial', 'Retirement', 'Investment'];

const ClientAdd = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Personal');
  const [formData, setFormData] = useState({
    personal: {
      firstName: '',
      lastName: '',
      age: '',
      birthdate: '',
      email: '',
      phoneNumber: '',
      occupation: '',
      address: '',
    },
    financial: {
      annualIncome: '',
      monthlyContribution: '',
      annualSalaryGrowth: '',
      totalSavings: '',
      totalDebt: '',
      financialGoal: '',
    },
    retirement: {
      targetAge: '',
      desiredIncome: '',
      rothBalance: '',
      traditionalBalance: '',
    },
  });

  const handleChange = (tab, field, value) => {
    setFormData(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    // TODO: Replace with your actual backend call
    console.log('Submitting client data:', formData);
    alert('Client data saved (mocked)');
  };

  const renderPersonalForm = () => (
    <>
      {['firstName', 'lastName', 'age', 'birthdate', 'email', 'phoneNumber', 'occupation', 'address'].map(field => (
        <input
          key={field}
          type={field === 'birthdate' ? 'date' : 'text'}
          placeholder={field.replace(/([A-Z])/g, ' $1')}
          value={formData.personal[field]}
          onChange={e => handleChange('personal', field, e.target.value)}
        />
      ))}
    </>
  );

  const renderFinancialForm = () => (
    <>
      {['annualIncome', 'monthlyContribution', 'annualSalaryGrowth', 'totalSavings', 'totalDebt', 'financialGoal'].map(field => (
        <input
          key={field}
          type="number"
          placeholder={field.replace(/([A-Z])/g, ' $1')}
          value={formData.financial[field]}
          onChange={e => handleChange('financial', field, e.target.value)}
        />
      ))}
    </>
  );

  const renderRetirementForm = () => (
    <>
      {['targetAge', 'desiredIncome', 'rothBalance', 'traditionalBalance'].map(field => (
        <input
          key={field}
          type="number"
          placeholder={field.replace(/([A-Z])/g, ' $1')}
          value={formData.retirement[field]}
          onChange={e => handleChange('retirement', field, e.target.value)}
        />
      ))}
    </>
  );

  const renderInvestmentForm = () => (
    <p>This is a placeholder for future updates. We will keep you updated!</p>
  );

  const renderForm = () => {
    switch (activeTab) {
      case 'Personal':
        return renderPersonalForm();
      case 'Financial':
        return renderFinancialForm();
      case 'Retirement':
        return renderRetirementForm();
      case 'Investment':
        return renderInvestmentForm();
      default:
        return null;
    }
  };

  return (
    <div className="client-add-container">
      <header>
        <h1>Adding New Client</h1>
        <p>Detailing client information for better optimization</p>
      </header>

      <nav className="tab-nav">
        {TABS.map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="form-section">
        {renderForm()}
      </div>

      <div className="form-actions">
        <button className="cancel-button" onClick={() => navigate('/')}>
            Cancel
        </button>

        <button className="save-button" onClick={handleSave}>Save Client</button>
      </div>
    </div>
  );
};

export default ClientAdd;
