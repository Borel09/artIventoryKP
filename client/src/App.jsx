// import { useState, useEffect } from 'react';
// import { useInventory } from './hooks/useInventory';
// import InventoryRow from './components/InventoryRow';
// import TopHeader from './components/TopHeader';
// import Sidebar from './components/Sidebar';
// import ControlsBar from './components/ControlsBar';
// import AddPieceForm from './components/addPieceForm';
// import './App.css';
// import EditInventorySpreadsheet from './components/EditInventorySpreadsheet';
// import DailyReportModal from './components/DailyReportModal';

// function App() {
//   const { artInventory: initialInventory } = useInventory();

//   // State management
//   const [localAddedItems, setLocalAddedItems] = useState([]);
//   const [activeTab, setActiveTab] = useState('inventory');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isAdding, setIsAdding] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedItemsMap, setEditedItemsMap] = useState({});
//   const [deletedIds, setDeletedIds] = useState([]);
  
//   // User Role State ('admin' or 'sales')
//   const [userRole, setUserRole] = useState('admin');

//   // Shift sales, location, and modal state
//   const [todayShiftLog, setTodayShiftLog] = useState([]);
//   const [salesLocation, setSalesLocation] = useState('French Market');
//   const [isEodModalOpen, setIsEodModalOpen] = useState(false);
  
//   // Admin Review Queue state
//   const [pendingReports, setPendingReports] = useState([]);
//   const [selectedAdminReport, setSelectedAdminReport] = useState(null);

//   // State for Step 1 & Step 2 Edit Mode
//   const [selectedSaleItems, setSelectedSaleItems] = useState({});
//   const [isLogEditing, setIsLogEditing] = useState(false);

//   // State to toggle showing only low stock items
//   const [showOnlyAlerts, setShowOnlyAlerts] = useState(false);

  
//   const fetchPendingReports = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/reports/pending');
//       if (res.ok) {
//         const data = await res.json();
//         // Support both direct array or wrapped object responses
//         const reportsList = Array.isArray(data) ? data : (data.reports || data.pendingReports || []);
//         setPendingReports(reportsList);
//         if (reportsList.length > 0) {
//           setSelectedAdminReport(reportsList[0]);
//         } else {
//           setSelectedAdminReport(null);
//         }
//       }
//     } catch (err) {
//       console.error('Error fetching pending reports:', err);
//     }
//   };

//   useEffect(() => {
//     // React lint flags this data-fetch-on-mount pattern, but it's the correct way to
//     // initialize pending reports from the backend without a cascading render loop.
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     fetchPendingReports();
//   }, []);

//   // Combine fetched items, filter out deleted IDs, and apply edits map
//   const rawList = [...(initialInventory || []), ...localAddedItems];
//   const itemsList = rawList
//     .filter(item => {
//       const id = item._id || item.id;
//       return !deletedIds.includes(id);
//     })
//     .map(item => {
//       const id = item._id || item.id;
//       return editedItemsMap[id] ? editedItemsMap[id] : item;
//     });

//   // Helper function to check if any size variant hits red or yellow thresholds
//   const hasStockAlert = (item) => {
//     const sizes = item.sizes || {};
//     return Object.values(sizes).some(sizeObj => {
//       const count = typeof sizeObj === 'object' ? (sizeObj?.count ?? 0) : (sizeObj ?? 0);
//       const min = typeof sizeObj === 'object' ? (sizeObj?.min ?? 0) : 0;
//       return count <= min + 3;
//     });
//   };

//   // Filter items based on search input AND low stock alert toggle
//   const filteredInventory = itemsList?.filter((item) => {
//     const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesAlerts = showOnlyAlerts ? hasStockAlert(item) : true;
//     return matchesSearch && matchesAlerts;
//   });

//   const handleSavePiece = (newPiece) => {
//     setLocalAddedItems((prev) => [...prev, newPiece]);
//     setIsAdding(false);
//   };

//   // Multi-select sales toggle handler
//   const handleToggleSaleSize = (pieceId, sizeKey, isChecked) => {
//     setSelectedSaleItems(prev => {
//       const existingPieceSizes = prev[pieceId] || { small: false, medium: false, large: false };
//       const updatedPieceSizes = { ...existingPieceSizes, [sizeKey]: isChecked };

//       if (!updatedPieceSizes.small && !updatedPieceSizes.medium && !updatedPieceSizes.large) {
//         const copy = { ...prev };
//         delete copy[pieceId];
//         return copy;
//       }

