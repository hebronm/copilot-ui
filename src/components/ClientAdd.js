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

  const validateFields = () => {
    //Flatten all values from both personal & finance sections
    const allValues = [
        ...Object.values(formData.personal),
        ...Object.values(formData.financial),
        ...Object.values(formData.retirement),
    ];

    //if any value empty or just whitespace, return false
    return allValues.every(value => value.trim() !== '');
  };

  //Parses input like "100,200,300" into [100, 200, 300]
  const parseInputArray = (input) => {
    return input
      .toString()
      .split(',')
      .map(item => parseFloat(item.trim()))
      .filter(item => !isNaN(item));
  };

  const [inputErrors, setInputErrors] = useState({
    annualIncome: '',
    monthlyContribution: ''
  });

  //For Phone number formatting as (123) 456-7890
  const formatPhoneNumber = (value) => {
    if (!value) return '';
    const digits = value.replace(/\D/g, '').substring(0, 10); //limit 10 nums
    const len = digits.length;

    if (len < 4) return `(${digits}`;
    if (len < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  
  const handleSave = () => {
    
    //validation check before saving
    if (!validateFields()) {
      alert("Could not save client! There are empty fields.");
      return;
    }

    console.log("Client data fields pass empty validation: ", formData);

    //Check for annual income and monthly contribution
    /**
     * basically, at start of string,
     * first number (\d+ optionally followed by .\d+)
     * then optionally any # of comma-seperated nums w/ the same pattern
     * */
    const validPattern = /^(?:\d+(\.\d+)?)(?:,(?:\d+(\.\d+)?))*$/;

    let errors = {};
    if (!validPattern.test(formData.financial.annualIncome)) {
      errors.annualIncome = 'Format invalid: ensure no trailing commas or decimals';
    }
    if (!validPattern.test(formData.financial.monthlyContribution)) {
      errors.monthlyContribution = 'Format invalid: ensure no trailing commas or decimals';
    }

    if (Object.keys(errors).length > 0) {
      setInputErrors(errors);
      return;
    }

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
                    placeholder='John'
                />
            </div>

            <div className="form-group">
                <label className='form-label'>Last Name</label>
                <input
                    type="text"
                    className='form-input'
                    value={formData.personal.lastName}
                    onChange={(e) => handleChange('personal', 'lastName', e.target.value)}
                    placeholder='Doe'
                />
            </div>

            <div className="form-group">
                <label className='form-label'>Email</label>
                <input
                    type="email"
                    className='form-input'
                    value={formData.personal.email}
                    onChange={(e) => handleChange('personal', 'email', e.target.value)}
                    placeholder='JohnDoe123@mail.com'
                />
            </div>

            <div className="form-group">
                <label className='form-label'>Phone Number</label>
                <input
                    type="tel"
                    className='form-input'
                    value={formatPhoneNumber(formData.personal.phoneNumber)}
                    onChange={(e) => {
                      //keep only digits in submit state
                      const numericValue = e.target.value.replace(/\D/g, '');
                      handleChange('personal', 'phoneNumber', numericValue);
                    }}
                    placeholder='(123) 456-7890'
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
                    handleChange('personal', 'occupation', e.target.value)}
                    placeholder='Accountant'
                />
            </div>

            {/*Full-width address field */}
            <div className="full-width">
                <label className='form-label'>Address</label>
                <input
                    type="text"
                    className='form-input'
                    value={formData.personal.address}
                    onChange={(e) => handleChange('personal', 'address', e.target.value)}
                    maxLength={80}
                    placeholder='123 Main St, Los Angeles, CA 12345'
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
                onChange={(e) => {
                  //allow only nums, commas, and decimals
                  const filteredValue = e.target.value.replace(/[^0-9.,]/g, '');
                  handleChange('financial', 'annualIncome', filteredValue);
                }}
                placeholder='One value or comma-seperated values'
            />
            {inputErrors.annualIncome && <small style={{color:'red'}}>{inputErrors.annualIncome}</small>}
            </div>

            <div className="form-group">
            <label className='form-label'>Monthly Contribution</label>
            <input
                type="text"
                className='form-input'
                value={formData.financial.monthlyContribution}
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/[^0-9.,]/g, '');
                  handleChange('financial', 'monthlyContribution', filteredValue);
                }}
                placeholder='One value or comma-seperated values'
            />
            {inputErrors.monthlyContribution && <small style={{color:'red'}}>{inputErrors.monthlyContribution}</small>}
            </div>

            <div className="form-group">
            <label className='form-label'>Annual Salary Growth</label>
            <input
                type="text"
                className='form-input'
                value={formData.financial.annualSalaryGrowth}
                onChange={(e) => {
                  let val = e.target.value;

                  //remove disallowed characters
                  val = val.replace(/[^0-9.]/g, '');

                  //prevents more than 1 decimal
                  const parts = val.split('.');
                  if (parts.length > 2) {
                    val = parts[0] + '.' + parts[1];
                  }

                  //auto add ".0" if input is whole number
                  if (val && !val.includes('.')) {
                    val = val + '.0';
                  }
                  handleChange('financial', 'annualSalaryGrowth', val)}}
                placeholder='Ex: 3.3'
            />
            <small>Input value as a percentage (%)</small>
            </div>

            <div className='form-group'>
                <div className="inline-double">
                    <div className='half-field'>
                        <label className='form-label'>Total Savings</label>
                        <div className='input-with-prefix'>
                          <span className='dollarSign-prefix'>$</span>
                          <input
                              type="text"
                              className='form-input'
                              value={formData.financial.totalSavings.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                              onChange={(e) => {
                                //remove non-digit chars
                                const numericValue = e.target.value.replace(/\D/g, '');
                                //keep the raw numbers w/o commas
                                handleChange('financial', 'totalSavings', numericValue)
                              }}
                              placeholder='Ex: 200000'
                          />
                        </div>
                    </div>

                    <div className='half-field'>
                        <label className='form-label'>Total Debt</label>
                        <div className='input-with-prefix'>
                          <span className='dollarSign-prefix'>$</span>
                          <input
                              type="text"
                              className='form-input'
                              value={formData.financial.totalDebt.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                              onChange={(e) => {
                                const numericValue = e.target.value.replace(/\D/g, '');
                                handleChange('financial', 'totalDebt', numericValue)
                              }}
                              placeholder='Ex: 1000'
                          />
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-group full-width">
                <label className='form-label'> Financial Goals</label>
                <textarea
                    className='form-input textarea-resizable'
                    value={formData.financial.financialGoal}
                    onChange={(e) =>
                    handleChange('financial', 'financialGoal', e.target.value.slice(0, 500)) //force 500 char limit
                    }
                  maxLength={500}
                  placeholder='Retirement at 65, college funds for children, etc'
                />
                <small>{formData.financial.financialGoal.length}/500 characters</small>
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
                onChange={(e) => {
                  //allow only digits
                  const numericValue = e.target.value.replace(/\D/g, '');
                  handleChange('retirement', 'targetAge', numericValue);
                }}
                placeholder='Ex: 65'
            />
            </div>

            <div className="form-group">
              <label className='form-label'>Desired Annual Retirement Income</label>
              <div className='input-with-prefix'>
                <span className='dollarSign-prefix'>$</span>
                <input
                    type="text"
                    className='form-input'
                    value={formData.retirement.desiredIncome.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    onChange={(e) => {
                      //delet non-digit chars
                      const numericValue = e.target.value.replace(/\D/g, '');
                      handleChange('retirement', 'desiredIncome', numericValue);
                    }}
                    placeholder='Ex: 50000'
                />
              </div>
              <small>Ensure input is annual, not monthly</small>
            </div>

            <div className="form-group">
              <label className='form-label'>Roth IRA Balance</label>
              <div className='input-with-prefix'>
                <span className='dollarSign-prefix'>$</span>
                <input
                    type="text"
                    className='form-input'
                    value={formData.retirement.rothBalance.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, '');
                      handleChange('retirement', 'rothBalance', numericValue);
                    }}
                    placeholder='Ex: 2000'
                />
              </div>
            </div>

            <div className="form-group">
              <label className='form-label'>Traditional IRA Balance</label>
              <div className='input-with-prefix'>
                <span className='dollarSign-prefix'>$</span>
                <input
                    type="text"
                    className='form-input'
                    value={formData.retirement.traditionalBalance.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, '');
                      handleChange('retirement', 'traditionalBalance', numericValue);
                    }}
                    placeholder='Ex: 2000'
                />
              </div>
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
