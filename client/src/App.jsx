import { useState } from 'react';
import { useInventory } from './hooks/useInventory';
import InventoryRow from './components/InventoryRow';
import TopHeader from './components/TopHeader';
import Sidebar from './components/Sidebar';
import ControlsBar from './components/ControlsBar';
import AddPieceForm from './components/addPieceForm';
import './App.css';
import EditInventorySpreadsheet from './components/EditInventorySpreadsheet';
import DailyReportModal from './components/DailyReportModal';

function App() {
  const { artInventory: initialInventory } = useInventory();

  // State management
  const [localAddedItems, setLocalAddedItems] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItemsMap, setEditedItemsMap] = useState({});
  const [deletedIds, setDeletedIds] = useState([]);
  
  // Shift sales, location, and modal state
  const [todayShiftLog, setTodayShiftLog] = useState([]);
  const [salesLocation, setSalesLocation] = useState('French Market');
  const [isEodModalOpen, setIsEodModalOpen] = useState(false);
  
  // State for Step 1 & Step 2 Edit Mode
  const [selectedSaleItems, setSelectedSaleItems] = useState({});
  const [isLogEditing, setIsLogEditing] = useState(false);

  // State to toggle showing only low stock items
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

  // Helper function to check if any size variant hits red or yellow thresholds
  const hasStockAlert = (item) => {
    const sizes = item.sizes || {};
    return Object.values(sizes).some(sizeObj => {
      const count = typeof sizeObj === 'object' ? (sizeObj?.count ?? 0) : (sizeObj ?? 0);
      const min = typeof sizeObj === 'object' ? (sizeObj?.min ?? 0) : 0;
      return count <= min + 3;
    });
  };

  // Filter items based on search input AND low stock alert toggle
  const filteredInventory = itemsList?.filter((item) => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAlerts = showOnlyAlerts ? hasStockAlert(item) : true;
    return matchesSearch && matchesAlerts;
  });

  const handleSavePiece = (newPiece) => {
    setLocalAddedItems((prev) => [...prev, newPiece]);
    setIsAdding(false);
  };

  // Multi-select sales toggle handler
  const handleToggleSaleSize = (pieceId, sizeKey, isChecked) => {
    setSelectedSaleItems(prev => {
      const existingPieceSizes = prev[pieceId] || { small: false, medium: false, large: false };
      const updatedPieceSizes = { ...existingPieceSizes, [sizeKey]: isChecked };

      // If all sizes are unchecked, remove the piece entirely from selections
      if (!updatedPieceSizes.small && !updatedPieceSizes.medium && !updatedPieceSizes.large) {
        const copy = { ...prev };
        delete copy[pieceId];
        return copy;
      }

      return {
        ...prev,
        [pieceId]: updatedPieceSizes
      };
    });
  };

  const handleLogSaleSubmit = () => {
    const selectedEntries = Object.entries(selectedSaleItems);
    if (selectedEntries.length === 0) {
      alert('Please select at least one art piece and size variant.');
      return;
    }

    setTodayShiftLog(prevLog => {
      let updatedLog = [...prevLog];

      for (const [pieceId, sizes] of selectedEntries) {
        const targetPiece = itemsList.find(p => (p._id || p.id) === pieceId);
        if (!targetPiece) continue;

        const sizePayload = {
          small: sizes.small ? 1 : 0,
          medium: sizes.medium ? 1 : 0,
          large: sizes.large ? 1 : 0,
        };

        const existingIndex = updatedLog.findIndex(item => item.artPieceId === pieceId);

        if (existingIndex > -1) {
          updatedLog[existingIndex] = {
            ...updatedLog[existingIndex],
            sold: {
              small: updatedLog[existingIndex].sold.small + sizePayload.small,
              medium: updatedLog[existingIndex].sold.medium + sizePayload.medium,
              large: updatedLog[existingIndex].sold.large + sizePayload.large,
            }
          };
        } else {
          updatedLog.push({
            artPieceId: pieceId,
            title: targetPiece.title,
            imageUrl: targetPiece.imageUrl,
            sold: sizePayload
          });
        }
      }

      return updatedLog;
    });

    alert('Successfully added selected sales to today’s shift log!');
    
    // Reset selections and navigate to Daily Sales Log
    setSelectedSaleItems({});
    setSearchTerm('');
    setActiveTab('sales-daily-log');
  };

  const handleRemoveLogItem = (artPieceId) => {
    setTodayShiftLog(prevLog => prevLog.filter(item => item.artPieceId !== artPieceId));
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

      setDeletedIds(prev => [...prev, ...deletedIdsParam]);

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

  const totalSelectedCount = Object.keys(selectedSaleItems).length;

  return (
    <div className="app-container">
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
        <Sidebar
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onOpenEOD={() => setIsEodModalOpen(true)}
          onOpenUpload={() => {}}  
        />

        <main className="content-area">
          <ControlsBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            onAdd={() => {setIsAdding(true); setIsEditing(false); setActiveTab('inventory');}} 
            onEdit={() => {setIsEditing(true); setIsAdding(false); setActiveTab('inventory');}}
            isAddingActive={isAdding}
            isEditingActive={isEditing}
            hideActionButtons={activeTab.startsWith('sales-')}
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
          ) : activeTab === 'sales-log-item' ? (
            /* --- Log Item Sold --- */
            <div className="masterInvContainer">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Log Items Sold</h2>
                <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary, #aaa)', fontSize: '14px' }}>
                  Check sizes sold across multiple pieces, then submit them together to your daily shift log.
                </p>
              </div>

              <div className="table-wrapper">
                <div className="table-header">
                  <div>Image Preview</div>
                  <div>Piece Title</div>
                  <div>5x7 (S)</div>
                  <div>8x10 (M)</div>
                  <div className="text-right">11x14 (L)</div>
                </div>

                {filteredInventory?.map((item) => {
                  const itemId = item._id || item.id;
                  const currentPieceSizes = selectedSaleItems[itemId] || { small: false, medium: false, large: false };

                  return (
                    <InventoryRow 
                      key={itemId} 
                      item={item} 
                      selectedSaleSizes={currentPieceSizes}
                      onToggleSize={handleToggleSaleSize}
                    />
                  );
                })}
              </div>

              {/* Submit Action Bar */}
              <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px' }}>
                {totalSelectedCount > 0 && (
                  <span style={{ fontSize: '14px', color: '#4caf50', fontWeight: '600' }}>
                    {totalSelectedCount} piece(s) selected for submission
                  </span>
                )}
                <button 
                  onClick={handleLogSaleSubmit}
                  disabled={totalSelectedCount === 0}
                  style={{ 
                    padding: '10px 24px', 
                    backgroundColor: totalSelectedCount > 0 ? '#2e7d32' : '#555', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: totalSelectedCount > 0 ? 'pointer' : 'not-allowed', 
                    fontWeight: 'bold' 
                  }}
                >
                  Submit Selected Sales ➔
                </button>
              </div>
            </div>
          ) : activeTab === 'sales-daily-log' ? (
            /* --- View Daily Sales Log with Location Dropdown --- */
            <div className="masterInvContainer">
              <h2 style={{ margin: 0 }}>View Daily Sales Log</h2>
              <p style={{ color: 'var(--text-secondary, #aaa)', marginTop: '5px' }}>Here is everything logged during today's shift so far:</p>

              {/* Location Selector Dropdown */}
              <div style={{ marginTop: '20px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px 15px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <label htmlFor="sales-location-select" style={{ fontWeight: '600', color: '#fff', fontSize: '14px' }}>
                  Sales Location / Venue:
                </label>
                <select 
                  id="sales-location-select"
                  value={salesLocation} 
                  onChange={(e) => setSalesLocation(e.target.value)}
                  style={{ 
                    padding: '8px 12px', 
                    borderRadius: '4px', 
                    background: '#222', 
                    color: '#fff', 
                    border: '1px solid #444', 
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  <option value="French Market">French Market</option>
                  <option value="Art Gallery">Art Gallery</option>
                  <option value="Festivals">Festivals</option>
                </select>
              </div>

              {todayShiftLog.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: '#888', marginTop: '20px' }}>
                  No sales recorded yet today. Go to "Log Items Sold" in the sidebar to record items.
                </p>
              ) : (
                <>
                  <div className="table-wrapper" style={{ marginTop: '10px' }}>
                    <div className="table-header" style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                      {isLogEditing && <div style={{ width: '80px', textAlign: 'center' }}>Actions</div>}
                      <div style={{ flex: 1.8, paddingLeft: isLogEditing ? '0px' : '10px' }}>Piece Title</div>
                      <div style={{ flex: 1 }}>5x7 (S) Sold</div>
                      <div style={{ flex: 1 }}>8x10 (M) Sold</div>
                      <div style={{ flex: 1, textAlign: 'right', paddingRight: '35px' }}>11x14 (L) Sold</div>
                    </div>

                    {todayShiftLog.map((item, index) => (
                      <div key={index} style={{ display: 'flex', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center', width: '100%', color: '#fff' }}>
                        {isLogEditing && (
                          <div style={{ width: '80px', display: 'flex', justifyContent: 'center' }}>
                            <button 
                              onClick={() => handleRemoveLogItem(item.artPieceId)}
                              style={{ 
                                background: '#c62828', 
                                color: '#fff', 
                                border: 'none', 
                                padding: '5px 8px', 
                                borderRadius: '4px', 
                                cursor: 'pointer', 
                                fontSize: '11px',
                                fontWeight: 'bold'
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                        <div style={{ flex: 1.8, fontWeight: '500', paddingLeft: isLogEditing ? '0px' : '10px' }}>{item.title}</div>
                        <div style={{ flex: 1, paddingLeft: '5px' }}>{item.sold.small}</div>
                        <div style={{ flex: 1, paddingLeft: '5px' }}>{item.sold.medium}</div>
                        <div style={{ flex: 1, textAlign: 'right', paddingRight: '35px' }}>{item.sold.large}</div>
                      </div>
                    ))}
                  </div>

                  {/* Footer Controls: Edit Button on the left, Proceed on the right */}
                  <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button 
                      onClick={() => setIsLogEditing(prev => !prev)}
                      style={{ 
                        padding: '10px 20px', 
                        backgroundColor: isLogEditing ? '#d32f2f' : '#455a64', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer', 
                        fontWeight: 'bold' 
                      }}
                    >
                      {isLogEditing ? 'Done Editing' : 'Edit Log'}
                    </button>

                    <button 
                      onClick={() => {
                        setIsLogEditing(false);
                        setActiveTab('sales-review-eod');
                      }}
                      style={{ padding: '10px 20px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Proceed to Review EOD Shift Report ➔
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : activeTab === 'sales-review-eod' ? (
            /* --- Review EOD Shift Report --- */
            <div className="masterInvContainer">
              <h2 style={{ margin: 0 }}>Review EOD Shift Report</h2>
              <p style={{ color: 'var(--text-secondary, #aaa)', marginTop: '5px' }}>Compare your accumulated shift sales with your handwritten logs for accuracy before final submission.</p>

              {todayShiftLog.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: '#888', marginTop: '20px' }}>
                  Your shift log is empty, so there is nothing to review or submit.
                </p>
              ) : (
                <div>
                  <div style={{ marginTop: '15px', marginBottom: '15px', color: '#4caf50', fontWeight: '600', fontSize: '15px' }}>
                    📍 Location: {salesLocation}
                  </div>

                  <div className="table-wrapper" style={{ marginTop: '10px', marginBottom: '20px' }}>
                    <div className="table-header" style={{ display: 'flex', width: '100%' }}>
                      <div style={{ flex: 2 }}>Piece Title</div>
                      <div style={{ flex: 1 }}>5x7 (S)</div>
                      <div style={{ flex: 1 }}>8x10 (M)</div>
                      <div style={{ flex: 1, textAlign: 'right', paddingRight: '20px' }}>11x14 (L)</div>
                    </div>

                    {todayShiftLog.map((item, index) => (
                      <div key={index} style={{ display: 'flex', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center', width: '100%', color: '#fff' }}>
                        <div style={{ flex: 2, fontWeight: '500', paddingLeft: '10px' }}>{item.title}</div>
                        <div style={{ flex: 1, paddingLeft: '5px' }}>{item.sold.small}</div>
                        <div style={{ flex: 1, paddingLeft: '5px' }}>{item.sold.medium}</div>
                        <div style={{ flex: 1, textAlign: 'right', paddingRight: '35px' }}>{item.sold.large}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
                    <strong>Note for Staff:</strong> Once you click "Submit for Approval", this report (including the selected location) will be sent directly to the admin queue for side-by-side inventory verification.
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button 
                      onClick={() => setActiveTab('sales-daily-log')}
                      style={{ padding: '10px 16px', backgroundColor: '#444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Back to Daily Log
                    </button>
                    <button 
                      onClick={async () => {
                        try {
                          const response = await fetch('http://localhost:5000/api/reports', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              submittedBy: 'Sales Staff',
                              location: salesLocation,
                              itemsSold: todayShiftLog
                            })
                          });

                          if (!response.ok) throw new Error('Failed to submit report.');

                          alert('EOD Report submitted to admin queue successfully for side-by-side review!');
                          setTodayShiftLog([]);
                          setActiveTab('sales-log-item');
                        } catch (err) {
                          alert(err.message);
                        }
                      }}
                      style={{ padding: '10px 20px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Submit for Approval
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (  
            /* --- Default Inventory View --- */
            <div className="masterInvContainer">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0 }}>Master Inventory</h2>

                <div>
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
                  <InventoryRow 
                    key={item._id || item.id} 
                    item={item} 
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {isEodModalOpen && (
        <DailyReportModal
          shiftLog={todayShiftLog}
          onClose={() => setIsEodModalOpen(false)}
          onSuccess={() => {
            setTodayShiftLog([]);
            alert('EOD Report Submitted to admin queue successfully!');
          }}
        />
      )}
    </div>
  );
}

export default App;