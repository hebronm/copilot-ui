"use client"
import { calculateNetSalary, calculateRelativeTaxPercentage } from './functions.js'
import { useState, useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine 
} from "recharts"

function getSliderTrackStyle(value, min = 0, max = 100) {
  const percent = ((value - min) / (max - min)) * 100
  return {
    background: `linear-gradient(to right, #4caf50 ${percent}%, #ccc ${percent}%)`,
  }
}

/*
// Tax bracket calculator (simplified 2024 brackets)
function getTaxRate(income) {
  if (income <= 11000) return 10
  if (income <= 44725) return 12
  if (income <= 95375) return 22
  if (income <= 182050) return 24
  if (income <= 231250) return 32
  if (income <= 578125) return 35
  return 37
}
*/

const taxes2024 = [
  [11000, 10],   
  [44725, 12],  
  [95375, 22], 
  [182050, 24],
  [231250, 32],
  [578125, 35], 
  [Infinity, 37]
];

//create a section for tax bracket ranges and default it ot taxes2024
//save it in a variable just like the rest (currentAge, startingSalary, etc.)


// Calculate realistic retirement tax rate based on withdrawal amount
function calculateRetirementTaxRate(annualWithdrawal, socialSecurity = 20000, otherIncome = 5000) {
  const totalRetirementIncome = annualWithdrawal + socialSecurity * 0.85 + otherIncome // 85% of SS is taxable
  return calculateRelativeTaxPercentage(taxes2024, totalRetirementIncome)
}

