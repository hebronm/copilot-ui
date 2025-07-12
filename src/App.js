/*
From my understanding, creating a new table, a new endpoint, new columns, mass add/delete rows requires direct access to backend. 
The front end can't access it unless the backend has been setup first. 
*/

import React, { useEffect, useState } from 'react';
import "./App.css";
import FinancialRecords from './FinancialRecords';

function FinancialForm() {
  {/*ranges for sliders*/}
  const [ageRange, setAgeRange] = useState([18, 75]);
  const [startingBalance, setStartingBalance] = useState(0);
  const [monthlyContribution, setMonthlyContribution] = useState(583);
  const [annualReturn, setAnnualReturn] = useState(10);
  const [currentTaxRate, setCurrentTaxRate] = useState(0);
  const [retirementTaxRate, setRetirementTaxRate] = useState(41);
  
  // Add state for basic info fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Function to collect all form data
  const getFormData = () => {
    // Collect all form data into a single object
    const formData = {
      // Basic info
      firstName,
      lastName,
      birthday,
      email,
      phone,
      
      // Financial data
      currentAge: ageRange[0],
      retirementAge: ageRange[1],
      startingBalance,
      monthlyContribution,
      annualReturn,
      currentTaxRate,
      retirementTaxRate
    };
    
    return formData;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = getFormData();
    console.log('Form data collected:', data);
    
    // Send the data to your backend
    fetch('http://34.217.130.235:8080/financial-records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to submit financial record');
        }
        return response.json();
      })
      .then(result => {
        console.log('Record submitted successfully:', result);
        alert('Financial record submitted successfully!');
        
        // Reset form fields
        setFirstName('');
        setLastName('');
        setBirthday('');
        setEmail('');
        setPhone('');
        setAgeRange([18, 75]);
        setStartingBalance(0);
        setMonthlyContribution(583);
        setAnnualReturn(10);
        setCurrentTaxRate(0);
        setRetirementTaxRate(41);
      })
      .catch(error => {
        console.error('Error submitting record:', error);
        alert('Failed to submit: ' + error.message);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Financial Input Form</h3>
      <fieldset>
        <legend>Basic Info</legend>

        <label htmlFor="firstName">First Name:</label>
        <input 
          type="text" 
          id="firstName" 
          name="firstName" 
          placeholder="Enter your first name" 
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        /><br /><br />

        <label htmlFor="lastName">Last Name:</label>
        <input 
          type="text" 
          id="lastName" 
          name="lastName" 
          placeholder="Enter your last name" 
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        /><br /><br />

        <label htmlFor="birthday">Birthday:</label>
        <input 
          type="date" 
          id="birthday" 
          name="birthday" 
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        /><br /><br />

        <label htmlFor="email">Email input:</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />

        <label htmlFor="tel">Phone number:</label>
        <input 
          type="tel" 
          id="tel" 
          name="tel" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        /><br /><br />

      </fieldset>



      <fieldset>
        <legend>Your numbers</legend>

        <label className="label">
            Age Range: <b>{ageRange[0]} to {ageRange[1]}</b>
          </label>
          <input
            type="range"
            min="18"
            max="85"
            value={ageRange[0]}
            onChange={(e) =>
              setAgeRange([Math.min(Number(e.target.value), ageRange[1]), ageRange[1]])
            }
            className="slider"
          />
          <input
            type="range"
            min="18"
            max="85"
            value={ageRange[1]}
            onChange={(e) =>
              setAgeRange([ageRange[0], Math.max(Number(e.target.value), ageRange[0])])
            }
            className="slider"
          />
          <div className="subLabel">Current age and target retirement age</div>
        
        <label className="label">
            Starting balance ($): <b>{startingBalance.toLocaleString()}</b>
          </label>
          <input
            type="range"
            min="0"
            max="100000"
            step="1000"
            value={startingBalance}
            onChange={(e) => setStartingBalance(Number(e.target.value))}
            className="slider"
          />
          <div className="subLabel">${startingBalance.toLocaleString()} / $100k</div>

          {/* Monthly contribution */}
          <label className="label">
            Monthly contribution ($): <b>{monthlyContribution.toLocaleString()}</b>
          </label>
          <input
            type="range"
            min="0"
            max="2000"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            className="slider"
          />

          {/* Annual rate of return */}
          <label className="label">
            Annual rate of return (%): <b>{annualReturn}</b>
          </label>
          <input
            type="range"
            min="0"
            max="15"
            value={annualReturn}
            onChange={(e) => setAnnualReturn(Number(e.target.value))}
            className="slider"
          />

          {/* Current tax rate */}
          <label className="label">
            Current tax rate (%): <b>{currentTaxRate}</b>
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={currentTaxRate}
            onChange={(e) => setCurrentTaxRate(Number(e.target.value))}
            className="slider"
          />

          {/* Estimated tax rate at retirement */}
          <label className="label">
            Estimated tax rate at retirement (%): <b>{retirementTaxRate}</b>
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={retirementTaxRate}
            onChange={(e) => setRetirementTaxRate(Number(e.target.value))}
            className="slider"
          />
      </fieldset>

      <button type="submit">Submit</button>
      <button type="reset">Reset Form</button>

    </form>
  );
}
/* 
function BasicInfoForm() {
  return (
    <>
      <h3>Text, Number, Date, and Color Inputs</h3>
      <fieldset>
        <legend>Basic Info</legend>

        <label htmlFor="firstName">First Name:</label>
        <input type="text" id="firstName" name="firstName" placeholder="Enter your first name" /><br /><br />

        <label htmlFor="lastName">Last Name:</label>
        <input type="text" id="lastName" name="lastName" placeholder="Enter your last name" /><br /><br />

        <label htmlFor="birthday">Birthday:</label>
        <input type="date" id="birthday" name="birthday" /><br /><br />

        <label htmlFor="email">Email input:</label>
        <input type="email" id="email" name="email" /><br /><br />

        <label htmlFor="password">Password input:</label>
        <input type="password" id="password" name="password" /><br /><br />

        <label htmlFor="tel">Phone number:</label>
        <input type="tel" id="tel" name="tel" /><br /><br />

        <label htmlFor="url">URL input:</label>
        <input type="url" id="url" name="url" /><br /><br />

        <label htmlFor="number">Number input:</label>
        <input type="number" id="number" name="quantity" min="1" max="10" /><br /><br />

        <label htmlFor="time">Time input:</label>
        <input type="time" id="time" name="appt-time" /><br /><br />

        <label htmlFor="color">Pick a color:</label>
        <input type="color" id="color" name="favcolor" /><br /><br />
      </fieldset>
    </>
  );
}

function FormButtons() {
  return (
    <>
      <h3>Buttons (Submit, Reset, and Custom)</h3>
      <fieldset>
        <legend>Form Buttons</legend>

        <input type="submit" value="Submit Form" />
        <input type="reset" value="Reset Form" />
        <button type="button" onClick={() => alert("Button clicked!")}>Custom Button</button>
      </fieldset>
    </>
  );
}*/


