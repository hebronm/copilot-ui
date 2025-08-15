"use client"

import { useState, useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

import "../CSS_Files/IRACalculator.css"

function getSliderTrackStyle(value, min = 0, max = 100) {
  const percent = ((value - min) / (max - min)) * 100
  return {
    background: `linear-gradient(to right, #4caf50 ${percent}%, #ccc ${percent}%)`,
  }
}

function IRACalculator() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [birthday, setBirthday] = useState("")
  const [ageRange, setAgeRange] = useState([25, 65])
  const [startingBalance, setStartingBalance] = useState(0)
  const [monthlyContribution, setMonthlyContribution] = useState(500)
  const [annualReturn, setAnnualReturn] = useState(10)
  const [currentTaxRate, setCurrentTaxRate] = useState(22)
  const [retirementTaxRate, setRetirementTaxRate] = useState(15)

  const resetForm = () => {
    setFirstName("")
    setLastName("")
    setEmail("")
    setPhone("")
    setBirthday("")
    setAgeRange([25, 65])
    setStartingBalance(0)
    setMonthlyContribution(500)
    setAnnualReturn(10)
    setCurrentTaxRate(22)
    setRetirementTaxRate(15)
  }

  const chartData = useMemo(() => {
    const startYear = 2025
    const yearsToRetire = ageRange[1] - ageRange[0]
    const monthsPerYear = 12
    const currentYear = new Date().getFullYear()

    const effectiveTaxedAnnualReturn = annualReturn * (1 - currentTaxRate / 100)
    const monthlyReturn = annualReturn / 100 / monthsPerYear
    const monthlyTaxedReturn = effectiveTaxedAnnualReturn / 100 / monthsPerYear

    const preTaxMonthlyContribution = monthlyContribution / (1 - currentTaxRate / 100)

    let generalBalance = startingBalance
    let rothBalance = startingBalance
    let deductibleBalance = startingBalance
    let nonDeductibleBalance = startingBalance
    let nonDeductibleTotalContributions = 0

    const dataPoints = []

    dataPoints.push({
      year: startYear,
      generalBalance,
      rothBalance,
      deductibleBalance,
      nonDeductibleBalance,
    })

    for (let year = 1; year <= yearsToRetire; year++) {
      for (let month = 0; month < monthsPerYear; month++) {
        generalBalance = generalBalance * (1 + monthlyTaxedReturn)
        generalBalance += monthlyContribution

        rothBalance = rothBalance * (1 + monthlyReturn)
        rothBalance += monthlyContribution

        deductibleBalance = deductibleBalance * (1 + monthlyReturn)
        deductibleBalance += preTaxMonthlyContribution

        nonDeductibleBalance = nonDeductibleBalance * (1 + monthlyReturn)
        nonDeductibleBalance += monthlyContribution
        nonDeductibleTotalContributions += monthlyContribution
      }

      const deductibleAfterTax = deductibleBalance * (1 - retirementTaxRate / 100)
      const nonDeductibleAfterTax =
        nonDeductibleBalance - (nonDeductibleBalance - nonDeductibleTotalContributions) * (retirementTaxRate / 100)

      dataPoints.push({
        year: currentYear + year,
        generalBalance,
        rothBalance,
        deductibleBalance: deductibleAfterTax,
        nonDeductibleBalance: nonDeductibleAfterTax,
      })
    }

    return dataPoints
  }, [ageRange, startingBalance, monthlyContribution, annualReturn, currentTaxRate, retirementTaxRate])

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "auto" }}>
      <form className="ira-form-box">
        <h1 style={{ textAlign: "center" }}>IRA Calculator Tool</h1>
        <br />

        <fieldset className="ira-field">
          <h2 style={{ textAlign: "center" }}>Basic Information</h2>
          <div className="ira-center-container">
            <label className="Box1Label">First Name:</label>
            <input className="ira-input" type="text" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />

            <label className="Box1Label">Last Name:</label>
            <input className="ira-input" type="text" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />

            <label className="Box1Label">Email:</label>
            <input
              className="ira-input" 
              type="email"
              placeholder="JohnDoe@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="Box1Label">Phone Number:</label>
            <input className="ira-input" type="tel" placeholder="(123) 456-7890" value={phone} onChange={(e) => setPhone(e.target.value)} />

            <label className="Box1Label">Birthday:</label>
            <input className="ira-input" type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
          </div>
        </fieldset>

        <fieldset className="ira-field">
          <h2 style={{ textAlign: "center" }}>Financial Information</h2>

          <label className="ira-label">
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

          <label className="ira-label" style={{ marginTop: "20px" }}>
            Target Retirement Age: <b>{ageRange[1]}</b>
          </label>
          <input
            type="range"
            min="18"
            max="85"
            value={ageRange[1]}
            onChange={(e) => setAgeRange([ageRange[0], Math.max(Number(e.target.value), ageRange[0])])}
            className="custom-slider"
            style={getSliderTrackStyle(ageRange[1], 18, 85)}
          />
          <small className="ira-note">Adjust to your current age and target retirement age</small>

          <label className="ira-label">
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
          <small className="ira-note">${startingBalance.toLocaleString()} / $100k</small>

          <label className="ira-label">
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
          <small className="ira-note">Note: This is the amount of "After-Tax" money you're willing to put in monthly</small>

          <label className="ira-label">
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
          <small className="ira-note">Historically, a rough estimate for 30 years would show a 10-12% return</small>

          <label className="ira-label">
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

          <label className="ira-label">
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

        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <button type="button" className="ira-submit-btn">
            Calculate
          </button>
          <button type="button" className="ira-reset-btn" onClick={resetForm}>
            Reset Form
          </button>
        </div>
      </form>

      <div className="ira-form-box" style={{ marginTop: "2rem" }}>
        <h3 style={{ textAlign: "center" }}>Estimated Account Value Graph</h3>
        <fieldset className="ira-field">
          <div style={{ height: "500px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" tickFormatter={(year) => String(year)} />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name]}
                  labelFormatter={(label) => `Year: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="generalBalance"
                  stroke="#1976d2"
                  strokeWidth={2}
                  name="General (Taxable)"
                />
                <Line type="monotone" dataKey="rothBalance" stroke="#2e7d32" strokeWidth={2} name="Roth IRA" />
                <Line
                  type="monotone"
                  dataKey="deductibleBalance"
                  stroke="#FF5733"
                  strokeWidth={2}
                  name="Traditional IRA"
                />
                <Line
                  type="monotone"
                  dataKey="nonDeductibleBalance"
                  stroke="#8F1A96"
                  strokeWidth={2}
                  name="Non-Deductible IRA"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </fieldset>
      </div>
    </div>
  )
}

export default IRACalculator
