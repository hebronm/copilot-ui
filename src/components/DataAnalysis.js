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

function DataAnalysis() {
  // User input parameters
  const [currentAge, setCurrentAge] = useState(30)
  const [retirementAge, setRetirementAge] = useState(65)
  const [currentIncome, setCurrentIncome] = useState(75000)
  const [monthlyContribution, setMonthlyContribution] = useState(500)
  const [expectedReturn, setExpectedReturn] = useState(7)
  const [currentTaxRate, setCurrentTaxRate] = useState(22)
  const [retirementTaxRate, setRetirementTaxRate] = useState(15)
  const [startingBalance, setStartingBalance] = useState(10000)

  // Calculate optimal switching strategy
  const analysis = useMemo(() => {
    const yearsToRetirement = retirementAge - currentAge
    const monthlyReturn = expectedReturn / 100 / 12
    const preTaxContribution = monthlyContribution / (1 - currentTaxRate / 100)

    // Track multiple scenarios
    const scenarios = {
      // Scenario 1: Always Traditional
      alwaysTraditional: { balance: startingBalance, afterTax: 0 },
      // Scenario 2: Always Roth
      alwaysRoth: { balance: startingBalance },
      // Scenario 3: Optimal switching strategy
      switching: {
        traditionalBalance: startingBalance,
        rothBalance: 0,
        currentStrategy: null,
        switchYear: null,
      },
    }

    const yearlyData = []
    const switchPoints = []

    // Calculate year by year
    for (let year = 0; year <= yearsToRetirement; year++) {
      const currentAgeInYear = currentAge + year

      // For this year, which strategy is optimal if starting fresh?
      const traditionalValue =
        monthlyContribution *
        12 *
        (retirementAge - currentAgeInYear) *
        (1 + expectedReturn / 100) *
        (1 - retirementTaxRate / 100)
      const rothValue = monthlyContribution * 12 * (retirementAge - currentAgeInYear) * (1 + expectedReturn / 100)
      const optimalThisYear = rothValue > traditionalValue ? "Roth" : "Traditional"

      // Apply growth and contributions for this year
      if (year > 0) {
        // Always Traditional scenario
        for (let month = 0; month < 12; month++) {
          scenarios.alwaysTraditional.balance =
            scenarios.alwaysTraditional.balance * (1 + monthlyReturn) + preTaxContribution
        }
        scenarios.alwaysTraditional.afterTax = scenarios.alwaysTraditional.balance * (1 - retirementTaxRate / 100)

        // Always Roth scenario
        for (let month = 0; month < 12; month++) {
          scenarios.alwaysRoth.balance = scenarios.alwaysRoth.balance * (1 + monthlyReturn) + monthlyContribution
        }

        // Switching scenario - follow optimal strategy
        if (!scenarios.switching.currentStrategy) {
          // First year - set initial strategy
          scenarios.switching.currentStrategy = optimalThisYear
        }

        // Check if we should switch
        if (scenarios.switching.currentStrategy !== optimalThisYear && !scenarios.switching.switchYear) {
          scenarios.switching.switchYear = currentAgeInYear
          scenarios.switching.currentStrategy = optimalThisYear
          switchPoints.push({
            age: currentAgeInYear,
            year: 2025 + year,
            switchTo: optimalThisYear,
            traditionalBalance: scenarios.switching.traditionalBalance,
            rothBalance: scenarios.switching.rothBalance,
          })
        }

        // Apply contributions based on current strategy
        for (let month = 0; month < 12; month++) {
          // Traditional balance always grows (even after switch, existing money keeps growing)
          scenarios.switching.traditionalBalance = scenarios.switching.traditionalBalance * (1 + monthlyReturn)
          scenarios.switching.rothBalance = scenarios.switching.rothBalance * (1 + monthlyReturn)

          // Add new contributions based on current strategy
          if (scenarios.switching.currentStrategy === "Traditional") {
            scenarios.switching.traditionalBalance += preTaxContribution
          } else {
            scenarios.switching.rothBalance += monthlyContribution
          }
        }
      } else {
        // Year 0 - set initial strategy
        scenarios.switching.currentStrategy = optimalThisYear
      }

      // Calculate total values for switching strategy
      const switchingTraditionalAfterTax = scenarios.switching.traditionalBalance * (1 - retirementTaxRate / 100)
      const switchingTotal = switchingTraditionalAfterTax + scenarios.switching.rothBalance

      yearlyData.push({
        age: currentAgeInYear,
        year: 2025 + year,

        // Individual account balances
        traditionalBalance: scenarios.switching.traditionalBalance,
        rothBalance: scenarios.switching.rothBalance,
        traditionalAfterTax: switchingTraditionalAfterTax,

        // Scenario comparisons
        alwaysTraditional: scenarios.alwaysTraditional.afterTax,
        alwaysRoth: scenarios.alwaysRoth.balance,
        switchingStrategy: switchingTotal,

        // Strategy info
        currentStrategy: scenarios.switching.currentStrategy,
        optimalThisYear: optimalThisYear,
        isOptimal: scenarios.switching.currentStrategy === optimalThisYear,

        // For chart display
        contributingTo: scenarios.switching.currentStrategy,
      })
    }

    // Calculate final results
    const finalData = yearlyData[yearlyData.length - 1]
    const bestStrategy = Math.max(finalData.alwaysTraditional, finalData.alwaysRoth, finalData.switchingStrategy)
    let recommendation = "Always Traditional"
    if (bestStrategy === finalData.alwaysRoth) recommendation = "Always Roth"
    if (bestStrategy === finalData.switchingStrategy) recommendation = "Switching Strategy"

    return {
      yearlyData,
      switchPoints,
      scenarios,
      recommendation,
      finalValues: {
        alwaysTraditional: finalData.alwaysTraditional,
        alwaysRoth: finalData.alwaysRoth,
        switching: finalData.switchingStrategy,
      },
    }
  }, [
    currentAge,
    retirementAge,
    currentIncome,
    monthlyContribution,
    expectedReturn,
    currentTaxRate,
    retirementTaxRate,
    startingBalance,
  ])

  const resetForm = () => {
    setCurrentAge(30)
    setRetirementAge(65)
    setCurrentIncome(75000)
    setMonthlyContribution(500)
    setExpectedReturn(7)
    setCurrentTaxRate(22)
    setRetirementTaxRate(15)
    setStartingBalance(10000)
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "auto" }}>
      {/* User Input Form */}
      <div className="form-box">
        <h1 style={{ textAlign: "center" }}>Optimal IRA Switching Strategy</h1>
        <p style={{ textAlign: "center", color: "#666" }}>
          Determine when to switch from Traditional to Roth (or vice versa) for maximum retirement value
        </p>

        <fieldset className="thinFieldset">
          <h2 style={{ textAlign: "center" }}>Personal Information</h2>
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
              Current Annual Income: <b>${currentIncome.toLocaleString()}</b>
            </label>
            <input
              type="range"
              min="30000"
              max="200000"
              step="5000"
              value={currentIncome}
              onChange={(e) => setCurrentIncome(Number(e.target.value))}
              className="custom-slider"
              style={getSliderTrackStyle(currentIncome, 30000, 200000)}
            />
          </div>
        </fieldset>

        <fieldset>
          <h2 style={{ textAlign: "center" }}>Investment Parameters</h2>

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

          <label className="label">
            Monthly Contribution: <b>${monthlyContribution.toLocaleString()}</b>
          </label>
          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            className="custom-slider"
            style={getSliderTrackStyle(monthlyContribution, 100, 2000)}
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
            Current Tax Rate: <b>{currentTaxRate}%</b>
          </label>
          <input
            type="range"
            min="10"
            max="37"
            value={currentTaxRate}
            onChange={(e) => setCurrentTaxRate(Number(e.target.value))}
            className="custom-slider"
            style={getSliderTrackStyle(currentTaxRate, 10, 37)}
          />

          <label className="label">
            Expected Retirement Tax Rate: <b>{retirementTaxRate}%</b>
          </label>
          <input
            type="range"
            min="10"
            max="37"
            value={retirementTaxRate}
            onChange={(e) => setRetirementTaxRate(Number(e.target.value))}
            className="custom-slider"
            style={getSliderTrackStyle(retirementTaxRate, 10, 37)}
          />
        </fieldset>

        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <button type="button" className="submit-btn">
            Calculate Switching Strategy
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
              <div className="summary-number">${Math.round(analysis.finalValues.alwaysTraditional / 1000)}k</div>
              <div className="summary-label">Always Traditional</div>
            </div>
            <div className="summary-card roth-card">
              <div className="summary-number">${Math.round(analysis.finalValues.alwaysRoth / 1000)}k</div>
              <div className="summary-label">Always Roth</div>
            </div>
            <div className="summary-card switch-card">
              <div className="summary-number">${Math.round(analysis.finalValues.switching / 1000)}k</div>
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
        <h3 style={{ textAlign: "center" }}>Account Growth with Switching Strategy</h3>
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
                  dataKey="traditionalAfterTax"
                  stroke="#FF5733"
                  strokeWidth={2}
                  name="Traditional IRA Balance (After Tax)"
                />
                <Line type="monotone" dataKey="rothBalance" stroke="#2e7d32" strokeWidth={2} name="Roth IRA Balance" />
                <Line
                  type="monotone"
                  dataKey="switchingStrategy"
                  stroke="#1976d2"
                  strokeWidth={3}
                  name="Total Value (Switching Strategy)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </fieldset>
      </div>

      {/* Strategy Timeline */}
      <div className="form-box" style={{ marginTop: "2rem" }}>
        <h3 style={{ textAlign: "center" }}>Contribution Strategy Timeline</h3>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "1rem" }}>
          Shows which account type you should contribute to each year
        </p>
        <fieldset>
          <div style={{ height: "200px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis.yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" interval={Math.floor(analysis.yearlyData.length / 10)} />
                <YAxis hide />
                <Tooltip
                  formatter={(value, name, props) => {
                    const data = props.payload
                    return [
                      `Contributing to: ${data.contributingTo}`,
                      `Traditional: $${data.traditionalAfterTax.toLocaleString()}`,
                      `Roth: $${data.rothBalance.toLocaleString()}`,
                    ]
                  }}
                  labelFormatter={(label) => `Age: ${label}`}
                />
                <Bar
                  dataKey={(entry) => (entry.contributingTo === "Traditional" ? 1 : 0)}
                  stackId="strategy"
                  fill="#FF5733"
                  name="Contributing to Traditional"
                />
                <Bar
                  dataKey={(entry) => (entry.contributingTo === "Roth" ? 1 : 0)}
                  stackId="strategy"
                  fill="#2e7d32"
                  name="Contributing to Roth"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </fieldset>
      </div>

      {/* Switch Points */}
      {analysis.switchPoints.length > 0 && (
        <div className="form-box" style={{ marginTop: "2rem" }}>
          <h3 style={{ textAlign: "center" }}>Recommended Switch Points</h3>
          <fieldset>
            <div className="switch-points">
              {analysis.switchPoints.map((point, index) => (
                <div key={index} className="switch-point-item">
                  <div className="switch-point-info">
                    <span className="switch-year">
                      Age {point.age} (Year {point.year})
                    </span>
                    <span className="switch-strategy">Switch to contributing to {point.switchTo} IRA</span>
                  </div>
                  <div className="switch-values">
                    <span>Traditional Balance: ${point.traditionalBalance.toLocaleString()}</span>
                    <span>Roth Balance: ${point.rothBalance.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      )}

      {/* Strategy Explanation */}
      <div className="form-box" style={{ marginTop: "2rem" }}>
        <h3 style={{ textAlign: "center" }}>How the Switching Strategy Works</h3>
        <fieldset>
          <div style={{ padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
            <h4>The Strategy:</h4>
            <ol style={{ paddingLeft: "1.5rem" }}>
              <li>
                <strong>Early Years:</strong> Contribute to whichever type is optimal based on current vs. future tax
                rates
              </li>
              <li>
                <strong>Switch Point:</strong> When conditions change, switch your NEW contributions to the other type
              </li>
              <li>
                <strong>Keep Both:</strong> Your old account keeps growing, new contributions go to the optimal account
              </li>
              <li>
                <strong>Retirement:</strong> You have BOTH Traditional and Roth money for tax diversification
              </li>
            </ol>

            <h4 style={{ marginTop: "1.5rem" }}>Why This Works:</h4>
            <ul style={{ paddingLeft: "1.5rem" }}>
              <li>Maximizes the tax advantages of each account type when they're most beneficial</li>
              <li>Provides tax diversification in retirement</li>
              <li>Adapts to changing tax situations over your career</li>
              <li>Often outperforms sticking to just one account type</li>
            </ul>
          </div>
        </fieldset>
      </div>
    </div>
  )
}

export default DataAnalysis