function App() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://34.217.130.235:8080/employees')
      .then((response) => response.json())
      .then((json) => {
        console.log(json);

        // Safely extract employeeList from the response
        const employeeList = json?._embedded?.employeeList || [];
        setEmployees(employeeList);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const deleteEmployeesIndividually = () => {
    const confirmed = window.confirm("Are you sure you want to delete all employees one by one?");
    if (!confirmed) return;
  
    employees.forEach((emp) => {
      fetch(`http://34.217.130.235:8080/employees/${emp.id}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (res.ok) {
            console.log(`✅ Deleted employee with ID: ${emp.id}`);
            // Optionally remove it from local state
            setEmployees((prev) => prev.filter((e) => e.id !== emp.id));
          } else {
            console.error(`❌ Failed to delete employee with ID: ${emp.id}`);
          }
        })
        .catch((err) => {
          console.error(`❌ Error deleting employee with ID: ${emp.id}`, err);
        });
    });
  };
  




  return (  
    <div style={{ padding: '2rem' }}>
      <h2>Financial Planning Form</h2>
      <FinancialForm />

      <button onClick={deleteEmployeesIndividually} style={{ marginBottom: '1rem', backgroundColor: 'darkred', color: 'white' }}>
        Delete All Employees One by One
      </button>


      <h2>Employees</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0">
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
      
      {/* Add the Financial Records component */}
      <FinancialRecords />
    </div>
  );
}

export default App;
