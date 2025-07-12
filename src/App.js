import React, { useEffect, useState } from 'react';

function FinancialForm({ onSubmit }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');

  {/*ranges for sliders*/}
  const [ageRange, setAgeRange] = useState([18, 75]);
  const [startingBalance, setStartingBalance] = useState(0);
  const [monthlyContribution, setMonthlyContribution] = useState(583);
  const [annualReturn, setAnnualReturn] = useState(10);
  const [currentTaxRate, setCurrentTaxRate] = useState(0);
  const [retirementTaxRate, setRetirementTaxRate] = useState(41);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Data package for future backend use; need to figure out how to send to db
    const formData = {
      firstName,
      lastName,
      email,
      phone,
      birthday,
      ageRange,
      startingBalance,
      monthlyContribution,
      annualReturn,
      currentTaxRate,
      retirementTaxRate
    };
    console.log("Form Submitted:", formData);
    onSubmit(formData);
  };

  return (
    <form className="form-box" onSubmit={handleSubmit}>
      <h2 style={{ textAlign: 'center' }}>IRA Calculator Tool</h2>

      <div className="section-box">
        <h3>Basic Information</h3>
        <label>First Name:</label>
        <input type="text" placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} />

        <label>Last Name:</label>
        <input type="text" placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)} />

        <label>Email:</label>
        <input type="email" placeholder="JohnDoe@mail.com" value={email} onChange={e => setEmail(e.target.value)} />

        <label>Phone Number:</label>
        <input type="tel" placeholder="(123) 456-7890" value={phone} onChange={e => setPhone(e.target.value)} />

        <label>Birthday:</label>
        <input type="date" value={birthday} onChange={e => setBirthday(e.target.value)} />
      </div>

      {/* Financial Info Box */}
      <div className="section-box">
        <h3>Financial Information</h3>

        <label>Age Range: <b>{ageRange[0]} - {ageRange[1]}</b></label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="range"
            min="18"
            max="85"
            value={ageRange[0]}
            onChange={(e) => setAgeRange([Math.min(Number(e.target.value), ageRange[1]), ageRange[1]])}
          />
          <input
            type="range"
            min="18"
            max="85"
            value={ageRange[1]}
            onChange={(e) => setAgeRange([ageRange[0], Math.max(Number(e.target.value), ageRange[0])])}
          />
        </div>
        <small>Use both sliders to set current age and target retirement age</small>

        <br /><br />
        <label>Starting Balance: ${startingBalance.toLocaleString()}</label>
        <input
          type="range"
          min="0"
          max="100000"
          step="1000"
          value={startingBalance}
          onChange={(e) => setStartingBalance(Number(e.target.value))}
        />

        <label>Monthly Contribution: ${monthlyContribution.toLocaleString()}</label>
        <input
          type="range"
          min="0"
          max="2000"
          step="50"
          value={monthlyContribution}
          onChange={(e) => setMonthlyContribution(Number(e.target.value))}
        />

        <label>Annual Return (%): {annualReturn}%</label>
        <input
          type="range"
          min="0"
          max="15"
          step="0.5"
          value={annualReturn}
          onChange={(e) => setAnnualReturn(Number(e.target.value))}
        />

        <label>Current Tax Rate (%): {currentTaxRate}%</label>
        <input
          type="range"
          min="0"
          max="50"
          value={currentTaxRate}
          onChange={(e) => setCurrentTaxRate(Number(e.target.value))}
        />

        <label>Retirement Tax Rate (%): {retirementTaxRate}%</label>
        <input
          type="range"
          min="0"
          max="50"
          value={retirementTaxRate}
          onChange={(e) => setRetirementTaxRate(Number(e.target.value))}
        />
      </div>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button type="submit" className="submit-btn">Submit</button>
        <button type="reset" className="reset-btn">Reset</button>
      </div>
    </form>
  );
}

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = () => {
    fetch('http://34.217.130.235:8080/employees')
      .then((response) => response.json())
      .then((json) => {
        const employeeList = json?._embedded?.employeeList || [];
        setEmployees(employeeList);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const addDummyUser = () => {
    const nextId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    const dummy = {
      id: nextId,
      firstName: "Testing",
      lastName: "Code",
      role: "Debugger",
      name: "Testing Code"
    };

    fetch(`http://34.217.130.235:8080/employees/${nextId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dummy)
    }).then(fetchEmployees);
  };

  const deleteLastEntry = () => {
    if (employees.length === 0) return;
    const last = employees.reduce((prev, current) => (prev.id > current.id ? prev : current));

    fetch(`http://34.217.130.235:8080/employees/${last.id}`, {
      method: 'DELETE'
    }).then(fetchEmployees);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <FinancialForm onSubmit={(data) => console.log("Prepared for backend:", data)} />

      {/* Placeholder Graph Section */}
      <div className="section-box" style={{ marginTop: '2rem' }}>
        <h3>Estimated Account Value Graph</h3>
        <div style={{ height: '200px', background: '#f1f1f1', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <em>For later, put graph here</em>
        </div>
      </div>

      {/* Employees Table (Debugging) */}
      <div style={{ marginTop: '3rem' }}>
        <h3>Employees Table</h3>
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={addDummyUser}>Add Dummy User</button>{' '}
          <button onClick={deleteLastEntry}>Delete Last Entry</button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table border="1" cellPadding="8" cellSpacing="0" width="100%">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Role</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.firstName}</td>
                  <td>{emp.lastName}</td>
                  <td>{emp.role}</td>
                  <td>{emp.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
