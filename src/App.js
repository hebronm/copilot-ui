
import React, { useEffect, useState, useMemo } from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
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

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  {/*ranges for sliders*/}
  const [ageRange, setAgeRange] = useState([18, 75]);
  const [startingBalance, setStartingBalance] = useState(0);
  const [monthlyContribution, setMonthlyContribution] = useState(100);
  const [annualReturn, setAnnualReturn] = useState(10);
  const [currentTaxRate, setCurrentTaxRate] = useState(5);
  const [retirementTaxRate, setRetirementTaxRate] = useState(10);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setBirthday('');
    setAgeRange([18, 75]);
    setStartingBalance(0);
    setMonthlyContribution(100);
    setAnnualReturn(10);
    setCurrentTaxRate(5);
    setRetirementTaxRate(10);
  };

  
  /**FORMULAS FOR EACH GRAPH
   * 
   * For years on the graph, just 2025 until 2025 + (retirement age - current age)
   * Monthly contribution is assumed to be after tax
   * 
   * General (taxable):
   * Uses current age, retirement age, starting balance, monthly contribution (MC), annual return (APR), current tax rate(TR)
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
   * 
   * Deductible IRA:
   * Uses urrent age, retirement age, starting balance, monthly contribution (MC), annual return (APR), current tax rate(TR), and retirement tax rate(RT)
   * Adjusts monthly contribution to before tax (MCeff), and uses same formula as ROTH IRA with MCeff instead of MC, 
   * then is desplayed by balance * (1 - RT/100) to adjust for retirement tax
   */
   
  const chartData = useMemo(() => {
    const startYear = 2025;
    const yearsToRetire = ageRange[1] - ageRange[0];
    const monthsPerYear = 12;
    const currentYear = new Date().getFullYear();

    const effectiveTaxedAnnualReturn = annualReturn * (1 - currentTaxRate / 100);
    const monthlyReturn = annualReturn / 100 / monthsPerYear
    const monthlyTaxedReturn = effectiveTaxedAnnualReturn / 100 / monthsPerYear;

    // Deductible IRA monthly contribution adjusted for pretax (contributions are pretax)
    const preTaxMonthlyContribution = monthlyContribution / (1 - currentTaxRate / 100);


    let generalBalance = startingBalance;
    let rothBalance = startingBalance;
    let deductibleBalance = startingBalance;
    let nonDeductibleBalance = startingBalance;

    let nonDeductibleTotalContributions = 0;
    
    //four, one for each graph
    const dataPoints = [];

    // Push initial year (2025) — no contributions, no growth
    dataPoints.push({
      year: startYear,
      generalBalance,
      rothBalance,
      deductibleBalance,
      nonDeductibleBalance,
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

        /** same as general but uses pretax mc */
        deductibleBalance = deductibleBalance * (1 + monthlyReturn);
        deductibleBalance += preTaxMonthlyContribution;

        // Non-deductible IRA: same retirement tax drag on growth, add after-tax contribution
        nonDeductibleBalance = nonDeductibleBalance * (1 + monthlyReturn);
        nonDeductibleBalance += monthlyContribution;
        nonDeductibleTotalContributions += monthlyContribution;

      }

      // Apply retirement tax once per year snapshot for deductible and non-deductible IRAs
      
      // apply retirement tax to entire balance
      const deductibleAfterTax = deductibleBalance * (1 - retirementTaxRate / 100);
      // apply reitrement tax only to earnings, so subtract the contribution times number of months
      const nonDeductibleAfterTax = nonDeductibleBalance - 
      (nonDeductibleBalance - nonDeductibleTotalContributions) * (retirementTaxRate / 100);

      dataPoints.push({
        year: currentYear + year,
        generalBalance,
        rothBalance,
        deductibleBalance: deductibleAfterTax,
        nonDeductibleBalance: nonDeductibleAfterTax,
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
  const deductibleSeriesData = chartData.map((point) => Number(point.deductibleBalance.toFixed(2) || 0));
  const nonDeductibleSeriesData = chartData.map((point) => Number(point.nonDeductibleBalance.toFixed(2) || 0));

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: 'auto' }}>
      <form className='form-box' action="/submit" method="post">
        <h1 style={{ textAlign: 'center' }}>IRA Calculator Tool</h1>
        <br></br>

        {/*Basical Info Box*/}
        <fieldset className='thinFieldset'>
        <h2 style={{ textAlign: 'center' }}>Basic Information</h2>
        <div className='center-container'>
          <label className='Box1Label'>First Name:</label>
          <input type="text" placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} />

          <label className='Box1Label'>Last Name:</label>
          <input type="text" placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)} />

          <label className='Box1Label'>Email:</label>
          <input type="email" placeholder="JohnDoe@mail.com" value={email} onChange={e => setEmail(e.target.value)} />

          <label className='Box1Label'>Phone Number:</label>
          <input type="tel" placeholder="(123) 456-7890" value={phone} onChange={e => setPhone(e.target.value)} />

          <label className='Box1Label'>Birthday:</label>
          <input type="date" value={birthday} onChange={e => setBirthday(e.target.value)} />
        </div>
        </fieldset>

        {/*Financial Info Box*/}
        <fieldset>
          <h2 style={{ textAlign: 'center' }}>Financial Information</h2>

          <label className="label">
            Current Age: <b>{ageRange[0]}</b>
          </label>
          <input
            type="range"
            min="18"
            max="85"
            value={ageRange[0]}
            onChange={(e) => setAgeRange([Math.min(Number(e.target.value), ageRange[1]), ageRange[1]])}
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
          <small>Adjust to your current age and target retirement age</small>

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
          <small>${startingBalance.toLocaleString()} / $100k</small>

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
          <small>Note: This is the amount of "After-Tax" money you're willing to put in monthly</small>


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
          <small>Historically, a rough estimate for 30 years would show a 10-12% return</small>

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

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button type="submit" className='submit-btn'>Submit</button>
          <button type="reset" className='reset-btn' onClick={resetForm}>Reset Form</button>
        </div>
      </form>
    

      {/*Chart below the form*/}
      <div className = "form-box" style = {{marginTop: '2rem'}}>
        <h3 style={{ textAlign: 'center'}}>Estimated Account Value Graph</h3>
          <fieldset>
          <LineChart
            height={1000}
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
              }, 
              {
                data: deductibleSeriesData,
                label: 'Deductible Traditional IRA',
                color: '#FF5733',
              }, 
              {
                data: nonDeductibleSeriesData,
                label: 'Non-Deductible Traditional IRA',
                color: '#8F1A96',
              }
            ]}
            aria-label="Retirement savings growth chart"
          />
          </fieldset>
        </div>

      </div>
        
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
  const location = useLocation();

  return (
    <>
      <nav className='nav-tabs'>
        <Link to="/" className={`tab-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
        <Link to="/table" className={`tab-link ${location.pathname === '/table' ? 'active' : ''}`}>Table</Link>
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
    </>

  );
}


export default App;