//       return {
//         ...prev,
//         [pieceId]: updatedPieceSizes
//       };
//     });
//   };

//   const handleLogSaleSubmit = () => {
//     const selectedEntries = Object.entries(selectedSaleItems);
//     if (selectedEntries.length === 0) {
//       alert('Please select at least one art piece and size variant.');
//       return;
//     }

//     setTodayShiftLog(prevLog => {
//       let updatedLog = [...prevLog];

//       for (const [pieceId, sizes] of selectedEntries) {
//         const targetPiece = itemsList.find(p => (p._id || p.id) === pieceId);
//         if (!targetPiece) continue;

//         const sizePayload = {
//           small: sizes.small ? 1 : 0,
//           medium: sizes.medium ? 1 : 0,
//           large: sizes.large ? 1 : 0,
//         };

//         const existingIndex = updatedLog.findIndex(item => item.artPieceId === pieceId);

//         if (existingIndex > -1) {
//           updatedLog[existingIndex] = {
//             ...updatedLog[existingIndex],
//             sold: {
//               small: updatedLog[existingIndex].sold.small + sizePayload.small,
//               medium: updatedLog[existingIndex].sold.medium + sizePayload.medium,
//               large: updatedLog[existingIndex].sold.large + sizePayload.large,
//             }
//           };
//         } else {
//           updatedLog.push({
//             artPieceId: pieceId,
//             title: targetPiece.title,
//             imageUrl: targetPiece.imageUrl,
//             sold: sizePayload
//           });
//         }
//       }

//       return updatedLog;
//     });

//     alert('Successfully added selected sales to today’s shift log!');
//     setSelectedSaleItems({});
//     setSearchTerm('');
//     setActiveTab('sales-daily-log');
//   };

//   const handleRemoveLogItem = (artPieceId) => {
//     setTodayShiftLog(prevLog => prevLog.filter(item => item.artPieceId !== artPieceId));
//   };

//   const handleApproveReport = async (reportId) => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/reports/${reportId}/approve`, {
//         method: 'PUT'
//       });
//       if (!res.ok) throw new Error('Failed to approve report');

//       alert('Report approved successfully! Master inventory updated.');
      
