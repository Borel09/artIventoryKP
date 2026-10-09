import { useInventory } from './hooks/useInventory';
import InventoryRow from './components/InventoryRow';
import React, {useState} from 'react';
import './App.css';

//component import
import TopHeader from './components/TopHeader';
import Sidebar from './components/Sidebar';
import ControlsBar from './components/ControlsBar';


function App() {
  // Grab our data using our isolated custom hook logic
  const { artInventory } = useInventory();
  //State hooks for active tab and search
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState('');

  //filter inventory based on search term
  const filteredInventory = artInventory?.filter((item) => 
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
 return (
  <div className="app-container">
    {/* Top Header */}
    <TopHeader userName="User" />
    
    {/* Main Body: Left Sidebar + Right Content Area */}
    <div className="main-layout">
      {/* Left Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab}/>
      {/* Right Content Area */}
      <main className="content-area">
        {/* Top Controls Bar */}
        <ControlsBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        {/* Inventory List Box */}
        <div className="masterInvContainer">
          <h2>UI Component-Driven Inventory Spreadsheet</h2>

          <div className="table-wrapper">
            <div className="table-header">
              <div>Image Preview</div>
              <div>Piece Title</div>
              <div className="text-right">On-Hand Count</div>
            </div>

            {/* {artInventory.map((item) => (
              <InventoryRow key={item._id} item={item} />
            ))} */}
            {filteredInventory?.map((item) => 
              <InventoryRow key={item.id || item.id} item={item}/>
            )}
          </div>
        </div>
      </main>
    </div>
  </div>
  );
}

export default App;
