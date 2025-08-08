import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../CSS_Files/ClientDetail.css';

function ClientDetail() {
  const { id } = useParams();

  // Dummy client data (replace with backend fetch later)
  const dummyClient = {
    1: {
      name: 'John Doe',
      age: 45,
      assets: '$500,000',
      overview: 'John is a long-term investor with a diversified portfolio.',
    },
    2: {
      name: 'Jane Smith',
      age: 37,
      assets: '$750,000',
      overview: 'Jane focuses on sustainable and ESG investing strategies.',
    },
  };

  const client = dummyClient[id];

  // Tab management
  const tabs = ['Overview', 'Calculators', 'Investments', 'Retirement'];
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    // Later: Fetch client data from API using ID
  }, [id]);

/* Do like some backend API call like this later on
useEffect(() => {
  fetch(`/api/clients/${id}`)
    .then(res => res.json())
    .then(data => setClient(data));
}, [id]);
 */


  return (
    <div className="client-detail">
      {/* Header Section */}
      <div className="client-header">
        <h1>Client Details</h1>
        <p>
          Comprehensive view of client information and financial planning tools.
        </p>
      </div>

      {/* Navigation Tabs */}
      <nav className="client-nav">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'Overview' && (
          <div>
            <h2>{client.name}</h2>
            <p>Age: {client.age}</p>
            <p>Total Assets: {client.assets}</p>
            <p>{client.overview}</p>
          </div>
        )}
        {activeTab !== 'Overview' && (
          <p>{activeTab} content goes here (placeholder)</p>
        )}
      </div>
    </div>
  )










}

export default ClientDetail