//       // Refresh pending queue and immediately reload the page so the inventory hook re-fetches the fresh database counts
//       await fetchPendingReports();
//       window.location.reload(); 
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const handleSaveBulkEdits = async (updatedPieces, deletedIdsParam = []) => {
//     try {
//       await Promise.all([
//         ...updatedPieces.map(async (piece) => {
//           if (!piece._id) return;

//           await fetch(`http://localhost:5000/api/artPiece/${piece._id}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               title: piece.title,
//               sizes: piece.sizes,
//             }),
//           });
//         }),
//         ...deletedIdsParam.map(async (id) => {
//           await fetch(`http://localhost:5000/api/artPiece/${id}`, {
//             method: 'DELETE',
//           });
//         })
//       ]);

//       setDeletedIds(prev => [...prev, ...deletedIdsParam]);

//       const newMap = {};
//       updatedPieces.forEach(p => {
//         if (p._id) newMap[p._id] = p;
//       });
//       setEditedItemsMap(prev => ({ ...prev, ...newMap }));

//       setLocalAddedItems(prev => prev.filter(item => !deletedIdsParam.includes(item._id || item.id)));
//       setIsEditing(false);
//     } catch (error) {
//       console.error('Error updating/deleting inventory:', error);
//     }
//   };

//   const totalSelectedCount = Object.keys(selectedSaleItems).length;

//   return (
//     <div className="app-container">
//       <style>{`
//         .controls-bar button.active-mode, 
//         .form-actions button.save-btn.active-mode,
//         .action-btn.active-green {
//           background-color: #2e7d32 !important;
//           border-color: #4caf50 !important;
//           color: #ffffff !important;
//         }
//       `}</style>

//       <TopHeader userName="User" />
      
//       {/* Role Switcher Bar for Testing */}
//       <div style={{ background: '#1a1a1a', padding: '8px 20px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
//         <span style={{ color: '#aaa' }}>Current View Role:</span>
//         <button 
//           onClick={() => setUserRole('admin')}
//           style={{ padding: '4px 10px', background: userRole === 'admin' ? '#2e7d32' : '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
//         >
//           Admin
//         </button>
//         <button 
//           onClick={() => setUserRole('sales')}
//           style={{ padding: '4px 10px', background: userRole === 'sales' ? '#2e7d32' : '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
//         >
//           Sales Staff
//         </button>
//       </div>

//       <div className="main-layout">
//         <Sidebar
//           activeTab={activeTab} 
//           setActiveTab={setActiveTab}
//           onOpenEOD={() => setIsEodModalOpen(true)}
//           onOpenUpload={() => {}}  
//         />

//         <main className="content-area">
//           <ControlsBar 
//             searchTerm={searchTerm} 
//             setSearchTerm={setSearchTerm} 
//             onAdd={() => {setIsAdding(true); setIsEditing(false); setActiveTab('inventory');}} 
//             onEdit={() => {setIsEditing(true); setIsAdding(false); setActiveTab('inventory');}}
//             isAddingActive={isAdding}
//             isEditingActive={isEditing}
//             hideActionButtons={userRole === 'sales' || activeTab.startsWith('sales-') || activeTab === 'admin-review'}
//             extraButton={
//               userRole === 'admin' && pendingReports.length > 0 ? (
//                 <button 
//                   onClick={async () => {
//                     await fetchPendingReports();
//                     setActiveTab('admin-review');
//                   }}
//                   className={`action-btn ${activeTab === 'admin-review' ? 'active-green' : ''}`}
//                   style={{ backgroundColor: '#1976d2', color: '#fff', border: 'none', fontWeight: 'bold' }}
//                 >
//                   📋 Review Queue ({pendingReports.length})
//                 </button>
//               ) : null
//             }
//           />

//           {isAdding ? (
//             <AddPieceForm 
//               onCancel={() => setIsAdding(false)} 
//               onSave={handleSavePiece} 
//             />
//           ) : isEditing ? (
//             <EditInventorySpreadsheet 
//               pieces={itemsList}
//               searchTerm={searchTerm}
//               onCancel={() => setIsEditing(false)}
//               onSave={handleSaveBulkEdits}
//             />
//           ) : activeTab === 'sales-log-item' ? (
//             /* --- Log Item Sold --- */
//             <div className="masterInvContainer">
//               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '20px' }}>
//                 <h2 style={{ margin: 0 }}>Log Items Sold</h2>
//                 <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary, #aaa)', fontSize: '14px' }}>
//                   Check sizes sold across multiple pieces, then submit them together to your daily shift log.
//                 </p>
//               </div>

//               <div className="table-wrapper">
//                 <div className="table-header">
//                   <div>Image Preview</div>
//                   <div>Piece Title</div>
//                   <div>5x7 (S)</div>
//                   <div>8x10 (M)</div>
//                   <div className="text-right">11x14 (L)</div>
//                 </div>

//                 {filteredInventory?.map((item) => {
//                   const itemId = item._id || item.id;
//                   const currentPieceSizes = selectedSaleItems[itemId] || { small: false, medium: false, large: false };

//                   return (
//                     <InventoryRow 
//                       key={itemId} 
//                       item={item} 
//                       selectedSaleSizes={currentPieceSizes}
//                       onToggleSize={handleToggleSaleSize}
//                     />
//                   );
//                 })}
//               </div>

//               {/* Submit Action Bar */}
//               <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px' }}>
//                 {totalSelectedCount > 0 && (
//                   <span style={{ fontSize: '14px', color: '#4caf50', fontWeight: '600' }}>
//                     {totalSelectedCount} piece(s) selected for submission
//                   </span>
//                 )}
//                 <button 
//                   onClick={handleLogSaleSubmit}
//                   disabled={totalSelectedCount === 0}
//                   style={{ 
//                     padding: '10px 24px', 
//                     backgroundColor: totalSelectedCount > 0 ? '#2e7d32' : '#555', 
//                     color: '#fff', 
//                     border: 'none', 
//                     borderRadius: '4px', 
//                     cursor: totalSelectedCount > 0 ? 'pointer' : 'not-allowed', 
//                     fontWeight: 'bold' 
//                   }}
//                 >
//                   Submit Selected Sales ➔
//                 </button>
//               </div>
//             </div>
//           ) : activeTab === 'sales-daily-log' ? (
//             /* --- View Daily Sales Log with Location Dropdown --- */
//             <div className="masterInvContainer">
//               <h2 style={{ margin: 0 }}>View Daily Sales Log</h2>
//               <p style={{ color: 'var(--text-secondary, #aaa)', marginTop: '5px' }}>Here is everything logged during today's shift so far:</p>

//               {/* Location Selector Dropdown */}
//               <div style={{ marginTop: '20px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px 15px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
//                 <label htmlFor="sales-location-select" style={{ fontWeight: '600', color: '#fff', fontSize: '14px' }}>
//                   Sales Location / Venue:
//                 </label>
//                 <select 
//                   id="sales-location-select"
//                   value={salesLocation} 
//                   onChange={(e) => setSalesLocation(e.target.value)}
//                   style={{ 
//                     padding: '8px 12px', 
//                     borderRadius: '4px', 
//                     background: '#222', 
//                     color: '#fff', 
//                     border: '1px solid #444', 
//                     cursor: 'pointer',
//                     fontSize: '14px',
//                     fontWeight: '500'
//                   }}
//                 >
//                   <option value="French Market">French Market</option>
//                   <option value="Art Gallery">Art Gallery</option>
//                   <option value="Festivals">Festivals</option>
//                 </select>
//               </div>

//               {todayShiftLog.length === 0 ? (
//                 <p style={{ fontStyle: 'italic', color: '#888', marginTop: '20px' }}>
//                   No sales recorded yet today. Go to "Log Items Sold" in the sidebar to record items.
//                 </p>
//               ) : (
//                 <>
//                   <div className="table-wrapper" style={{ marginTop: '10px' }}>
//                     <div className="table-header" style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
//                       {isLogEditing && <div style={{ width: '80px', textAlign: 'center' }}>Actions</div>}
//                       <div style={{ flex: 1.8, paddingLeft: isLogEditing ? '0px' : '10px' }}>Piece Title</div>
//                       <div style={{ flex: 1 }}>5x7 (S) Sold</div>
//                       <div style={{ flex: 1 }}>8x10 (M) Sold</div>
//                       <div style={{ flex: 1, textAlign: 'right', paddingRight: '35px' }}>11x14 (L) Sold</div>
//                     </div>

//                     {todayShiftLog.map((item, index) => (
//                       <div key={index} style={{ display: 'flex', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center', width: '100%', color: '#fff' }}>
//                         {isLogEditing && (
//                           <div style={{ width: '80px', display: 'flex', justifyContent: 'center' }}>
//                             <button 
//                               onClick={() => handleRemoveLogItem(item.artPieceId)}
//                               style={{ 
//                                 background: '#c62828', 
//                                 color: '#fff', 
//                                 border: 'none', 
//                                 padding: '5px 8px', 
//                                 borderRadius: '4px', 
//                                 cursor: 'pointer', 
//                                 fontSize: '11px',
//                                 fontWeight: 'bold'
//                               }}
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         )}
//                         <div style={{ flex: 1.8, fontWeight: '500', paddingLeft: isLogEditing ? '0px' : '10px' }}>{item.title}</div>
//                         <div style={{ flex: 1, paddingLeft: '5px' }}>{item.sold.small}</div>
//                         <div style={{ flex: 1, paddingLeft: '5px' }}>{item.sold.medium}</div>
//                         <div style={{ flex: 1, textAlign: 'right', paddingRight: '35px' }}>{item.sold.large}</div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Footer Controls: Edit Button on the left, Proceed on the right */}
//                   <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <button 
//                       onClick={() => setIsLogEditing(prev => !prev)}
//                       style={{ 
//                         padding: '10px 20px', 
//                         backgroundColor: isLogEditing ? '#d32f2f' : '#455a64', 
//                         color: '#fff', 
//                         border: 'none', 
//                         borderRadius: '4px', 
//                         cursor: 'pointer', 
//                         fontWeight: 'bold' 
//                       }}
//                     >
//                       {isLogEditing ? 'Done Editing' : 'Edit Log'}
//                     </button>

