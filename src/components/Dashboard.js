import React, { useState, useEffect } from "react";
import '../CSS_Files/Dashboard.css';
import { useNavigate } from 'react-router-dom';


function Dashboard() {
  const navigate = useNavigate()

  /*const clients = [
    { id: 1, name: 'John Doe', age: 45, assets: '$500,000' },
    { id: 2, name: 'Jane Smith', age: 37, assets: '$750,000' },
    { id: 3, name: 'Mike Johnson', age: 29, assets: '$320,000' },
  ];
  */
   
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetch("http://34.217.130.235:8080/clients")
      .then(res => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then(json => {
        // If backend wraps payload under _embedded.clientList
        const list = json?._embedded?.clientList || json || [];
        setClients(list);
      })
      .catch(err => {
        console.error("Failed to fetch clients:", err);
      });
  }, []);

  const handleViewClick = (clientId) => {
    navigate(`/client/${clientId}`)
  }

  const handleDeleteClick = (clientId) => {
    //TODO: implement deletion here
    console.log("Delete clicked for client id:", clientId);
  };

  const handleAddClientClick = () => {
    navigate('/newClient');
  };


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

          <button className="add-client-btn" onClick={handleAddClientClick}>
            Add Client
          </button>
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
            {/*if no clients, show message*/}
            {clients.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", color: "#888" }}>
                  No clients found.
                </td>
              </tr>
            ) : (
              clients.map(client => {
                //handle missing name and age
                const name = `${client.firstName || "Unknown"} ${client.lastName || ""}`.trim();
                const age = client.age ?? "N/A";

                //calc total assets with fallback values; need to update this later on
                const totalAssets =
                  ((client.totalSavings || 0) +
                    (client.rothIRABalance || 0) +
                    (client.traditionalIRABalance || 0)) -
                  (client.totalDebt || 0);

                return (
                  <tr key={client.id}>
                    <td>{name}</td>
                    <td>{age}</td>
                    <td>${totalAssets.toLocaleString()}</td> {/* 🔧 Format number */}
                    <td>
                      <button className="view-btn" onClick={() => handleViewClick(client.id)}>
                        View
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteClick(client.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Dashboard;
