import { useState } from 'react';

function Sidebar({ activeTab, setActiveTab }){
  const [isSalesDropdownOpen, setIsSalesDropdownOpen] = useState(false);

  return (
    <aside className="sidebar">
      <button 
        className={`nav-btn ${activeTab === 'inventory' ? 'active' : ''}`}
        onClick={() => setActiveTab('inventory')}
      >
        Inventory
      </button>

      <div 
        className="sidebar-dropdown-container"
        onMouseEnter={() => setIsSalesDropdownOpen(true)}
        onMouseLeave={() => setIsSalesDropdownOpen(false)}
      >
        <button 
          className={`nav-btn ${activeTab.startsWith('sales') ? 'active' : ''}`}
          onClick={() => setIsSalesDropdownOpen(prev => !prev)}
        >
          <span>Sales Report</span>
          <span className={`arrow ${isSalesDropdownOpen ? 'open' : ''}`}>▼</span>
        </button>

        {isSalesDropdownOpen && (
          <div className="sidebar-dropdown-menu">
            <button 
              className="sidebar-sub-item"
              onClick={() => setActiveTab('sales-log-item')}
            >
              Log Item Sold
            </button>
            <button 
              className="sidebar-sub-item"
              onClick={() => setActiveTab('sales-daily-log')}
            >
              View Daily Sales Log
            </button>
            <button 
              className="sidebar-sub-item"
              onClick={() => setActiveTab('sales-review-eod')}
            >
              Review EOD Shift Report
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;