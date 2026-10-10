// import { useInventory } from './hooks/useInventory';
// import InventoryRow from './components/InventoryRow';
// import {useState} from 'react';
// import './App.css';

// //component import
// import TopHeader from './components/TopHeader';
// import Sidebar from './components/Sidebar';
// import ControlsBar from './components/ControlsBar';
// import AddPieceForm from './components/addPieceForm';


// function App() {
//   // Grab our data using our isolated custom hook logic
//   const { artInventory } = useInventory();
//   //State hooks for active tab and search
//   const [activeTab, setActiveTab] = useState('inventory');
//   const [searchTerm, setSearchTerm] = useState('');
//   //const [isAdding, setIsAdding] = useState(false);





//   //filter inventory based on search term
//   const filteredInventory = artInventory?.filter((item) => 
//     item.title?.toLowerCase().includes(searchTerm.toLowerCase())
//   );
 
//  return (
//   <div className="app-container">
//     {/* Top Header */}
//     <TopHeader userName="User" />
    
//     {/* Main Body: Left Sidebar + Right Content Area */}
//     <div className="main-layout">
//       {/* Left Sidebar */}
//       <Sidebar activeTab={activeTab} setActiveTab={setActiveTab}/>
//       {/* Right Content Area */}
//       <main className="content-area">
//         {/* Top Controls Bar */}
//         <ControlsBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
//         {/* Inventory List Box */}
//         <div className="masterInvContainer">
//           <h2>UI Component-Driven Inventory Spreadsheet</h2>

//           <div className="table-wrapper">
//             <div className="table-header">
//               <div>Image Preview</div>
//               <div>Piece Title</div>
//               <div className="text-right">On-Hand Count</div>
//             </div>

//             {/* {artInventory.map((item) => (
//               <InventoryRow key={item._id} item={item} />
//             ))} */}
//             {filteredInventory?.map((item) => 
//               <InventoryRow key={item.id || item.id} item={item}/>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   </div>
//   );
// }

// export default App;
import { useState } from 'react';
import { useInventory } from './hooks/useInventory';
import InventoryRow from './components/InventoryRow';
import TopHeader from './components/TopHeader';
import Sidebar from './components/Sidebar';
import ControlsBar from './components/ControlsBar';
import AddPieceForm from './components/addPieceForm';
import './App.css';

function App() {
  const { artInventory: initialInventory } = useInventory();

  // State management
  const [localAddedItems, setLocalAddedItems] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Combine fetched items with locally added items
  const itemsList = [...localAddedItems, ...(initialInventory || [])];

  // Filter items based on search input
  const filteredInventory = itemsList?.filter((item) => 
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSavePiece = (newPiece) => {
    setLocalAddedItems((prev) => [newPiece, ...prev]);
    setIsAdding(false);
  };

  return (
    <div className="app-container">
      <TopHeader userName="User" />
      
      <div className="main-layout">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="content-area">
          <ControlsBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            onAdd={() => setIsAdding(true)} 
          />

          {isAdding ? (
            <AddPieceForm 
              onCancel={() => setIsAdding(false)} 
              onSave={handleSavePiece} 
            />
          ) : (
            <div className="masterInvContainer">
              <h2>UI Component-Driven Inventory Spreadsheet</h2>

              <div className="table-wrapper">
                {/* Updated table header with separate columns for each size variant */}
                <div className="table-header">
                  <div>Image Preview</div>
                  <div>Piece Title</div>
                  <div>5x7 (S)</div>
                  <div>8x10 (M)</div>
                  <div className="text-right">11x14 (L)</div>
                </div>

                {filteredInventory?.map((item) => (
                  <InventoryRow key={item._id || item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;