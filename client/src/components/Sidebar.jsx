// import React from 'react';

function Sidebar({activeTab, setActiveTab}){
    return (
    <aside className="sidebar">
      <button 
        className={`nav-btn ${activeTab === 'inventory' ? 'active' : ''}`}
        onClick={() => setActiveTab('inventory')}
      >Inventory</button>
      <button 
        className={`nav-btn ${activeTab === 'sales' ? 'active' : ''}`}
        onClick={() => setActiveTab('sales')}
      >
        Sales Report
      </button>
    </aside>
  ); 
};

export default Sidebar;