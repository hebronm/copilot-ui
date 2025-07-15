import React, { useEffect, useState } from 'react';
import './App.css'; 
function App() {
  const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const fetchEmployees = () => {
      fetch('http://34.217.130.235:8080/employees')
        .then((response) => response.json())
        .then((json) => {
  
          const employeeList = json?._embedded?.employeeList || [];
          setEmployees(employeeList);
          setLoading(false);
          
  
        });
    };
  
    useEffect(() => {
      fetchEmployees();
    }, []);
  
    const addDummyUser = () => {
      const nextId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
      const dummy = {
        id: nextId,
        firstName: "Testing",
        lastName: "Code",
        role: "Debugger",
        name: "Testing Code"
      };
  
      fetch(`http://34.217.130.235:8080/employees/${nextId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dummy)
      }).then(fetchEmployees);
    };
  
    const deleteLastEntry = () => {
      if (employees.length === 0) return;
      const last = employees.reduce((prev, current) => (prev.id > current.id ? prev : current));
  
      fetch(`http://34.217.130.235:8080/employees/${last.id}`, {
        method: 'DELETE'
      }).then(fetchEmployees);
    };

    return (
      
      <div style={{ padding:"2rem", marginTop: '2rem' }}>
        {/* Employees Table (Debugging) */}
        <h3>Employees Table</h3>
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={addDummyUser}>Add Dummy User</button>{' '}
          <button onClick={deleteLastEntry}>Delete Last Entry</button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table border="1" cellPadding="8" cellSpacing="0" width="100%">
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
