"use client"

import { useEffect, useState } from "react"

function EmployeeTable() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const jwtToken = localStorage.getItem("jwtToken")

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("http://34.217.130.235:8080/employees", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${jwtToken}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      const employeeList = json?._embedded?.employeeList || []
      setEmployees(employeeList)
    } catch (err) {
      setError("Failed to fetch employees. The server might be unavailable.")
      console.error("Error fetching employees:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const addDummyUser = async () => {
    try {
      const nextId = employees.length > 0 ? Math.max(...employees.map((e) => e.id)) + 1 : 1
      const dummy = {
        id: nextId,
        firstName: "Testing",
        lastName: "Code",
        role: "Debugger",
        name: "Testing Code",
      }

      const response = await fetch(`http://34.217.130.235:8080/employees/${nextId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`
        },
        body: JSON.stringify(dummy),
      })

      if (response.ok) {
        await fetchEmployees()
      } else {
        throw new Error("Failed to add employee")
      }
    } catch (err) {
      setError("Failed to add employee")
      console.error("Error adding employee:", err)
    }
  }

  const deleteLastEntry = async () => {
    try {
      if (employees.length === 0) return
      const last = employees.reduce((prev, current) => (prev.id > current.id ? prev : current))

      const response = await fetch(`http://34.217.130.235:8080/employees/${last.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${jwtToken}`
        }
      })

      if (response.ok) {
        await fetchEmployees()
      } else {
        throw new Error("Failed to delete employee")
      }
    } catch (err) {
      setError("Failed to delete employee")
      console.error("Error deleting employee:", err)
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "auto" }}>
      <div className="form-box">
        <h1 style={{ textAlign: "center" }}>Employee Management</h1>
        <p style={{ textAlign: "center", color: "#666" }}>
          Manage employee records with CRUD operations ({employees.length} employees)
        </p>

        {error && (
          <div className="error-message" style={{ marginBottom: "1rem" }}>
            <p style={{ color: "#d32f2f" }}>{error}</p>
          </div>
        )}

        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          <button className="submit-btn" onClick={addDummyUser} disabled={loading}>
            Add Dummy User
          </button>
          <button
            className="reset-btn"
            onClick={deleteLastEntry}
            disabled={loading || employees.length === 0}
            style={{ marginLeft: "1rem" }}
          >
            Delete Last Entry
          </button>
          <button
            className="submit-btn"
            onClick={fetchEmployees}
            disabled={loading}
            style={{ marginLeft: "1rem", backgroundColor: "#6c757d" }}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div className="loading-spinner"></div>
            <p>Loading employees...</p>
          </div>
        ) : (
          <fieldset>
            <table border="1" cellPadding="8" cellSpacing="0" width="100%" className="employee-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Role</th>
                  <th>Full Name</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
                      No employees found
                    </td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr key={emp.id}>
                      <td style={{ fontWeight: "bold" }}>{emp.id}</td>
                      <td>{emp.firstName}</td>
                      <td>{emp.lastName}</td>
                      <td>
                        <span className="role-badge">{emp.role}</span>
                      </td>
                      <td>{emp.name}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </fieldset>
        )}
      </div>
    </div>
  )
}

export default EmployeeTable
