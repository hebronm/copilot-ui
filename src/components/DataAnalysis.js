"use client"

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
} from "recharts"

function getSliderTrackStyle(value, min = 0, max = 100) {
  const percent = ((value - min) / (max - min)) * 100
  return {
    background: `linear-gradient(to right, #4caf50 ${percent}%, #ccc ${percent}%)`,
  }
}

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

// Calculate realistic retirement tax rate based on withdrawal amount
function calculateRetirementTaxRate(annualWithdrawal, socialSecurity = 20000, otherIncome = 5000) {
  const totalRetirementIncome = annualWithdrawal + socialSecurity * 0.85 + otherIncome // 85% of SS is taxable
  return getTaxRate(totalRetirementIncome)
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

  // Calculate optimal switching strategy with realistic Both Accounts approach
  const analysis = useMemo(() => {
    const yearsToRetirement = retirementAge - currentAge
    const monthlyReturn = expectedReturn / 100 / 12

    // Get salary and contribution data
    const getSalaryData = (year) => {
      if (useYearByYear && yearByYearData[year]) {
        return {
          salary: yearByYearData[year].salary,
          contribution: yearByYearData[year].contribution,
        }
      } else {
        return {
          salary: simpleIncome * Math.pow(1 + salaryGrowthRate / 100, year),
          contribution: simpleContribution * Math.pow(1 + salaryGrowthRate / 100, year),
        }
      }
    }

    // Track multiple scenarios
    const scenarios = {
      // Scenario 1: Always Traditional
      alwaysTraditional: { balance: startingBalance },
      // Scenario 2: Always Roth
      alwaysRoth: { balance: startingBalance },
      // Scenario 3: Optimal switching strategy
      switching: {
        traditionalBalance: startingBalance,
        rothBalance: 0,
        currentStrategy: null,
      },
      // Scenario 4: Realistic Both Accounts strategy (like CSV)
      bothAccounts: {
        traditionalBalance: startingBalance,
        rothBalance: 0,
      },
    }

    const yearlyData = []
    const switchPoints = []

    // Calculate year by year
    for (let year = 0; year <= yearsToRetirement; year++) {
      const currentAgeInYear = currentAge + year
      const { salary, contribution } = getSalaryData(year)
      const taxRateThisYear = getTaxRate(salary)
      const monthlyContribution = contribution

      // Determine optimal strategy for switching approach
      const optimalStrategy = taxRateThisYear > retirementTaxRate ? "Traditional" : "Roth"

      // Realistic Both Accounts split (like CSV data)
      let traditionalAmount = 0
      let rothAmount = 0

      // IRA contribution limits (2024: $7,000, or $8,000 if 50+)
      const iraLimit = currentAgeInYear >= 50 ? 8000 : 7000
      const annualContribution = Math.min(monthlyContribution * 12, iraLimit)

      if (salary < 50000) {
        // Low income: Favor Roth (pay taxes when rate is low)
        rothAmount = Math.min(annualContribution, 6000)
        traditionalAmount = annualContribution - rothAmount
      } else if (salary < 100000) {
        // Medium income: Split based on tax advantage
        if (taxRateThisYear > retirementTaxRate + 3) {
          // Traditional advantage
          traditionalAmount = annualContribution * 0.7
          rothAmount = annualContribution * 0.3
        } else {
          // Roth advantage or neutral
          rothAmount = annualContribution * 0.6
          traditionalAmount = annualContribution * 0.4
        }
      } else {
        // High income: Favor Traditional (big tax savings now)
        traditionalAmount = Math.min(annualContribution, 6000)
        rothAmount = annualContribution - traditionalAmount
      }

      // Apply growth and contributions for this year
      if (year > 0) {
        // Always Traditional scenario
        for (let month = 0; month < 12; month++) {
          const preTaxContribution = monthlyContribution / (1 - taxRateThisYear / 100)
          scenarios.alwaysTraditional.balance =
            scenarios.alwaysTraditional.balance * (1 + monthlyReturn) + preTaxContribution
        }

        // Always Roth scenario
        for (let month = 0; month < 12; month++) {
          scenarios.alwaysRoth.balance = scenarios.alwaysRoth.balance * (1 + monthlyReturn) + monthlyContribution
        }

        // Switching scenario
        if (!scenarios.switching.currentStrategy) {
          scenarios.switching.currentStrategy = optimalStrategy
        }

        // Check if we should switch
        if (scenarios.switching.currentStrategy !== optimalStrategy) {
          scenarios.switching.currentStrategy = optimalStrategy
          switchPoints.push({
            age: currentAgeInYear,
            year: 2025 + year,
            switchTo: optimalStrategy,
            reason: `Tax rate: ${taxRateThisYear}% vs retirement: ${retirementTaxRate}%`,
            salary: salary,
            taxRate: taxRateThisYear,
            traditionalBalance: scenarios.switching.traditionalBalance,
            rothBalance: scenarios.switching.rothBalance,
          })
        }

        // Apply contributions for switching strategy
        for (let month = 0; month < 12; month++) {
          scenarios.switching.traditionalBalance = scenarios.switching.traditionalBalance * (1 + monthlyReturn)
          scenarios.switching.rothBalance = scenarios.switching.rothBalance * (1 + monthlyReturn)

          if (scenarios.switching.currentStrategy === "Traditional") {
            const preTaxContribution = monthlyContribution / (1 - taxRateThisYear / 100)
            scenarios.switching.traditionalBalance += preTaxContribution
          } else {
            scenarios.switching.rothBalance += monthlyContribution
          }
        }

        // Apply contributions for Both Accounts strategy (realistic split)
        for (let month = 0; month < 12; month++) {
          scenarios.bothAccounts.traditionalBalance = scenarios.bothAccounts.traditionalBalance * (1 + monthlyReturn)
          scenarios.bothAccounts.rothBalance = scenarios.bothAccounts.rothBalance * (1 + monthlyReturn)

          // Add monthly portions
          const monthlyTraditional = traditionalAmount / 12
          const monthlyRoth = rothAmount / 12
          const preTaxTraditional = monthlyTraditional / (1 - taxRateThisYear / 100)

          scenarios.bothAccounts.traditionalBalance += preTaxTraditional
          scenarios.bothAccounts.rothBalance += monthlyRoth
        }
      } else {
        // Year 0 - set initial strategy
        scenarios.switching.currentStrategy = optimalStrategy
      }

      // Calculate after-tax values for comparison
      const alwaysTraditionalAfterTax = scenarios.alwaysTraditional.balance * (1 - retirementTaxRate / 100)
      const alwaysRothAfterTax = scenarios.alwaysRoth.balance
      const switchingTraditionalAfterTax = scenarios.switching.traditionalBalance * (1 - retirementTaxRate / 100)
      const switchingTotal = switchingTraditionalAfterTax + scenarios.switching.rothBalance
      const bothTraditionalAfterTax = scenarios.bothAccounts.traditionalBalance * (1 - retirementTaxRate / 100)
      const bothTotal = bothTraditionalAfterTax + scenarios.bothAccounts.rothBalance

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

        // Both accounts strategy balances
        bothTraditionalBalance: scenarios.bothAccounts.traditionalBalance,
        bothRothBalance: scenarios.bothAccounts.rothBalance,
        bothTraditionalAfterTax: bothTraditionalAfterTax,

        // Scenario comparisons (after-tax values)
        alwaysTraditional: alwaysTraditionalAfterTax,
        alwaysRoth: alwaysRothAfterTax,
        switchingStrategy: switchingTotal,
        bothAccountsStrategy: bothTotal,

        // Strategy info
        currentStrategy: scenarios.switching.currentStrategy,
        traditionalAmount: traditionalAmount,
        rothAmount: rothAmount,
        contributingTo: scenarios.switching.currentStrategy,
      })
    }

    // Calculate final results
    const finalData = yearlyData[yearlyData.length - 1]
    const strategies = {
      "Always Traditional": finalData.alwaysTraditional,
      "Always Roth": finalData.alwaysRoth,
      "Switching Strategy": finalData.switchingStrategy,
      "Both Accounts Strategy": finalData.bothAccountsStrategy,
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
    desiredRetirementIncome,
    socialSecurityIncome,
    otherRetirementIncome,
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
    newData[yearIndex] = { ...newData[yearIndex], [field]: Number(value) }
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
              <small>Current tax bracket: {getTaxRate(simpleIncome)}%</small>

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
                      <td>{getTaxRate(yearData.salary)}%</td>
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
            <div className="summary-card" style={{ backgroundColor: "#e8f5e9", borderColor: "#4caf50" }}>
              <div className="summary-number">
                ${Math.round(analysis.finalValues["Both Accounts Strategy"] / 1000)}k
              </div>
              <div className="summary-label">Both Accounts Strategy</div>
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
                <Line
                  type="monotone"
                  dataKey="bothAccountsStrategy"
                  stroke="#4caf50"
                  strokeWidth={3}
                  name="Both Accounts Strategy"
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
              <BarChart data={analysis.yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis tickFormatter={() => ""} />
                <Tooltip
                  formatter={(value, name, props) => [
                    `${props.payload.currentStrategy} (Tax: ${props.payload.taxRate}%)`,
                    "Strategy",
                  ]}
                  labelFormatter={(label) => `Age: ${label}`}
                />
                <Bar
                  dataKey={(entry) => (entry.currentStrategy === "Traditional" ? 1 : 0)}
                  stackId="strategy"
                  fill="#FF5733"
                  name="Traditional"
                />
                <Bar
                  dataKey={(entry) => (entry.currentStrategy === "Roth" ? 1 : 0)}
                  stackId="strategy"
                  fill="#2e7d32"
                  name="Roth"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <h4>Switch Points:</h4>
            {analysis.switchPoints.length > 0 ? (
              <div className="switch-points">
                {analysis.switchPoints.map((point, index) => (
                  <div key={index} className="switch-point-item">
                    <div className="switch-point-info">
                      <div className="switch-year">
                        Age {point.age} ({point.year})
                      </div>
                      <div className="switch-strategy">Switch to {point.switchTo}</div>
                      <div style={{ fontSize: "0.8rem", color: "#666" }}>{point.reason}</div>
                    </div>
                    <div className="switch-values">
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

      {/* Both Accounts Strategy Breakdown */}
      <div className="form-box" style={{ marginTop: "2rem" }}>
        <h3 style={{ textAlign: "center" }}>Both Accounts Strategy - Annual Contribution Split</h3>
        <fieldset>
          <div style={{ height: "400px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis.yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`} />
                <Tooltip
                  formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name]}
                  labelFormatter={(label) => `Age: ${label}`}
                />
                <Legend />
                <Bar
                  dataKey="traditionalAmount"
                  stackId="contributions"
                  fill="#FF5733"
                  name="Traditional Contribution"
                />
                <Bar dataKey="rothAmount" stackId="contributions" fill="#2e7d32" name="Roth Contribution" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
            <h4>How the Split Works Each Year:</h4>
            <div style={{ maxHeight: "200px", overflowY: "auto", fontSize: "0.9rem" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#e9ecef" }}>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>Age</th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>Salary</th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>Tax Rate</th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>Traditional</th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>Roth</th>
                    <th style={{ padding: "8px", border: "1px solid #ddd", fontSize: "0.8rem" }}>Logic</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.yearlyData.slice(1, 11).map((year, index) => {
                    let logic = ""
                    if (year.salary < 50000) logic = "Low income → Favor Roth"
                    else if (year.salary < 100000)
                      logic =
                        year.taxRate > retirementTaxRate + 3 ? "Tax advantage → More Traditional" : "Neutral → Balanced"
                    else logic = "High income → Favor Traditional"

                    return (
                      <tr key={index}>
                        <td style={{ padding: "6px", border: "1px solid #ddd" }}>{year.age}</td>
                        <td style={{ padding: "6px", border: "1px solid #ddd" }}>
                          ${(year.salary / 1000).toFixed(0)}k
                        </td>
                        <td style={{ padding: "6px", border: "1px solid #ddd" }}>{year.taxRate}%</td>
                        <td style={{ padding: "6px", border: "1px solid #ddd" }}>
                          ${year.traditionalAmount?.toLocaleString() || "0"}
                        </td>
                        <td style={{ padding: "6px", border: "1px solid #ddd" }}>
                          ${year.rothAmount?.toLocaleString() || "0"}
                        </td>
                        <td style={{ padding: "6px", border: "1px solid #ddd", fontSize: "0.8rem" }}>{logic}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </fieldset>
      </div>

      {/* Retirement Tax Rate Explanation */}
      <div className="form-box" style={{ marginTop: "2rem" }}>
        <h3 style={{ textAlign: "center" }}>Understanding Retirement Tax Rate</h3>
        <fieldset>
          <div style={{ padding: "1rem", backgroundColor: "#fff3e0", borderRadius: "8px" }}>
            <h4>What is "Retirement Tax Rate"?</h4>
            <p>
              <strong>It's NOT zero!</strong> In retirement, you still pay taxes on:
            </p>
            <ul style={{ paddingLeft: "1.5rem" }}>
              <li>
                <strong>Traditional IRA/401k withdrawals</strong> - This is your main retirement income!
              </li>
              <li>
                <strong>Social Security</strong> - Up to 85% is taxable if your income is high enough
              </li>
              <li>
                <strong>Pension income</strong> - Fully taxable
              </li>
              <li>
                <strong>Investment income</strong> - Dividends, capital gains, rental income
              </li>
              <li>
                <strong>Part-time work</strong> - If you work in retirement
              </li>
            </ul>

            <h4 style={{ marginTop: "1rem" }}>Your Retirement Tax Calculation:</h4>
            <div style={{ fontFamily: "monospace", backgroundColor: "#f5f5f5", padding: "1rem", borderRadius: "4px" }}>
              <div>IRA Withdrawals: ${desiredRetirementIncome.toLocaleString()}</div>
              <div>Social Security (85% taxable): ${Math.round(socialSecurityIncome * 0.85).toLocaleString()}</div>
              <div>Other Income: ${otherRetirementIncome.toLocaleString()}</div>
              <div style={{ borderTop: "1px solid #ccc", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
                <strong>
                  Total Taxable Income: $
                  {(desiredRetirementIncome + socialSecurityIncome * 0.85 + otherRetirementIncome).toLocaleString()}
                </strong>
              </div>
              <div>
                <strong>Tax Bracket: {retirementTaxRate}%</strong>
              </div>
            </div>

            <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}>
              <strong>Key Insight:</strong> If your retirement tax rate ({retirementTaxRate}%) is lower than your
              current working tax rate, Traditional IRA will usually win. If it's higher, Roth IRA will usually win.
            </p>
          </div>
        </fieldset>
      </div>

      {/* Both Accounts Strategy Explanation */}
      <div className="form-box" style={{ marginTop: "2rem" }}>
        <h3 style={{ textAlign: "center" }}>How the Both Accounts Strategy Works</h3>
        <fieldset>
          <div style={{ padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
            <h4>Realistic Both Accounts Approach (Like CSV Data):</h4>
            <ul style={{ paddingLeft: "1.5rem" }}>
              <li>
                <strong>Low Income ({"<"}$50k):</strong> $6k Roth + $1k Traditional
                <br />
                <small>Pay taxes now when rate is low</small>
              </li>
              <li>
                <strong>Medium Income ($50k-$100k):</strong> Split based on tax advantage
                <br />
                <small>More Traditional if current rate {">"} retirement rate</small>
              </li>
              <li>
                <strong>High Income ({">"}$100k):</strong> $6k Traditional + $1k Roth
                <br />
                <small>Maximize tax deductions when rate is high</small>
              </li>
            </ul>

            <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}>
              This mirrors real-world CSV data where people adjust their strategy based on their current income and tax
              situation, rather than arbitrary percentages.
            </p>
          </div>
        </fieldset>
      </div>

      {/* Strategy Comparison Explanation */}
      <div className="form-box" style={{ marginTop: "2rem" }}>
        <h3 style={{ textAlign: "center" }}>Strategy Comparison: What's the Difference?</h3>
        <fieldset>
          <div className="recommendation-grid">
            <div className="recommendation-section">
              <h4 style={{ color: "#FF5733" }}>🔄 Switching Strategy</h4>
              <ul style={{ paddingLeft: "1.5rem" }}>
                <li>
                  <strong>One account at a time</strong>
                </li>
                <li>Puts 100% of contributions into whichever is optimal</li>
                <li>Switches completely when tax situation changes</li>
                <li>Example: Traditional until age 45, then switch to 100% Roth</li>
                <li>
                  <strong>Pro:</strong> Always uses the "best" option
                </li>
                <li>
                  <strong>Con:</strong> All-or-nothing approach, no diversification
                </li>
              </ul>
            </div>

            <div className="recommendation-section">
              <h4 style={{ color: "#4caf50" }}>⚖️ Both Accounts Strategy</h4>
              <ul style={{ paddingLeft: "1.5rem" }}>
                <li>
                  <strong>Uses both accounts simultaneously</strong>
                </li>
                <li>Splits contributions based on income level and tax rates</li>
                <li>Adjusts the split percentage each year</li>
                <li>Example: 70% Traditional + 30% Roth when income is high</li>
                <li>
                  <strong>Pro:</strong> Tax diversification, hedge against uncertainty
                </li>
                <li>
                  <strong>Con:</strong> May not be "perfectly" optimal
                </li>
              </ul>
            </div>

            <div className="recommendation-section">
              <h4 style={{ color: "#1976d2" }}>🎯 Why Both Strategies Matter</h4>
              <ul style={{ paddingLeft: "1.5rem" }}>
                <li>
                  <strong>Switching:</strong> Best if you're confident about future tax rates
                </li>
                <li>
                  <strong>Both Accounts:</strong> Best if you want to hedge your bets
                </li>
                <li>Real world: Most people use Both Accounts approach</li>
                <li>Tax laws change, income varies, life happens</li>
                <li>Having both account types gives you flexibility in retirement</li>
              </ul>
            </div>

            <div className="recommendation-section">
              <h4 style={{ color: "#ff9800" }}>📊 What the Charts Show</h4>
              <ul style={{ paddingLeft: "1.5rem" }}>
                <li>
                  <strong>Tax Bracket Chart:</strong> When each strategy makes sense
                </li>
                <li>
                  <strong>Switching Timeline:</strong> Exact ages when to switch
                </li>
                <li>
                  <strong>Both Accounts Split:</strong> How much to put in each account yearly
                </li>
                <li>
                  <strong>Final Values:</strong> Which strategy wins in the end
                </li>
              </ul>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#fff3e0", borderRadius: "8px" }}>
            <h4>💡 Key Insight: Why Traditional Often Wins</h4>
            <p>
              If Traditional is always winning, it means your retirement tax rate ({retirementTaxRate}%) is
              significantly lower than your current working tax rates. This happens when:
            </p>
            <ul style={{ paddingLeft: "1.5rem" }}>
              <li>You plan to withdraw less in retirement than you earn now</li>
              <li>You expect to live in a lower-tax state in retirement</li>
              <li>You have other tax-free income sources (like Roth 401k, HSA, etc.)</li>
            </ul>
            <p>
              <strong>Try this:</strong> Increase your "Desired Annual Retirement Income" to see when Roth becomes
              competitive!
            </p>
          </div>
        </fieldset>
      </div>
    </div>
  )
}

export default DataAnalysis
