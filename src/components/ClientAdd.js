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
        <div className="form-grid">
            <div className="form-group">
                <label className='form-label'>First Name</label>
                <input
                    type="text"
                    className='form-input'
                    value={formData.personal.firstName}
                    onChange={(e) => handleChange('personal', 'firstName', e.target.value)}
                />
            </div>

            <div className="form-group">
                <label className='form-label'>Last Name</label>
                <input
                    type="text"
                    className='form-input'
                    value={formData.personal.lastName}
                    onChange={(e) => handleChange('personal', 'lastName', e.target.value)}
                />
            </div>

            <div className="form-group">
                <label className='form-label'>Email</label>
                <input
                    type="email"
                    className='form-input'
                    value={formData.personal.email}
                    onChange={(e) => handleChange('personal', 'email', e.target.value)}
                />
            </div>

            <div className="form-group">
                <label className='form-label'>Phone Number</label>
                <input
                    type="tel"
                    className='form-input'
                    value={formData.personal.phoneNumber}
                    onChange={(e) =>
                    handleChange('personal', 'phoneNumber', e.target.value)
                    }
                />
            </div>

            <div className="form-group">
                <label className='form-label'>Birthdate</label>
                <input
                    type="date"
                    className='form-input'
                    value={formData.personal.birthdate}
                    onChange={(e) => handleChange('personal', 'birthdate', e.target.value)}
                />
            </div>

            <div className="form-group">
                <label className='form-label'>Occupation</label>
                <input
                    type="text"
                    className='form-input'
                    value={formData.personal.occupation}
                    onChange={(e) =>
                    handleChange('personal', 'occupation', e.target.value)
                    }
                />
            </div>

            {/*Full-width address field */}
            <div className="form-group full-width">
                <label className='form-label'>Address</label>
                <input
                    type="text"
                    className='form-input'
                    value={formData.personal.address}
                    onChange={(e) => handleChange('personal', 'address', e.target.value)}
                />
            </div>
        </div>
    );

    const renderFinancialForm = () => (
        <div className="form-grid">
            <div className="form-group">
            <label className='form-label'>Annual Income</label>
            <input
                type="text"
                className='form-input'
                value={formData.financial.annualIncome}
                onChange={(e) =>
                handleChange('financial', 'annualIncome', e.target.value)
                }
            />
            </div>

            <div className="form-group">
            <label className='form-label'>Monthly Contribution</label>
            <input
                type="text"
                className='form-input'
                value={formData.financial.monthlyContribution}
                onChange={(e) =>
                handleChange('financial', 'monthlyContribution', e.target.value)
                }
            />
            </div>

            <div className="form-group">
            <label className='form-label'>Annual Salary Growth</label>
            <input
                type="text"
                className='form-input'
                value={formData.financial.annualSalaryGrowth}
                onChange={(e) =>
                handleChange('financial', 'annualSalaryGrowth', e.target.value)
                }
            />
            </div>

            <div className='form-group'>
                <div className="inline-double">
                    <div className='half-field'>
                        <label className='form-label'>Total Savings</label>
                        <input
                            type="text"
                            className='form-input'
                            value={formData.financial.totalSavings}
                            onChange={(e) =>
                            handleChange('financial', 'totalSavings', e.target.value)
                            }
                        />
                    </div>

                    <div className='half-field'>
                        <label className='form-label'>Total Debt</label>
                        <input
                            type="text"
                            className='form-input'
                            value={formData.financial.totalDebt}
                            onChange={(e) =>
                            handleChange('financial', 'totalDebt', e.target.value)
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="form-group full-width">
                <label className='form-label'> Financial Goals</label>
                <input
                    type="text"
                    className='form-input'
                    value={formData.financial.financialGoal}
                    onChange={(e) =>
                    handleChange('financial', 'financialGoal', e.target.value)
                    }
                />
            </div>
        </div>
    );


    const renderRetirementForm = () => (
        <div className="form-grid">
            <div className="form-group">
            <label className='form-label'>Target Retirement Age</label>
            <input
                type="text"
                className='form-input'
                value={formData.retirement.targetAge}
                onChange={(e) =>
                handleChange('retirement', 'targetAge', e.target.value)
                }
            />
            </div>

            <div className="form-group">
            <label className='form-label'>Desired Annual Retirement Income</label>
            <input
                type="text"
                className='form-input'
                value={formData.retirement.desiredIncome}
                onChange={(e) =>
                handleChange('retirement', 'desiredIncome', e.target.value)
                }
            />
            </div>

            <div className="form-group">
            <label className='form-label'>Roth IRA Balance</label>
            <input
                type="text"
                className='form-input'
                value={formData.retirement.rothBalance}
                onChange={(e) =>
                handleChange('retirement', 'rothBalance', e.target.value)
                }
            />
            </div>

            <div className="form-group">
            <label className='form-label'>Traditional IRA Balance</label>
            <input
                type="text"
                className='form-input'
                value={formData.retirement.traditionalBalance}
                onChange={(e) =>
                handleChange('retirement', 'traditionalBalance', e.target.value)
                }
            />
            </div>
        </div>
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

      <div className="form-wrapper">
      {/* Tabs */}
      <nav className="client-add-nav">
        {TABS.map((tab) => (
            <button
            key={tab}
            className={`client-add-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            >
            {tab}
            </button>
        ))}
      </nav>

      {/* Form section */}
      <div className="form-section">
        {renderForm()}
      </div>

      {/* Action buttons */}
      <div className="form-actions">
        <button className="cancel-button" onClick={() => navigate('/')}>
          Cancel
        </button>
        <button className="save-button" onClick={handleSave}>
          Save Client
        </button>
      </div>
    </div>
  </div>
);
};

export default ClientAdd;
