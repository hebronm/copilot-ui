import React, { useState, useEffect } from "react";
import '../CSS_Files/Dashboard.css';
import { useNavigate } from 'react-router-dom';

import { FaUser, FaPiggyBank, FaMoneyBillWave, FaBirthdayCake } from "react-icons/fa";


function Dashboard() {
  const navigate = useNavigate()

  /*const clients = [
    { id: 1, name: 'John Doe', age: 45, assets: '$500,000' },
    { id: 2, name: 'Jane Smith', age: 37, assets: '$750,000' },
    { id: 3, name: 'Mike Johnson', age: 29, assets: '$320,000' },
  ];
  */
   
  const [clients, setClients] = useState([]);
  const [upcomingBirthday, setUpcomingBirthday] = useState("N/A");
  const [upcomingBirthdayName, setUpcomingBirthdayName] = useState("");

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
    fetch("http://34.217.130.235:8080/clients",
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${jwtToken}`
        }
      }
    )
      .then(res => {
        // alert("response status: " + res.status);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then(json => {
        // If backend wraps payload under _embedded.clientList
        console.log("Fetched clients JSON:", json);
        // const list = json?._embedded?.clientList || json || [];
          const list = Array.isArray(json?._embedded?.clientList)
            ? json._embedded.clientList
            : [];
        console.log("List we’re setting to clients:", list);
        setClients(list);
        findUpcomingBirthday(list);
      })
      .catch(err => {
        console.error("Failed to fetch clients:", err);
      })

    } else {
      alert("No JWT token found in local storage");
    }
  }, []);

  const handleViewClick = (clientId) => {
    navigate(`/client/${clientId}`)
  }

  const handleDeleteClick = (clientId) => {
    console.log("Delete clicked for client id:", clientId);

    //confirm prompt user
    const confirmDelete = window.confirm(
      "You are about to delete a client. Deleted client information cannot be recovered. Are you sure?"
    );
    if (!confirmDelete) return;

    //backend call
    fetch(`http://34.217.130.235:8080/clients/${clientId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
      }
    })
    .then((res) => {
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      //update UI by removing the deleted client
      setClients((prev) => prev.filter((client) => client.id !== clientId));

      //success/fail message
      alert("Client deletion successful!");
    })
    .catch((err) => {
      console.error("Failed to delete client:", err);
      alert("An error occurred while deleting the client. Please wait and try again later.");
    });
  };

  const handleAddClientClick = () => {
    navigate('/newClient');
  };

  /* calculations for the top boxes */
  const totalClients = clients.length;
  // alert("clients: " + JSON.stringify(clients));
  const totalAssets = clients.reduce((sum, c) => {
    const assets = (c.totalSavings || 0) + (c.rothIRABalance || 0) + (c.traditionalIRABalance || 0);
    const debt = c.totalDebt || 0;
    return sum + (assets - debt);
  }, 0);


  // Average income (use first entry if it's an array)
  const avgIncome =
    clients.length > 0
      ? clients.reduce((sum, c) => {
          const first = Array.isArray(c.annualIncome)
            ? c.annualIncome[0]
            : c.annualIncome;
          const n = Number(first);
          return sum + (Number.isFinite(n) ? n : 0);
        }, 0) / clients.length
      : 0;

  //Format w/ 2 dec place and commas
  const avgIncomeDisplay = `$${(
    Math.round(avgIncome * 100) / 100
  ).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;


  
  //find upcoming b-day
  const findUpcomingBirthday = (clientsList) => {
    if (!clientsList.length) return;

    const today = new Date();
    let soonestClient = null;
    let soonestDate = null;

    clientsList.forEach(client => {
      if (!client.birthdate) return; //skip if no birthdate

      const [, month, day] = client.birthdate.split("-").map(Number);

      //Create this year's birthday
      let nextBirthday = new Date(today.getFullYear(), month - 1, day);

      //if birthday has already passed this year, roll over to next year
      if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
      }

      //Compare & find closest
      if (
        soonestDate === null ||
        nextBirthday < soonestDate
      ) {
        soonestDate = nextBirthday;
        soonestClient = client;
      }
    });

    if (soonestDate && soonestClient) {
      // format MM/DD/YYYY
      const formattedDate = `${String(soonestDate.getMonth() + 1).padStart(2, "0")}/${String(soonestDate.getDate()).padStart(2, "0")}/${soonestDate.getFullYear()}`;
      setUpcomingBirthday(formattedDate);

      //set fullname
      setUpcomingBirthdayName(`${soonestClient.firstName} ${soonestClient.lastName}`);
    }
  };


  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's an overview of your client portfolio.</p>
      </header>

      {/*
      Top boxes Show: 
      - Total Clients
      - Assets Under Management
      - 2 other free boxes (Real Estate Investment, Retirement Accts)
      - Maybe avg age and avg income or maybe upcoming birthdays temporarily
       */}

      {/* Top Boxes */}
      <div className="top-boxes">
        {/* Box 1 */}
        <div className="top-box">
          <div className="box-header">
            <span>Total Clients</span>
            <FaUser />
          </div>
          <div className="box-value">{totalClients}</div>
        </div>

        {/* Box 2 */}
        <div className="top-box">
          <div className="box-header">
            <span>Assets Under Management</span>
            <FaPiggyBank />
          </div>
          <div className="box-value">${totalAssets.toLocaleString()}</div>
        </div>

        {/* Box 3 */}
        <div className="top-box">
          <div className="box-header">
            <span>Average Income</span>
            <FaMoneyBillWave />
          </div>
          <div className="box-value">{avgIncomeDisplay}</div>
          {/*<small className="box-note">Box may change in future update</small>*/}
        </div>

        {/* Box 4 */}
        <div className="top-box">
          <div className="box-header">
            <span>Upcoming Birthday</span>
            <FaBirthdayCake />
          </div>
          <div className="box-value">{upcomingBirthday}</div>
          <small className="box-note">{upcomingBirthdayName}</small>
        </div>
      </div>


      {/* Clients Section */}
      <div className="clients-section">
        <div className="clients-header">
          <h2>Clients</h2>
          <button className="add-client-btn" onClick={handleAddClientClick}>
            Add Client
          </button>
        </div>

        <table className="clients-table">
            
            {/*TODO: see if can rework the spacing of the table */}

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
                      <div className="table-btn-group">
                        <button className="view-btn" onClick={() => handleViewClick(client.id)}>
                          View
                        </button>
                        <button className="delete-btn" onClick={() => handleDeleteClick(client.id)}>
                          Delete
                        </button>
                      </div>
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
