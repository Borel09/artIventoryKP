
import { useState } from 'react';
import { useInventory } from './hooks/useInventory';
import InventoryRow from './components/InventoryRow';
import TopHeader from './components/TopHeader';
import Sidebar from './components/Sidebar';
import ControlsBar from './components/ControlsBar';
import AddPieceForm from './components/addPieceForm';
import './App.css';
import EditInventorySpreadsheet from './components/EditInventorySpreadsheet';

function App() {
  const { artInventory: initialInventory } = useInventory();

  // State management
  const [localAddedItems, setLocalAddedItems] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleSaveBulkEdits = async (updatedPieces) => {
    try{
      await Promise.all(
        updatedPieces.map(async (piece) => {
          if(!piece._id) return;

          await fetch(`http://localhost:5000/api/artPiece/${piece._id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              title: piece.title,
              sizes: piece.sizes,
            }),
          });
        })
      );

      // setLocalAddedItems(updatedPieces);
      setLocalAddedItems([]);
      setIsEditing(false);
    } catch (error){
      console.error('Error updating inventory:', error);
    }
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
            onAdd={() => {setIsAdding(true); setIsEditing(false);}} 
            onEdit={() => {setIsEditing(true); setIsAdding(false);}}
          />

          {isAdding ? (
            <AddPieceForm 
              onCancel={() => setIsAdding(false)} 
              onSave={handleSavePiece} 
            />
          ) : isEditing ? (
            <EditInventorySpreadsheet 
              pieces = {itemsList}
              searchTerm={searchTerm}
              onCancel={() => setIsEditing(false)}
              onSave={handleSaveBulkEdits}
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