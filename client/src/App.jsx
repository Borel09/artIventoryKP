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
  const [editedItemsMap, setEditedItemsMap] = useState({});
  const [deletedIds, setDeletedIds] = useState([]); // Track deleted items
  
  // NEW: State to toggle showing only low stock (yellow/red) items
  const [showOnlyAlerts, setShowOnlyAlerts] = useState(false);

  // Combine fetched items, filter out deleted IDs, and apply edits map
  const rawList = [...(initialInventory || []), ...localAddedItems];
  const itemsList = rawList
    .filter(item => {
      const id = item._id || item.id;
      return !deletedIds.includes(id);
    })
    .map(item => {
      const id = item._id || item.id;
      return editedItemsMap[id] ? editedItemsMap[id] : item;
    });

  // NEW: Helper function to check if any size variant hits red (<= min) or yellow (<= min + 3)
  const hasStockAlert = (item) => {
    const sizes = item.sizes || {};
    return Object.values(sizes).some(sizeObj => {
      const count = typeof sizeObj === 'object' ? (sizeObj?.count ?? 0) : (sizeObj ?? 0);
      const min = typeof sizeObj === 'object' ? (sizeObj?.min ?? 0) : 0;
      return count <= min + 3;
    });
  };

  // Filter items based on search input AND the low stock alert toggle
  const filteredInventory = itemsList?.filter((item) => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAlerts = showOnlyAlerts ? hasStockAlert(item) : true;
    return matchesSearch && matchesAlerts;
  });

  const handleSavePiece = (newPiece) => {
    setLocalAddedItems((prev) => [...prev, newPiece]);
    setIsAdding(false);
  };

  const handleSaveBulkEdits = async (updatedPieces, deletedIdsParam = []) => {
    try {
      await Promise.all([
        ...updatedPieces.map(async (piece) => {
          if (!piece._id) return;

          await fetch(`http://localhost:5000/api/artPiece/${piece._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: piece.title,
              sizes: piece.sizes,
            }),
          });
        }),
        ...deletedIdsParam.map(async (id) => {
          await fetch(`http://localhost:5000/api/artPiece/${id}`, {
            method: 'DELETE',
          });
        })
      ]);

      // Save deleted IDs to frontend state to hide them instantly
      setDeletedIds(prev => [...prev, ...deletedIdsParam]);

      // Update edited items map
      const newMap = {};
      updatedPieces.forEach(p => {
        if (p._id) newMap[p._id] = p;
      });
      setEditedItemsMap(prev => ({ ...prev, ...newMap }));

      setLocalAddedItems(prev => prev.filter(item => !deletedIdsParam.includes(item._id || item.id)));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating/deleting inventory:', error);
    }
  };

  return (
    <div className="app-container">
      {/* Inline styles for active green buttons */}
      <style>{`
        .controls-bar button.active-mode, 
        .form-actions button.save-btn.active-mode,
        .action-btn.active-green {
          background-color: #2e7d32 !important;
          border-color: #4caf50 !important;
          color: #ffffff !important;
        }
      `}</style>

      <TopHeader userName="User" />
      
      <div className="main-layout">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="content-area">
          <ControlsBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            onAdd={() => {setIsAdding(true); setIsEditing(false);}} 
            onEdit={() => {setIsEditing(true); setIsAdding(false);}}
            // Pass active states if your ControlsBar accepts props for button styling
            isAddingActive={isAdding}
            isEditingActive={isEditing}
          />

          {isAdding ? (
            <AddPieceForm 
              onCancel={() => setIsAdding(false)} 
              onSave={handleSavePiece} 
            />
          ) : isEditing ? (
            <EditInventorySpreadsheet 
              pieces={itemsList}
              searchTerm={searchTerm}
              onCancel={() => setIsEditing(false)}
              onSave={handleSaveBulkEdits}
            />
          ) : (  
            <div className="masterInvContainer">
              
              {/* NEW HEADER WRAPPER: Places the conditional Low Stock button to the left of Add/Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0 }}>Master Inventory</h2>

                <div>
                  {/* Conditionally render button only if any item has a yellow/red stock threshold alert */}
                  {itemsList.some(hasStockAlert) && (
                    <button
                      type="button"
                      className={`action-btn alert-filter-btn ${showOnlyAlerts ? 'active' : ''}`}
                      onClick={() => setShowOnlyAlerts(prev => !prev)}
                    >
                      {showOnlyAlerts ? 'Show All Inventory' : '⚠️ Low Stock Alerts'}
                    </button>
                  )}
                </div>
              </div>

              <div className="table-wrapper">
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