//                     <button 
//                       onClick={() => {
//                         setIsLogEditing(false);
//                         setActiveTab('sales-review-eod');
//                       }}
//                       style={{ padding: '10px 20px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
//                     >
//                       Proceed to Review EOD Shift Report ➔
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           ) : activeTab === 'sales-review-eod' ? (
//             /* --- Review EOD Shift Report --- */
//             <div className="masterInvContainer">
//               <h2 style={{ margin: 0 }}>Review EOD Shift Report</h2>
//               <p style={{ color: 'var(--text-secondary, #aaa)', marginTop: '5px' }}>Compare your accumulated shift sales with your handwritten logs for accuracy before final submission.</p>

//               {todayShiftLog.length === 0 ? (
//                 <p style={{ fontStyle: 'italic', color: '#888', marginTop: '20px' }}>
//                   Your shift log is empty, so there is nothing to review or submit.
//                 </p>
//               ) : (
//                 <div>
//                   <div style={{ marginTop: '15px', marginBottom: '15px', color: '#4caf50', fontWeight: '600', fontSize: '15px' }}>
//                     📍 Location: {salesLocation}
//                   </div>

//                   <div className="table-wrapper" style={{ marginTop: '10px', marginBottom: '20px' }}>
//                     <div className="table-header" style={{ display: 'flex', width: '100%' }}>
//                       <div style={{ flex: 2 }}>Piece Title</div>
//                       <div style={{ flex: 1 }}>5x7 (S)</div>
//                       <div style={{ flex: 1 }}>8x10 (M)</div>
//                       <div style={{ flex: 1, textAlign: 'right', paddingRight: '20px' }}>11x14 (L)</div>
//                     </div>

//                     {todayShiftLog.map((item, index) => (
//                       <div key={index} style={{ display: 'flex', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center', width: '100%', color: '#fff' }}>
//                         <div style={{ flex: 2, fontWeight: '500', paddingLeft: '10px' }}>{item.title}</div>
//                         <div style={{ flex: 1, paddingLeft: '5px' }}>{item.sold.small}</div>
//                         <div style={{ flex: 1, paddingLeft: '5px' }}>{item.sold.medium}</div>
//                         <div style={{ flex: 1, textAlign: 'right', paddingRight: '35px' }}>{item.sold.large}</div>
//                       </div>
//                     ))}
//                   </div>

//                   <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
//                     <strong>Note for Staff:</strong> Once you click "Submit for Approval", this report (including the selected location) will be sent directly to the admin queue for side-by-side inventory verification.
//                   </div>

//                   <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
//                     <button 
//                       onClick={() => setActiveTab('sales-daily-log')}
//                       style={{ padding: '10px 16px', backgroundColor: '#444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
//                     >
//                       Back to Daily Log
//                     </button>
//                     <button 
//                       onClick={async () => {
//                         try {
//                           const response = await fetch('http://localhost:5000/api/reports', {
//                             method: 'POST',
//                             headers: { 'Content-Type': 'application/json' },
//                             body: JSON.stringify({
//                               submittedBy: 'Sales Staff',
//                               location: salesLocation,
//                               itemsSold: todayShiftLog
//                             })
//                           });

//                           if (!response.ok) throw new Error('Failed to submit report.');

//                           alert('EOD Report submitted to admin queue successfully for side-by-side review!');
//                           setTodayShiftLog([]);
//                           await fetchPendingReports();
//                           setActiveTab('inventory');
//                         } catch (err) {
//                           alert(err.message);
//                         }
//                       }}
//                       style={{ padding: '10px 20px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
//                     >
//                       Submit for Approval
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : activeTab === 'admin-review' && userRole === 'admin' ? (
//             /* --- Admin Review Side-by-Side Queue --- */
//             <div className="masterInvContainer">
//               <h2 style={{ margin: 0 }}>Admin Review Queue (Side-by-Side Verification)</h2>
//               <p style={{ color: 'var(--text-secondary, #aaa)', marginTop: '5px' }}>Review submitted sales reports against live master inventory before approving and timestamping updates.</p>

//               {pendingReports.length === 0 ? (
//                 <p style={{ fontStyle: 'italic', color: '#888', marginTop: '30px' }}>
//                   No pending reports in the queue for review.
//                 </p>
//               ) : (
//                 <div style={{ marginTop: '20px' }}>
//                   {/* Report Selector Tabs */}
//                   <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
//                     {pendingReports.map((rep) => (
//                       <button
//                         key={rep._id}
//                         onClick={() => setSelectedAdminReport(rep)}
//                         style={{
//                           padding: '8px 16px',
//                           background: selectedAdminReport?._id === rep._id ? '#2e7d32' : '#333',
//                           color: '#fff',
//                           border: 'none',
//                           borderRadius: '4px',
//                           cursor: 'pointer',
//                           fontWeight: '600'
//                         }}
//                       >
//                         {rep.location} ({new Date(rep.createdAt).toLocaleDateString()})
//                       </button>
//                     ))}
//                   </div>

//                   {selectedAdminReport ? (
//                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
//                       {/* Left Side: Submitted Report */}
//                       <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
//                         <h3 style={{ marginTop: 0, color: '#4caf50' }}>Submitted Report ({selectedAdminReport.location})</h3>
//                         <p style={{ fontSize: '13px', color: '#aaa' }}>Submitted by: {selectedAdminReport.submittedBy}</p>
                        
//                         <div className="table-wrapper" style={{ marginTop: '15px' }}>
//                           <div className="table-header" style={{ display: 'flex', width: '100%', fontSize: '13px' }}>
//                             <div style={{ flex: 1.5 }}>Title</div>
//                             <div style={{ flex: 1 }}>5x7</div>
//                             <div style={{ flex: 1 }}>8x10</div>
//                             <div style={{ flex: 1, textAlign: 'right' }}>11x14</div>
//                           </div>
//                           {selectedAdminReport.itemsSold?.map((entry, idx) => (
//                             <div key={idx} style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center', fontSize: '13px' }}>
//                               <div style={{ flex: 1.5, fontWeight: '500' }}>{entry.title}</div>
//                               <div style={{ flex: 1 }}>{entry.sold?.small || 0}</div>
//                               <div style={{ flex: 1 }}>{entry.sold?.medium || 0}</div>
//                               <div style={{ flex: 1, textAlign: 'right' }}>{entry.sold?.large || 0}</div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       {/* Right Side: Current Master Inventory */}
//                       <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
//                         <h3 style={{ marginTop: 0, color: '#2196f3' }}>Current Master Inventory Levels</h3>
//                         <p style={{ fontSize: '13px', color: '#aaa' }}>Live counts before approval</p>

//                         <div className="table-wrapper" style={{ marginTop: '15px' }}>
//                           <div className="table-header" style={{ display: 'flex', width: '100%', fontSize: '13px' }}>
//                             <div style={{ flex: 1.5 }}>Title</div>
//                             <div style={{ flex: 1 }}>5x7 (S)</div>
//                             <div style={{ flex: 1 }}>8x10 (M)</div>
//                             <div style={{ flex: 1, textAlign: 'right' }}>11x14 (L)</div>
//                           </div>
//                           {itemsList.map((item) => {
//                             const itemId = item._id || item.id;
//                             const isSoldInReport = selectedAdminReport.itemsSold?.some(e => e.artPieceId === itemId);
//                             return (
//                               <div key={itemId} style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center', fontSize: '13px', background: isSoldInReport ? 'rgba(76, 175, 80, 0.08)' : 'transparent' }}>
//                                 <div style={{ flex: 1.5, fontWeight: '500' }}>{item.title}</div>
//                                 <div style={{ flex: 1 }}>{item.sizes?.small?.count ?? 0}</div>
//                                 <div style={{ flex: 1 }}>{item.sizes?.medium?.count ?? 0}</div>
//                                 <div style={{ flex: 1, textAlign: 'right' }}>{item.sizes?.large?.count ?? 0}</div>
//                               </div>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <p style={{ color: '#aaa' }}>Select a report above to review.</p>
//                   )}

//                   {/* Approve Action Footer */}
//                   {selectedAdminReport && (
//                     <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end', gap: '15px', alignItems: 'center' }}>
//                       <span style={{ fontSize: '13px', color: '#aaa' }}>
//                         Approving will timestamp this report and subtract quantities from master inventory.
//                       </span>
//                       <button
//                         onClick={() => handleApproveReport(selectedAdminReport._id)}
//                         style={{ padding: '12px 24px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
//                       >
//                         Approve & Update Master Inventory ✓
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           ) : (  
//             /* --- Default Inventory View --- */
//             <div className="masterInvContainer">
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
//                 <h2 style={{ margin: 0 }}>Master Inventory</h2>

//                 <div>
//                   {itemsList.some(hasStockAlert) && (
//                     <button
//                       type="button"
//                       className={`action-btn alert-filter-btn ${showOnlyAlerts ? 'active' : ''}`}
//                       onClick={() => setShowOnlyAlerts(prev => !prev)}
//                     >
//                       {showOnlyAlerts ? 'Show All Inventory' : '⚠️ Low Stock Alerts'}
//                     </button>
//                   )}
//                 </div>
//               </div>

//               <div className="table-wrapper">
//                 <div className="table-header">
//                   <div>Image Preview</div>
//                   <div>Piece Title</div>
//                   <div>5x7 (S)</div>
//                   <div>8x10 (M)</div>
//                   <div className="text-right">11x14 (L)</div>
//                 </div>

//                 {filteredInventory?.map((item) => (
//                   <InventoryRow 
//                     key={item._id || item.id} 
//                     item={item} 
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
//         </main>
//       </div>

//       {isEodModalOpen && (
//         <DailyReportModal
//           shiftLog={todayShiftLog}
//           onClose={() => setIsEodModalOpen(false)}
//           onSuccess={() => {
//             setTodayShiftLog([]);
//             alert('EOD Report Submitted to admin queue successfully!');
//           }}
//         />
//       )}
//     </div>
//   );
// }

// export default App;

import { useState, useEffect } from 'react';
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
  
  // User Role State ('admin' or 'sales')
  const [userRole, setUserRole] = useState('admin');

  // Shift sales, location, and modal state
  const [todayShiftLog, setTodayShiftLog] = useState([]);
  const [salesLocation, setSalesLocation] = useState('French Market');
  const [isEodModalOpen, setIsEodModalOpen] = useState(false);
  
  // Admin Review Queue state
  const [pendingReports, setPendingReports] = useState([]);
  const [selectedAdminReport, setSelectedAdminReport] = useState(null);

  // State for Step 1 & Step 2 Edit Mode
  const [selectedSaleItems, setSelectedSaleItems] = useState({});
  const [isLogEditing, setIsLogEditing] = useState(false);

  // State to toggle showing only low stock items
  const [showOnlyAlerts, setShowOnlyAlerts] = useState(false);

  
  const fetchPendingReports = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/reports/pending');
      if (res.ok) {
        const data = await res.json();
        // Support both direct array or wrapped object responses
        const reportsList = Array.isArray(data) ? data : (data.reports || data.pendingReports || []);
        setPendingReports(reportsList);
        if (reportsList.length > 0) {
          setSelectedAdminReport(reportsList[0]);
        } else {
          setSelectedAdminReport(null);
        }
      }
    } catch (err) {
      console.error('Error fetching pending reports:', err);
    }
  };

  useEffect(() => {
    // React lint flags this data-fetch-on-mount pattern, but it's the correct way to
    // initialize pending reports from the backend without a cascading render loop.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPendingReports();
  }, []);

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
    setSelectedSaleItems({});
    setSearchTerm('');
    setActiveTab('sales-daily-log');
  };

  const handleRemoveLogItem = (artPieceId) => {
    setTodayShiftLog(prevLog => prevLog.filter(item => item.artPieceId !== artPieceId));
  };

  const handleApproveReport = async (reportId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reports/${reportId}/approve`, {
        method: 'PUT'
      });
      if (!res.ok) throw new Error('Failed to approve report');

      alert('Report approved successfully! Master inventory updated.');
      
      // Refresh pending queue and immediately reload the page so the inventory hook re-fetches the fresh database counts
      await fetchPendingReports();
      window.location.reload(); 
    } catch (err) {
      alert(err.message);
    }
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

      // --- FIX: Immediately reload the page after bulk edits save ---
      // This ensures the inventory hook cleanly re-syncs with the newly saved database records
      // and resolves the empty inventory table bug upon returning from the edit spreadsheet view.
      window.location.reload();
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
      
      {/* Role Switcher Bar for Testing */}
      <div style={{ background: '#1a1a1a', padding: '8px 20px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
        <span style={{ color: '#aaa' }}>Current View Role:</span>
        <button 
          onClick={() => setUserRole('admin')}
          style={{ padding: '4px 10px', background: userRole === 'admin' ? '#2e7d32' : '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Admin
        </button>
        <button 
          onClick={() => setUserRole('sales')}
          style={{ padding: '4px 10px', background: userRole === 'sales' ? '#2e7d32' : '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Sales Staff
        </button>
      </div>

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
            hideActionButtons={userRole === 'sales' || activeTab.startsWith('sales-') || activeTab === 'admin-review'}
            extraButton={
              userRole === 'admin' && pendingReports.length > 0 ? (
                <button 
                  onClick={async () => {
                    await fetchPendingReports();
                    setActiveTab('admin-review');
                  }}
                  className={`action-btn ${activeTab === 'admin-review' ? 'active-green' : ''}`}
                  style={{ backgroundColor: '#1976d2', color: '#fff', border: 'none', fontWeight: 'bold' }}
                >
                  📋 Review Queue ({pendingReports.length})
                </button>
              ) : null
            }
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
                          await fetchPendingReports();
                          setActiveTab('inventory');
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
          ) : activeTab === 'admin-review' && userRole === 'admin' ? (
            /* --- Admin Review Side-by-Side Queue --- */
            <div className="masterInvContainer">
              <h2 style={{ margin: 0 }}>Admin Review Queue (Side-by-Side Verification)</h2>
              <p style={{ color: 'var(--text-secondary, #aaa)', marginTop: '5px' }}>Review submitted sales reports against live master inventory before approving and timestamping updates.</p>

              {pendingReports.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: '#888', marginTop: '30px' }}>
                  No pending reports in the queue for review.
                </p>
              ) : (
                <div style={{ marginTop: '20px' }}>
                  {/* Report Selector Tabs */}
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {pendingReports.map((rep) => (
                      <button
                        key={rep._id}
                        onClick={() => setSelectedAdminReport(rep)}
                        style={{
                          padding: '8px 16px',
                          background: selectedAdminReport?._id === rep._id ? '#2e7d32' : '#333',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        {rep.location} ({new Date(rep.createdAt).toLocaleDateString()})
                      </button>
                    ))}
                  </div>

                  {selectedAdminReport ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      {/* Left Side: Submitted Report */}
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <h3 style={{ marginTop: 0, color: '#4caf50' }}>Submitted Report ({selectedAdminReport.location})</h3>
                        <p style={{ fontSize: '13px', color: '#aaa' }}>Submitted by: {selectedAdminReport.submittedBy}</p>
                        
                        <div className="table-wrapper" style={{ marginTop: '15px' }}>
                          <div className="table-header" style={{ display: 'flex', width: '100%', fontSize: '13px' }}>
                            <div style={{ flex: 1.5 }}>Title</div>
                            <div style={{ flex: 1 }}>5x7</div>
                            <div style={{ flex: 1 }}>8x10</div>
                            <div style={{ flex: 1, textAlign: 'right' }}>11x14</div>
                          </div>
                          {selectedAdminReport.itemsSold?.map((entry, idx) => (
                            <div key={idx} style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center', fontSize: '13px' }}>
                              <div style={{ flex: 1.5, fontWeight: '500' }}>{entry.title}</div>
                              <div style={{ flex: 1 }}>{entry.sold?.small || 0}</div>
                              <div style={{ flex: 1 }}>{entry.sold?.medium || 0}</div>
                              <div style={{ flex: 1, textAlign: 'right' }}>{entry.sold?.large || 0}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Side: Current Master Inventory */}
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <h3 style={{ marginTop: 0, color: '#2196f3' }}>Current Master Inventory Levels</h3>
                        <p style={{ fontSize: '13px', color: '#aaa' }}>Live counts before approval</p>

                        <div className="table-wrapper" style={{ marginTop: '15px' }}>
                          <div className="table-header" style={{ display: 'flex', width: '100%', fontSize: '13px' }}>
                            <div style={{ flex: 1.5 }}>Title</div>
                            <div style={{ flex: 1 }}>5x7 (S)</div>
                            <div style={{ flex: 1 }}>8x10 (M)</div>
                            <div style={{ flex: 1, textAlign: 'right' }}>11x14 (L)</div>
                          </div>
                          {itemsList.map((item) => {
                            const itemId = item._id || item.id;
                            const isSoldInReport = selectedAdminReport.itemsSold?.some(e => e.artPieceId === itemId);
                            return (
                              <div key={itemId} style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center', fontSize: '13px', background: isSoldInReport ? 'rgba(76, 175, 80, 0.08)' : 'transparent' }}>
                                <div style={{ flex: 1.5, fontWeight: '500' }}>{item.title}</div>
                                <div style={{ flex: 1 }}>{item.sizes?.small?.count ?? 0}</div>
                                <div style={{ flex: 1 }}>{item.sizes?.medium?.count ?? 0}</div>
                                <div style={{ flex: 1, textAlign: 'right' }}>{item.sizes?.large?.count ?? 0}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: '#aaa' }}>Select a report above to review.</p>
                  )}

                  {/* Approve Action Footer */}
                  {selectedAdminReport && (
                    <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end', gap: '15px', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: '#aaa' }}>
                        Approving will timestamp this report and subtract quantities from master inventory.
                      </span>
                      <button
                        onClick={() => handleApproveReport(selectedAdminReport._id)}
                        style={{ padding: '12px 24px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Approve & Update Master Inventory ✓
                      </button>
                    </div>
                  )}
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