function DataAnalysis() {
  // Basic parameters
  const [currentAge, setCurrentAge] = useState(30)
  const [retirementAge, setRetirementAge] = useState(65)
  const [expectedReturn, setExpectedReturn] = useState(7)
  const [startingBalance, setStartingBalance] = useState(10000)

  // Retirement planning
  const [desiredRetirementIncome, setDesiredRetirementIncome] = useState(60000)
  const [socialSecurityIncome, setSocialSecurityIncome] = useState(20000)
  const [otherRetirementIncome, setOtherRetirementIncome] = useState(5000)

  // Year-by-year data
  const [useYearByYear, setUseYearByYear] = useState(false)
  const [simpleIncome, setSimpleIncome] = useState(75000)
  const [simpleContribution, setSimpleContribution] = useState(500)
  const [salaryGrowthRate, setSalaryGrowthRate] = useState(3)

  // Calculate realistic retirement tax rate
  const retirementTaxRate = calculateRetirementTaxRate(
    desiredRetirementIncome,
    socialSecurityIncome,
    otherRetirementIncome,
  )

  // Initialize year-by-year data
  const [yearByYearData, setYearByYearData] = useState(() => {
    const years = []
    for (let i = 0; i <= 35; i++) {
      years.push({
        year: i,
        age: 30 + i,
        salary: 75000 * Math.pow(1.03, i),
        contribution: 500 * Math.pow(1.03, i),
      })
    }
    return years
  })

  // Calculate optimal switching strategy with CORRECTED FORMULAS
  const analysis = useMemo(() => {
    const yearsToRetirement = retirementAge - currentAge
    const monthlyReturn = expectedReturn / 100 / 12

    // Get salary and contribution data
    const getSalaryData = (year) => {
      if (useYearByYear && yearByYearData[year]) {
        return {
          salary: yearByYearData[year].salary,
          contribution: yearByYearData[year].contribution
        }
      } else {
        return {
          salary: simpleIncome * Math.pow(1 + salaryGrowthRate / 100, year),
          contribution: simpleContribution * Math.pow(1 + salaryGrowthRate / 100, year)
        }
      }
    }

    // Track multiple scenarios
    const scenarios = {
      alwaysTraditional: { balance: startingBalance },
      alwaysRoth: { balance: startingBalance },
      switching: {
        traditionalBalance: 0,
        rothBalance: 0,
        currentStrategy: null,
      },
    }

    const yearlyData = []
    const switchPoints = []

    // Calculate year by year
    for (let year = 0; year <= yearsToRetirement; year++) {
      const currentAgeInYear = currentAge + year
      const { salary, contribution } = getSalaryData(year)
      const taxRateThisYear = calculateRelativeTaxPercentage(taxes2024, salary)
      const monthlyContribution = contribution

      const taxDifference = taxRateThisYear - retirementTaxRate
    
      let optimalStrategy

      if (taxDifference > 0) {
        optimalStrategy = "Traditional"
      } else {
        optimalStrategy = "Roth"
      } 
      


      let traditionalAmount = 0
      let rothAmount = 0      

      // Apply growth and contributions for this year
      if (year > 0) {
        const afterTaxContribution = monthlyContribution

        // Scenario 1: Always Traditional
        for (let month = 0; month < 12; month++) {
          scenarios.alwaysTraditional.balance = scenarios.alwaysTraditional.balance * (1 + monthlyReturn)
          const preTaxContribution = afterTaxContribution / (1 - taxRateThisYear / 100)
          scenarios.alwaysTraditional.balance += preTaxContribution
        }

        // Scenario 2: Always Roth
        for (let month = 0; month < 12; month++) {
          scenarios.alwaysRoth.balance = scenarios.alwaysRoth.balance * (1 + monthlyReturn)
          scenarios.alwaysRoth.balance += afterTaxContribution
        }

        // Scenario 3: Switching Strategy - CORRECTED
        if (year === 1) {
          scenarios.switching.currentStrategy = optimalStrategy
        } else {
          const previousOptimal = scenarios.switching.currentStrategy
          if (previousOptimal !== optimalStrategy) {
            switchPoints.push({
              age: currentAgeInYear,
              year: 2025 + year,
              switchTo: optimalStrategy,
              switchFrom: previousOptimal,
              reason: `Tax difference: ${taxDifference.toFixed(1)} points (${taxRateThisYear}% vs ${retirementTaxRate}%)`,
              salary: salary,
              taxRate: taxRateThisYear,
              traditionalBalance: scenarios.switching.traditionalBalance,
              rothBalance: scenarios.switching.rothBalance,
            })
            scenarios.switching.currentStrategy = optimalStrategy
          }
        }

        // Apply contributions based on current strategy
        for (let month = 0; month < 12; month++) {
          // Apply growth to both accounts
          scenarios.switching.traditionalBalance *= (1 + monthlyReturn)
          scenarios.switching.rothBalance *= (1 + monthlyReturn)

          // Only contribute to one account based on current strategy
          if (scenarios.switching.currentStrategy === "Traditional") {
            const preTaxContribution = afterTaxContribution / (1 - taxRateThisYear / 100)
            scenarios.switching.traditionalBalance += preTaxContribution
          } else {
            scenarios.switching.rothBalance += afterTaxContribution
          }
        }
      } else {
        // Year 0 - set initial strategy
        if(optimalStrategy == "Roth"){
          scenarios.switching.rothBalance = startingBalance;
        } else {
          scenarios.switching.traditionalBalance = startingBalance;
        }

        

        scenarios.switching.currentStrategy = optimalStrategy


      }

  

      // Calculate after-tax values for comparison
      const alwaysTraditionalAfterTax = scenarios.alwaysTraditional.balance * (1 - retirementTaxRate / 100)
      const alwaysRothAfterTax = scenarios.alwaysRoth.balance
      const switchingTraditionalAfterTax = scenarios.switching.traditionalBalance * (1 - retirementTaxRate / 100)
      const switchingTotal = switchingTraditionalAfterTax + scenarios.switching.rothBalance

      yearlyData.push({
        age: currentAgeInYear,
        year: 2025 + year,
        salary: salary,
        taxRate: taxRateThisYear,
        monthlyContribution: monthlyContribution,

        // Individual account balances for switching strategy
        traditionalBalance: scenarios.switching.traditionalBalance,
        rothBalance: scenarios.switching.rothBalance,
        traditionalAfterTax: switchingTraditionalAfterTax,



        // Scenario comparisons (after-tax values)
        alwaysTraditional: alwaysTraditionalAfterTax,
        alwaysRoth: alwaysRothAfterTax,
        switchingStrategy: switchingTotal,
        


        // Strategy info
        currentStrategy: scenarios.switching.currentStrategy,
        traditionalAmount: traditionalAmount,
        rothAmount: rothAmount,
        contributingTo: scenarios.switching.currentStrategy,
        taxDifference: taxDifference,
      })


    }

    // Calculate final results
    const finalData = yearlyData[yearlyData.length - 1]
    const strategies = {
      "Always Traditional": finalData.alwaysTraditional,
      "Always Roth": finalData.alwaysRoth,
      "Switching Strategy": finalData.switchingStrategy,
    }

    const bestValue = Math.max(...Object.values(strategies))
    const recommendation = Object.keys(strategies).find((key) => strategies[key] === bestValue)

 return {
      yearlyData,
      switchPoints,
      scenarios,
      recommendation,
      finalValues: strategies,
    }
  }, [
    currentAge,
    retirementAge,
    expectedReturn,
    retirementTaxRate,
    startingBalance,
    useYearByYear,
    simpleIncome,
    simpleContribution,
    salaryGrowthRate,
    yearByYearData,
    
    //Don't need?

    //desiredRetirementIncome,
    //socialSecurityIncome,
    //otherRetirementIncome,
  ])

  const resetForm = () => {
    setCurrentAge(30)
    setRetirementAge(65)
    setExpectedReturn(7)
    setStartingBalance(10000)
    setSimpleIncome(75000)
    setSimpleContribution(500)
    setSalaryGrowthRate(3)
    setDesiredRetirementIncome(60000)
    setSocialSecurityIncome(20000)
    setOtherRetirementIncome(5000)
  }

  const updateYearData = (yearIndex, field, value) => {
    const newData = [...yearByYearData]
    newData[yearIndex] = {...newData[yearIndex], [field]: Number(value) }
    setYearByYearData(newData)
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "auto" }}>
      {/* Basic Parameters */}
      <div className="form-box">
        <h1 style={{ textAlign: "center" }}>Realistic IRA Strategy Calculator</h1>
        <p style={{ textAlign: "center", color: "#666" }}>
          Based on real-world contribution limits and tax optimization strategies
        </p>

        <fieldset>
          <h2 style={{ textAlign: "center" }}>Basic Parameters</h2>
          <div className="center-container">
            <label className="label">
              Current Age: <b>{currentAge}</b>
            </label>
            <input
              type="range"
              min="18"
              max="70"
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className="custom-slider"
              style={getSliderTrackStyle(currentAge, 18, 70)}
            />

            <label className="label">
              Retirement Age: <b>{retirementAge}</b>
            </label>
            <input
              type="range"
              min={currentAge + 1}
              max="85"
              value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
              className="custom-slider"
              style={getSliderTrackStyle(retirementAge, currentAge + 1, 85)}
            />

            <label className="label">
              Expected Annual Return: <b>{expectedReturn}%</b>
            </label>
            <input
              type="range"
              min="3"
              max="12"
              step="0.5"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              className="custom-slider"
              style={getSliderTrackStyle(expectedReturn, 3, 12)}
            />

            <label className="label">
              Starting Balance: <b>${startingBalance.toLocaleString()}</b>
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
          </div>
        </fieldset>

        {/* Preset Scenarios */}
        <fieldset>
          <h2 style={{ textAlign: "center" }}>Quick Test Scenarios</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <button
              className="submit-btn"
              onClick={() => {
                setCurrentAge(30)
                setRetirementAge(65)
                setExpectedReturn(7)
                setStartingBalance(10000)
                setSimpleIncome(75000)
                setSimpleContribution(500)
                setSalaryGrowthRate(3)
                setDesiredRetirementIncome(60000)
                setSocialSecurityIncome(20000)
                setOtherRetirementIncome(5000)

              }}
              style={{ padding: "1rem", fontSize: "0.9rem" }}
            >
              📊 Default Scenario
              <br />
              <small>Traditional usually wins</small>
            </button>

            <button
              className="submit-btn"
              onClick={() => {
                setCurrentAge(25)
                setRetirementAge(67)
                setExpectedReturn(8)
                setStartingBalance(5000)
                setSimpleIncome(45000)
                setSimpleContribution(400)
                setSalaryGrowthRate(6)
                setDesiredRetirementIncome(100000)
                setSocialSecurityIncome(25000)
                setOtherRetirementIncome(10000)
              }}
              style={{ padding: "1rem", fontSize: "0.9rem", backgroundColor: "#2e7d32" }}
            >
              🚀 Career Growth
              <br />
              <small>Switching strategy wins</small>
            </button>

            <button
              className="submit-btn"
              onClick={() => {
                setCurrentAge(28)
                setRetirementAge(65)
                setExpectedReturn(7.5)
                setStartingBalance(15000)
                setSimpleIncome(65000) // Lower current income
                setSimpleContribution(583)
                setSalaryGrowthRate(2) // Lower growth
                setDesiredRetirementIncome(140000) // Much higher retirement income
                setSocialSecurityIncome(35000)
                setOtherRetirementIncome(20000)
              }}
              style={{ padding: "1rem", fontSize: "0.9rem", backgroundColor: "#1976d2" }}
            >
              💰 High Retirement Income
              <br />
              <small>Roth strategy wins</small>
            </button>

            <button
              className="submit-btn"
              onClick={() => {
                setCurrentAge(22)
                setRetirementAge(65)
                setExpectedReturn(9)
                setStartingBalance(2000)
                setSimpleIncome(35000)
                setSimpleContribution(300)
                setSalaryGrowthRate(8)
                setDesiredRetirementIncome(75000)
                setSocialSecurityIncome(20000)
                setOtherRetirementIncome(5000)
              }}
              style={{ padding: "1rem", fontSize: "0.9rem", backgroundColor: "#ff9800" }}
            >
              🎓 Young Professional
              <br />
              <small>Dramatic income growth</small>
            </button>

            <button
              className="submit-btn"
              onClick={() => {
                setCurrentAge(40)
                setRetirementAge(70)
                setExpectedReturn(6)
                setStartingBalance(50000)
                setSimpleIncome(150000)
                setSimpleContribution(667)
                setSalaryGrowthRate(1.5)
                setDesiredRetirementIncome(90000)
                setSocialSecurityIncome(35000)
                setOtherRetirementIncome(20000)
              }}
              style={{ padding: "1rem", fontSize: "0.9rem", backgroundColor: "#9c27b0" }}
            >
              🏢 High Earner
              <br />
              <small>Late starter, high income</small>
            </button>
          </div>
          <div style={{ textAlign: "center", padding: "1rem", backgroundColor: "#f0f8ff", borderRadius: "8px" }}>
            <p>
              <strong>Click any scenario above to see when different strategies win!</strong>
            </p>
            <p style={{ fontSize: "0.9rem", color: "#666" }}>
              Each button sets up a realistic financial situation where a different strategy performs best.
            </p>
          </div>
        </fieldset>

        {/* Retirement Income Planning */}
        <fieldset>
          <h2 style={{ textAlign: "center" }}>Retirement Income Planning</h2>
          <div className="center-container">
            <label className="label">
              Desired Annual Retirement Income: <b>${desiredRetirementIncome.toLocaleString()}</b>
            </label>
            <input
              type="range"
              min="30000"
              max="150000"
              step="5000"
              value={desiredRetirementIncome}
              onChange={(e) => setDesiredRetirementIncome(Number(e.target.value))}
              className="custom-slider"
              style={getSliderTrackStyle(desiredRetirementIncome, 30000, 150000)}
            />
            <small>How much you want to withdraw from IRAs annually</small>

            <label className="label">
              Expected Social Security: <b>${socialSecurityIncome.toLocaleString()}</b>
            </label>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={socialSecurityIncome}
              onChange={(e) => setSocialSecurityIncome(Number(e.target.value))}
              className="custom-slider"
              style={getSliderTrackStyle(socialSecurityIncome, 0, 50000)}
            />

            <label className="label">
              Other Retirement Income: <b>${otherRetirementIncome.toLocaleString()}</b>
            </label>
            <input
              type="range"
              min="0"
              max="30000"
              step="1000"
              value={otherRetirementIncome}
              onChange={(e) => setOtherRetirementIncome(Number(e.target.value))}
              className="custom-slider"
              style={getSliderTrackStyle(otherRetirementIncome, 0, 30000)}
            />
            <small>Pensions, part-time work, investment income</small>

            <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#e3f2fd", borderRadius: "8px" }}>
              <strong>Calculated Retirement Tax Rate: {retirementTaxRate}%</strong>
              <br />
              <small>
                Based on total retirement income of $
                {/*Social Security Income is taxed only up to 85%*/}
                {(desiredRetirementIncome + socialSecurityIncome * 0.85 + otherRetirementIncome).toLocaleString()}
              </small>
            </div>
          </div>
        </fieldset>

        {/* Income and Contribution Input Method */}
        <fieldset>
          <h2 style={{ textAlign: "center" }}>Career Income & Contribution Data</h2>
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <label style={{ marginRight: "1rem" }}>
              <input
                type="radio"
                checked={!useYearByYear}
                onChange={() => setUseYearByYear(false)}
                style={{ marginRight: "0.5rem" }}
              />
              Simple Growth Model
            </label>
            <label>
              <input
                type="radio"
                checked={useYearByYear}
                onChange={() => setUseYearByYear(true)}
                style={{ marginRight: "0.5rem" }}
              />
              Year-by-Year Input
            </label>
          </div>

          {!useYearByYear ? (
            <div className="center-container">
              <label className="label">
                Current Annual Salary: <b>${simpleIncome.toLocaleString()}</b>
              </label>
              <input
                type="range"
                min="30000"
                max="200000"
                step="5000"
                value={simpleIncome}
                onChange={(e) => setSimpleIncome(Number(e.target.value))}
                className="custom-slider"
                style={getSliderTrackStyle(simpleIncome, 30000, 200000)}
              />
              <small>Current tax bracket: {calculateRelativeTaxPercentage(taxes2024, simpleIncome)}%</small>

              <label className="label">
                Monthly IRA Contribution: <b>${simpleContribution.toLocaleString()}</b>
              </label>
              <input
                type="range"
                min="100"
                max="700"
                step="50"
                value={simpleContribution}
                onChange={(e) => setSimpleContribution(Number(e.target.value))}
                className="custom-slider"
                style={getSliderTrackStyle(simpleContribution, 100, 700)}
              />
              <small>2024 IRA limit: $7,000/year ($583/month), $8,000 if 50+ ($667/month)</small>

              <label className="label">
                Annual Salary Growth: <b>{salaryGrowthRate}%</b>
              </label>
              <input
                type="range"
                min="0"
                max="8"
                step="0.5"
                value={salaryGrowthRate}
                onChange={(e) => setSalaryGrowthRate(Number(e.target.value))}
                className="custom-slider"
                style={getSliderTrackStyle(salaryGrowthRate, 0, 8)}
              />
            </div>
          ) : (
            <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ddd", padding: "1rem" }}>
              <table style={{ width: "100%", fontSize: "0.9rem" }}>
                <thead>
                  <tr>
                    <th>Age</th>
                    <th>Annual Salary</th>
                    <th>Monthly Contribution</th>
                    <th>Tax Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {yearByYearData.slice(0, retirementAge - currentAge + 1).map((yearData, index) => (
                    <tr key={index}>
                      <td>{currentAge + index}</td>
                      <td>
                        <input
                          type="number"
                          value={Math.round(yearData.salary)}
                          onChange={(e) => updateYearData(index, "salary", e.target.value)}
                          style={{ width: "100px", padding: "2px" }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={Math.round(yearData.contribution)}
                          onChange={(e) => updateYearData(index, "contribution", e.target.value)}
                          style={{ width: "80px", padding: "2px" }}
                        />
                      </td>
                      <td>{calculateRelativeTaxPercentage(taxes2024, yearData.salary)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </fieldset>

        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <button type="button" className="submit-btn">
            Calculate Optimal Strategy
          </button>
          <button type="button" className="reset-btn" onClick={resetForm}>
            Reset Form
          </button>
        </div>
      </div>

      {/* Strategy Comparison Results */}
      <div className="form-box" style={{ marginTop: "2rem" }}>
        <h1 style={{ textAlign: "center" }}>Strategy Comparison Results</h1>

        <div className="analysis-summary">
          <div className="summary-grid">
            <div className="summary-card traditional-card">
              <div className="summary-number">${Math.round(analysis.finalValues["Always Traditional"] / 1000)}k</div>
              <div className="summary-label">Always Traditional</div>
            </div>
            <div className="summary-card roth-card">
              <div className="summary-number">${Math.round(analysis.finalValues["Always Roth"] / 1000)}k</div>
              <div className="summary-label">Always Roth</div>
            </div>
            <div className="summary-card switch-card">
              <div className="summary-number">${Math.round(analysis.finalValues["Switching Strategy"] / 1000)}k</div>
              <div className="summary-label">Switching Strategy</div>
            </div>
            <div className="summary-card optimal-card">
              <div className="summary-badge">{analysis.recommendation}</div>
              <div className="summary-label">Best Strategy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Growth Chart */}
      <div className="form-box" style={{ marginTop: "2rem" }}>
        <h3 style={{ textAlign: "center" }}>Strategy Comparison (After-Tax Values)</h3>
        <fieldset>
          <div style={{ height: "400px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analysis.yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name]}
                  labelFormatter={(label) => `Age: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="alwaysTraditional"
                  stroke="#FF5733"
                  strokeWidth={2}
                  name="Always Traditional"
                />
                <Line type="monotone" dataKey="alwaysRoth" stroke="#2e7d32" strokeWidth={2} name="Always Roth" />
                <Line
                  type="monotone"
                  dataKey="switchingStrategy"
                  stroke="#1976d2"
                  strokeWidth={2}
                  name="Switching Strategy"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </fieldset>
      </div>

      {/* Growth of Switching only */}
      <div className="form-box" style={{ marginTop: "2rem" }}>
        <h3 style={{ textAlign: "center" }}>Switching Strategy Breakdown</h3>
        <fieldset>
          <div style={{ height: "400px", width: "100%" }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={analysis.yearlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="switchingStrategy"
                  stroke="#8884d8"
                  name="Switching Total"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="rothBalance"
                  stroke="#82ca9d"
                  name="Roth Portion"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="traditionalAfterTax"
                  stroke="#ffc658"
                  name="Traditional Portion"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </fieldset>
      </div>

      {/* Tax Bracket and Salary Growth Chart */}
      <div className="form-box" style={{ marginTop: "2rem" }}>
        <h3 style={{ textAlign: "center" }}>Salary Growth & Tax Bracket Progression</h3>
        <fieldset>
          <div style={{ height: "400px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analysis.yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis
                  yAxisId="salary"
                  orientation="left"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <YAxis yAxisId="tax" orientation="right" tickFormatter={(value) => `${value}%`} domain={[10, 40]} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name.includes("Tax Rate")) return [`${value}%`, name]
                    return [`$${Number(value).toLocaleString()}`, name]
                  }}
                  labelFormatter={(label) => `Age: ${label}`}
                />
                <Legend />
                <Line
                  yAxisId="salary"
                  type="monotone"
                  dataKey="salary"
                  stroke="#1976d2"
                  strokeWidth={2}
                  name="Annual Salary"
                />
                <Line
                  yAxisId="tax"
                  type="monotone"
                  dataKey="taxRate"
                  stroke="#ff9800"
                  strokeWidth={2}
                  name="Current Tax Rate"
                />
                <Line
                  yAxisId="tax"
                  type="monotone"
                  dataKey={() => retirementTaxRate}
                  stroke="#f44336"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Retirement Tax Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#e3f2fd", borderRadius: "8px" }}>
            <p>
              <strong>Key Insight:</strong> When the orange line (current tax rate) is above the red dashed line
              (retirement tax rate), Traditional IRA is better. When it's below, Roth IRA is better.
            </p>
          </div>
        </fieldset>
      </div>

      {/* Switching Strategy Visualization */}
      <div className="form-box" style={{ marginTop: "2rem" }}>
        <h3 style={{ textAlign: "center" }}>Switching Strategy Timeline</h3>
        <fieldset>
          <div style={{ height: "300px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis.yearlyData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis />
                <Tooltip
                  formatter={(value, name, props) => [
                    `$${value.toLocaleString()}`,
                    name,
                  ]}
                  labelFormatter={(label) => `Age: ${label}`}
                />
                <Legend />

                {/* Stacked bars for Roth and Traditional balances */}
                <Bar
                  dataKey="rothBalance"
                  stackId="portfolio"
                  fill="#82ca9d"
                  name="Roth Portion"
                />
                <Bar
                  dataKey="traditionalAfterTax"
                  stackId="portfolio"
                  fill="#ffc658"
                  name="Traditional Portion"
                />

                {/* ReferenceLines for switch points */}
                {analysis.switchPoints.length > 0 &&
                  analysis.switchPoints.map((point, index) => (
                    <ReferenceLine
                      key={index}
                      x={point.age}
                      stroke="red"
                      strokeDasharray="4 4"
                      label={{
                        position: 'top',
                        value: `Switch to ${point.switchTo}`,
                        fill: 'red',
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    />
                  ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
            {/* Detailed switch points info panel */}
          <div style={{ marginTop: "1rem" }}>
            <h4>Switch Points:</h4>
            {analysis.switchPoints.length > 0 ? (
              <div className="switch-points">
                {analysis.switchPoints.map((point, index) => (
                  <div key={index} className="switch-point-item" style={{ marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
                    <div className="switch-point-info">
                      <div className="switch-year" style={{ fontWeight: 'bold' }}>
                        Age {point.age} ({point.year})
                      </div>
                      <div className="switch-strategy">
                        Switch from <strong>{point.switchFrom}</strong> to <strong>{point.switchTo}</strong>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#666" }}>{point.reason}</div>
                    </div>
                    <div className="switch-values" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                      <div>Salary: ${point.salary.toLocaleString()}</div>
                      <div>Tax Rate: {point.taxRate}%</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#666", fontStyle: "italic" }}>
                No switches needed - one strategy is optimal throughout your career.
              </p>
            )}
          </div>
        </fieldset>
      </div>

            
    </div>
  )
}

export default DataAnalysis
