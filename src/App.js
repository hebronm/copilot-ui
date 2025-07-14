
import React, { useEffect, useState, useMemo } from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Table from "./Table";
import { LineChart } from '@mui/x-charts/LineChart';


{/*helper method to create a slider*/}
function getSliderTrackStyle(value, min = 0, max = 100) {
  const percent = ((value - min) / (max - min)) * 100;
  return {
    background: `linear-gradient(to right, #4caf50 ${percent}%, #ccc ${percent}%)`
  };
}

function FinancialForm({ onSubmit }) {

  /**
  const handleSubmit = (e) => {
    e.preventDefault();
    // Data package for future backend use; need to work out backend later
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
  */

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  {/*ranges for sliders*/}
  const [ageRange, setAgeRange] = useState([18, 75]);
  const [startingBalance, setStartingBalance] = useState(0);
  const [monthlyContribution, setMonthlyContribution] = useState(100);
  const [annualReturn, setAnnualReturn] = useState(10);
  const [currentTaxRate, setCurrentTaxRate] = useState(5);
  const [retirementTaxRate, setRetirementTaxRate] = useState(10);

   const resetForm = () => {
    setName('');
    setEmail('');
    setAgeRange([18, 75]);
    setStartingBalance(0);
    setMonthlyContribution(100);
    setAnnualReturn(10);
    setCurrentTaxRate(5);
    setRetirementTaxRate(10);
  };

  /**FORMULAS FOR EACH GRAPH
   * General (taxable):
   * Uses current age, retirement age, starting balance, monthly contribution (MC), annual return (APR), current tax rate(TR)
   * For years on the graph, just 2025 until 2025 + (retirement age - current age)
   * Each month is compunded by APR/12, but taxed at the end of the year by current rate, and monthly contribution is added after 
   * Formula for each month: Month = Previous month * (1 + (APR/12)) * (1 - TR/100) + MC
   * 
   * ROTH IRA 
   * Uses current age, retirement age, starting balance, monthly contribution (MC), annual return (APR)
   * Each month is compunded by APR/12, but taxed at the end of the year by current rate, and monthly contribution is added after
   * (Same as general but no tax)
   * Formula: Month = Previous month * (1 + (APR/12)) + MC
   * 
   * In my code, I calculate the total return for the entire year so I don't have to do each month
   * effectiveTaxedAnnualReturn includes tax multplied by annualReturn
   * I use the annual return (taxed and not taxed), divide by 100 to turn into a percentage, and divide by 12 for months
   * That way, I can just do year by year
   */
  
  const chartData = useMemo(() => {
    const startYear = 2025;
    const yearsToRetire = ageRange[1] - ageRange[0];
    const monthsPerYear = 12;
    const currentYear = new Date().getFullYear();

    const effectiveTaxedAnnualReturn = annualReturn * (1 - currentTaxRate / 100);
    const monthlyReturn = annualReturn / 100 / monthsPerYear
    const monthlyTaxedReturn = effectiveTaxedAnnualReturn / 100 / monthsPerYear;

    let generalBalance = startingBalance;
    let rothBalance = startingBalance;
    let deductableBalance = startingBalance;
    let nonDeductableBalance = startingBalance;
    
    //four, one for each graph
    const dataPoints = [];

    // Push initial year (2025) — no contributions, no growth
    dataPoints.push({
      year: startYear,
      generalBalance,
      rothBalance,
    });


    for (let year = 1; year <= yearsToRetire; year++) {
      for (let month = 0; month < monthsPerYear; month++) {
        /**General formula: compounded per month by APR/12
         * then add monthly contribution
         * each year taxes tax rate on APR earnings only
         */
        generalBalance = generalBalance * (1 + monthlyTaxedReturn);
        generalBalance += monthlyContribution;
        /**Roth IRA formula: same as general but no tax on earnings */
        rothBalance = rothBalance * (1 + monthlyReturn); 
        rothBalance += monthlyContribution;
      }
      dataPoints.push({
        year: currentYear + year,
        generalBalance,
        rothBalance,
      });
    }

    /*
    Right now this only does once year
    const afterTaxBalance = balance * (1 - retirementTaxRate / 100);
    dataPoints.push({ year: currentYear+yearsToRetire+1, balance: afterTaxBalance });
    */

    return dataPoints;
  }, [
    ageRange,
    startingBalance,
    monthlyContribution,
    annualReturn,
    currentTaxRate,
    retirementTaxRate,
  ]);


  const xAxisData = chartData.map((point) => point.year);
  const generalSeriesData = chartData.map((point) => Number(point.generalBalance.toFixed(2)) || 0);
  const rothSeriesData = chartData.map((point) => Number(point.rothBalance.toFixed(2) || 0));


  return (
    <>
    <form action="/submit" method="post">
      <h3>Financial Input Form</h3>

      <fieldset>
        <legend>Basic Info</legend>
        <label htmlFor="name">Name: </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="First Last"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br /><br />
        <label htmlFor="email">Email: </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />
      </fieldset>


      <fieldset>
        <legend>Your numbers</legend>

        <label className="label">
          Current Age: <b>{ageRange[0]}</b>
        </label>
        <input
          type="range"
          min="18"
          max="85"
          value={ageRange[0]}
          onChange={(e) =>
            setAgeRange([Math.min(Number(e.target.value), ageRange[1]), ageRange[1]])
          }
          className="custom-slider"
          style={getSliderTrackStyle(ageRange[0], 18, 85)}
        />

        <label className="label" style={{ marginTop: '20px' }}>
          Target Retirement Age: <b>{ageRange[1]}</b>
        </label>
        <input
          type="range"
          min="18"
          max="85"
          value={ageRange[1]}
          onChange={(e) =>
            setAgeRange([ageRange[0], Math.max(Number(e.target.value), ageRange[0])])
          }
          className="custom-slider"
          style={getSliderTrackStyle(ageRange[1], 18, 85)}
/>
        <div className="subLabel">Adjust your current age and target retirement age</div>

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
          className="custom-slider"
          style={getSliderTrackStyle(startingBalance, 0, 100000)}
        />
        <div className="subLabel">${startingBalance.toLocaleString()} / $100k</div>

        <label className="label">
          Monthly contribution ($): <b>{monthlyContribution.toLocaleString()}</b>
        </label>
        <input
          type="range"
          min="0"
          max="2000"
          value={monthlyContribution}
          onChange={(e) => setMonthlyContribution(Number(e.target.value))}
          className="custom-slider"
          style={getSliderTrackStyle(monthlyContribution, 0, 2000)}
        />

        <label className="label">
          Annual rate of return (%): <b>{annualReturn}</b>
        </label>
        <input
          type="range"
          min="0"
          max="15"
          value={annualReturn}
          onChange={(e) => setAnnualReturn(Number(e.target.value))}
          className="custom-slider"
          style={getSliderTrackStyle(annualReturn, 0, 15)}
        />

        <label className="label">
          Current tax rate (%): <b>{currentTaxRate}</b>
        </label>
        <input
          type="range"
          min="0"
          max="50"
          value={currentTaxRate}
          onChange={(e) => setCurrentTaxRate(Number(e.target.value))}
          className="custom-slider"
          style={getSliderTrackStyle(currentTaxRate, 0, 50)}
        />

        <label className="label">
          Estimated tax rate at retirement (%): <b>{retirementTaxRate}</b>
        </label>
        <input
          type="range"
          min="0"
          max="50"
          value={retirementTaxRate}
          onChange={(e) => setRetirementTaxRate(Number(e.target.value))}
          className="custom-slider"
          style={getSliderTrackStyle(retirementTaxRate, 0, 50)}
        />
      </fieldset>

      <button type="submit">Submit</button>
      <button type="button" onClick={resetForm}>Reset Form</button>
    </form>
  
    {/*Chart below the form*/}
    <div style={{ marginTop: "2rem" }}>
      <LineChart
        height={300}
        xAxis={[{
          data: xAxisData,
          label: 'Year',
          valueFormatter: (year) => String(year), // ✅ disables auto-formatting like 2,045
        }]}
        series={[
          {
            data: generalSeriesData,
            label: 'General (taxable)',
            color: '#1976d2',
          },
          {
            data: rothSeriesData,
            label: 'Roth IRA',
            color: '#2e7d32',
          }
        ]}
        aria-label="Retirement savings growth chart"
      />
    </div>
    </>
        
  );
}

function FinancialGraph(){
  return (
  <   LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
          },
        ]}
        height={300}
      />
  )
}
    



function App() {


  

  return (

    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/table">Table</Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <div>
              {/* Put your FinancialForm first */}
              <FinancialForm />

              
              {/* Add any other components or JSX here */}
              <p>This is extra home page content</p>
            </div>
          }
        />
        <Route path="/table" element={<Table />} />
      </Routes>
    </Router>

  );
}


export default App;
