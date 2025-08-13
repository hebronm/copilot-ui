"use client";

import React, { useState, useEffect } from "react";

function ClientDebugTable() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://34.217.130.235:8080/clients");
      const json = await response.json();

      const clientList = json?._embedded?.clientList || [];
      setClients(clientList);
    } catch (err) {
      console.error("Error fetching clients:", err);
      alert("Error fetching clients. Check CORS or server availability.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const addDummyUser1 = async () => {
    const dummy1 = {
      firstName: "TestFirstName",
      lastName: "TestLastName",
      age: 10,
      birthdate: "01/01/2000",
      email: "dummy1@mail.com",
      phoneNumber: "1234567890",
      address: "1234 Random St, San Francisco, CA 12345",
      occupation: "testONE",
      annualIncome: [50],
      targetRetirementAge: 50,
      monthlyContribution: [100],
      desiredAnnualRetirementIncome: 9999,
      annualSalaryGrowth: 1.1,
      financialGoals: "be a test",
      totalSavings: 1,
      totalDebt: 1234,
      rothIRABalance: 5,
      traditionalIRABalance: 4,
      advisor: null,
    };

    try {
      await fetch("http://34.217.130.235:8080/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dummy1),
      });
      fetchClients();
    } catch (err) {
      console.error("Error adding Dummy User #1:", err);
      alert("Failed to add Dummy User #1");
    }
  };

  const addDummyUser2 = async () => {
    const dummy2 = {
      firstName: "Dummy",
      lastName: "Two",
      age: 50,
      birthdate: "12/12/9999",
      email: "dummy2@mail.com",
      phoneNumber: "0987654321",
      address: "1111 Random St, San Francisco, CA 11111",
      occupation: "testTWO",
      annualIncome: [50, 5000, 50],
      targetRetirementAge: 100,
      monthlyContribution: [100, 200, 300],
      desiredAnnualRetirementIncome: 100,
      annualSalaryGrowth: 50.5,
      financialGoals: "array testing",
      totalSavings: 33,
      totalDebt: 66,
      rothIRABalance: 10,
      traditionalIRABalance: 77,
      advisor: null,
    };

    try {
      await fetch("http://34.217.130.235:8080/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dummy2),
      });
      fetchClients();
    } catch (err) {
      console.error("Error adding Dummy User #2:", err);
      alert("Failed to add Dummy User #2");
    }
  };

  const deleteLastEntry = async () => {
    if (!clients.length) return;

    const last = clients.reduce((p, c) => (p.id > c.id ? p : c));

    try {
      await fetch(`http://34.217.130.235:8080/clients/${last.id}`, {
        method: "DELETE",
      });
      fetchClients();
    } catch (err) {
      console.error("Error deleting last client:", err);
      alert("Failed to delete last entry");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "auto" }}>
      <h2>Client Debug Table</h2>
      <p>Records from backend ({clients.length} entries)</p>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={addDummyUser1} disabled={loading}>Add Dummy User #1</button>
        <button onClick={addDummyUser2} disabled={loading} style={{ marginLeft: "0.5rem" }}>Add Dummy User #2</button>
        <button onClick={deleteLastEntry} disabled={loading} style={{ marginLeft: "0.5rem" }}>Delete Last Entry</button>
        <button onClick={fetchClients} disabled={loading} style={{ marginLeft: "0.5rem" }}>
          {loading ? "Loading..." : "Refresh"}
        </button>
        <button onClick={() => window.location.href = "/"} style={{ marginLeft: "0.5rem" }}>
          ← Back to Dashboard
        </button>
      </div>

      {loading ? (
        <p>Loading clients...</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0" width="100%">
          <thead>
            <tr>
              <th>id</th><th>firstName</th><th>lastName</th><th>age</th>
              <th>birthdate</th><th>email</th><th>phoneNumber</th><th>address</th>
              <th>occupation</th><th>annualIncome</th><th>targetRetirementAge</th><th>monthlyContribution</th>
              <th>desiredAnnualRetirementIncome</th><th>annualSalaryGrowth</th><th>financialGoals</th>
              <th>totalSavings</th><th>totalDebt</th><th>rothIRABalance</th><th>traditionalIRABalance</th><th>advisor</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan="20" style={{ textAlign: "center" }}>No clients found.</td>
              </tr>
            ) : clients.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.firstName}</td>
                <td>{c.lastName}</td>
                <td>{c.age}</td>
                <td>{c.birthdate}</td>
                <td>{c.email}</td>
                <td>{c.phoneNumber}</td>
                <td>{c.address}</td>
                <td>{c.occupation}</td>
                <td>{Array.isArray(c.annualIncome) ? c.annualIncome.join(", ") : c.annualIncome}</td>
                <td>{c.targetRetirementAge}</td>
                <td>{Array.isArray(c.monthlyContribution) ? c.monthlyContribution.join(", ") : c.monthlyContribution}</td>
                <td>{c.desiredAnnualRetirementIncome}</td>
                <td>{c.annualSalaryGrowth}</td>
                <td>{c.financialGoals}</td>
                <td>{c.totalSavings}</td>
                <td>{c.totalDebt}</td>
                <td>{c.rothIRABalance}</td>
                <td>{c.traditionalIRABalance}</td>
                <td>{c.advisor ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ClientDebugTable;
