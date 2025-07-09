import React, { useEffect, useState } from 'react';
import "./App.css";

function MyButton() {
  return <button>I'm a button, in a return statement</button>;
}

function FinancialForm() {
  {/*ranges for sliders*/}
  const [ageRange, setAgeRange] = useState([18, 75]);
  const [startingBalance, setStartingBalance] = useState(0);
  const [monthlyContribution, setMonthlyContribution] = useState(583);
  const [annualReturn, setAnnualReturn] = useState(10);
  const [currentTaxRate, setCurrentTaxRate] = useState(0);
  const [retirementTaxRate, setRetirementTaxRate] = useState(41);

  return (
    <form action="/submit" method="post">
      <h3>Financial Input Form</h3>
      <fieldset>
        <legend>Basic Info</legend>

        <label className = "label" htmlFor="name">Name: </label>
        <input type="text" id="name" name="name" placeholder="First Last" /><br /><br />

        <label htmlFor="email">Email: </label>
        <input type="email" id="email" name="email" /><br /><br />
      </fieldset>



      <fieldset>
        <legend>Your numbers</legend>

        <label htmlFor="range">Volume:</label>
        <input type="range" id="range" name="volume" min="0" max="100" /><br /><br />

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

function BasicInfoForm() {
  return (
    <>
      <h3>Text, Number, Date, and Color Inputs</h3>
      <fieldset>
        <legend>Basic Info</legend>

        <label htmlFor="name">Text input:</label>
        <input type="text" id="name" name="name" placeholder="Enter your name" /><br /><br />

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

        <label htmlFor="date">Date input:</label>
        <input type="date" id="date" name="birthdate" /><br /><br />

        <label htmlFor="time">Time input:</label>
        <input type="time" id="time" name="appt-time" /><br /><br />

        <label htmlFor="color">Pick a color:</label>
        <input type="color" id="color" name="favcolor" /><br /><br />
      </fieldset>
    </>
  );
}

function SportsAndInterests() {
  return (
    <>
      <h3>Buttons and Checks</h3>
      <fieldset>
        <legend>Radio Buttons & Checkboxes</legend>

        <p>Choose your favorite sport:</p>
        <input type="radio" id="basketball" name="sport" value="Basketball" />
        <label htmlFor="basketball">Basketball</label><br />

        <input type="radio" id="football" name="sport" value="Football" />
        <label htmlFor="football">Football</label><br /><br />

        <p>Select your interests:</p>
        <input type="checkbox" id="coding" name="interest" value="Coding" />
        <label htmlFor="coding">Coding</label><br />

        <input type="checkbox" id="music" name="interest" value="Music" />
        <label htmlFor="music">Music</label><br />

        <input type="checkbox" id="gaming" name="interest" value="Gaming" />
        <label htmlFor="gaming">Gaming</label><br /><br />
      </fieldset>
    </>
  );
}

function DropdownAndTextarea() {
  return (
    <>
      <h3>Select Menu/Dropdown and Multiline Text</h3>
      <fieldset>
        <legend>Select Menus and Textareas</legend>

        <label htmlFor="car">Choose a car:</label>
        <select id="car" name="car">
          <option value="volvo">Volvo</option>
          <option value="toyota">Toyota</option>
          <option value="honda">Honda</option>
        </select><br /><br />

        <label htmlFor="message">Textarea:</label><br />
        <textarea id="message" name="message" rows="4" cols="50" placeholder="Write something..."></textarea><br /><br />
      </fieldset>
    </>
  );
}

function AdvancedInputs() {
  return (
    <>
      <h3>Uploading files, slider, hidden inputs, search, and datetime input</h3>
      <fieldset>
        <legend>Advanced Inputs</legend>

        <label htmlFor="file">Upload a file:</label>
        <input type="file" id="file" name="file" /><br /><br />

        <label htmlFor="range">Volume:</label>
        <input type="range" id="range" name="volume" min="0" max="100" /><br /><br />

        <label htmlFor="hiddenInput">Hidden input (won't show):</label>
        <input type="hidden" id="hiddenInput" name="hiddenData" value="secretValue" /><br /><br />

        <label htmlFor="search">Search:</label>
        <input type="search" id="search" name="search" /><br /><br />

        <label htmlFor="datetime-local">Meeting date and time:</label>
        <input type="datetime-local" id="datetime-local" name="meeting" /><br /><br />
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
}


function App() {
  const [employees, setEmployees] = useState([]);
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

  return (
    <div style={{ padding: '2rem' }}>

      <h2>Form</h2>
      <FinancialForm />




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
    </div>
  );
}

export default App;
