import React from "react"

import '../CSS_Files/Dashboard.css';
import { useNavigate } from 'react-router-dom';


function Dashboard() {
  const navigate = useNavigate()

  const clients = [
    { id: 1, name: 'John Doe', age: 45, assets: '$500,000' },
    { id: 2, name: 'Jane Smith', age: 37, assets: '$750,000' },
    { id: 3, name: 'Mike Johnson', age: 29, assets: '$320,000' },
  ];

  const handleViewClick = (clientId) => {
    navigate(`/client/$(clientId)`)
  }


  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's an overview of your client portfolio.</p>
      </header>

      {/* Top Boxes */}

      {/*Need to work on this properly later on
      Show: 
      - Total Clients
      - Assets Under Management
      - 2 other free boxes (Real Estate Investment, Retirement Accts)
      - Maybe avg age and avg income or maybe upcoming birthdays
       */}

      <div className="top-boxes">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="top-box">
            {num}
          </div>
        ))}
      </div>

      {/* Clients Section */}
      <div className="clients-section">
        <div className="clients-header">
          <h2>Clients</h2>

          {/* Need to implement this button function later*/}

          <button className="add-client-btn">Add Client</button>
        </div>

        <table className="clients-table">
            
            {/*Need to rework the spacing of the table */}

          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Total Assets</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.age}</td>
                <td>{client.assets}</td>
                <td>
                  <button 
                    className="view-btn"
                    onClick={() => handleViewClick(client.id)}
                    >
                    View
                  </button>
                  <button
                    className="delete-btn"

                    // implement this function later
                    //onClick={() => handleDeleteClick(client.id)}

                    >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
