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
      annualIncome: '', //for "optimal analysis", need to implement comma seperated array input
      monthlyContribution: '', //as above
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

  //Parses input like "100,200,300" into [100, 200, 300]
  const parseInputArray = (input) => {
    return input
      .toString()
      .split(',')
      .map(item => parseFloat(item.trim()))
      .filter(item => !isNaN(item));
  };

  
  const handleSave = () => {
    //Construct the object to POST
    const finalClientData = {
      firstName: formData.personal.firstName,
      lastName: formData.personal.lastName,
      age: parseInt(formData.personal.age),
      birthdate: formData.personal.birthdate,
      email: formData.personal.email,
      phoneNumber: formData.personal.phoneNumber,
      address: formData.personal.address,
      occupation: formData.personal.occupation,
      annualIncome: parseInputArray(formData.financial.annualIncome), // 🔧 Array
      monthlyContribution: parseInputArray(formData.financial.monthlyContribution), // 🔧 Array
      annualSalaryGrowth: parseFloat(formData.financial.annualSalaryGrowth),
      totalSavings: parseFloat(formData.financial.totalSavings),
      totalDebt: parseFloat(formData.financial.totalDebt),
      financialGoals: formData.financial.financialGoal,
      targetRetirementAge: parseInt(formData.retirement.targetAge),
      desiredAnnualRetirementIncome: parseFloat(formData.retirement.desiredIncome),
      rothIRABalance: parseFloat(formData.retirement.rothBalance),
      traditionalIRABalance: parseFloat(formData.retirement.traditionalBalance),
      advisor: null //for now always null
    };

    console.log("Submitting client data:", finalClientData);

    fetch('http://34.217.130.235:8080/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(finalClientData)
    })
    .then(res => {
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      return res.json();
    })
    .then(data => {
      alert("Client successfully added!");
      navigate('/');
    })
    .catch(err => {
      console.error("Error submitting client:", err);
      alert("Failed to save client. Check console for details.");
    });
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
          type="text" //allows support for like "100" & "999,999"
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
