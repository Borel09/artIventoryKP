
// import { useState } from 'react';
// import { useInventory } from './hooks/useInventory';
// import InventoryRow from './components/InventoryRow';
// import TopHeader from './components/TopHeader';
// import Sidebar from './components/Sidebar';
// import ControlsBar from './components/ControlsBar';
// import AddPieceForm from './components/addPieceForm';
// import './App.css';
// import EditInventorySpreadsheet from './components/EditInventorySpreadsheet';

// function App() {
//   const { artInventory: initialInventory } = useInventory();

//   // State management
//   const [localAddedItems, setLocalAddedItems] = useState([]);
//   const [activeTab, setActiveTab] = useState('inventory');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isAdding, setIsAdding] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedItemsMap, setEditedItemsMap] = useState({});

//   // Combine fetched items with locally added items
//   // const itemsList = [...localAddedItems, ...(initialInventory || [])];
//   const rawList = [...localAddedItems, ...(initialInventory || [])];
//   const itemsList = rawList.map(item => {
//     const id = item._id || item.id;
//     return editedItemsMap[id] ? editedItemsMap[id] : item;
//   });


//   // Filter items based on search input
//   const filteredInventory = itemsList?.filter((item) => 
//     item.title?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleSavePiece = (newPiece) => {
//     setLocalAddedItems((prev) => [newPiece, ...prev]);
//     setIsAdding(false);
//   };

//   // const handleSaveBulkEdits = async (updatedPieces) => {
//   //   try{
//   //     await Promise.all(
//   //       ...updatedPieces.map(async (piece) => {
//   //         if(!piece._id) return;

//   //         await fetch(`http://localhost:5000/api/artPiece/${piece._id}`, {
//   //           method: 'PUT',
//   //           headers: {'Content-Type': 'application/json'},
//   //           body: JSON.stringify({
//   //             title: piece.title,
//   //             sizes: piece.sizes,
//   //           }),
//   //         });
//   //       })
//   //     );

//   //    const newMap = {};
//   //    updatedPieces.forEach(p => {
//   //     if(p._id) newMap[p._id] = p;
//   //    });

//   //    setEditedItemsMap(prev => ({...prev,...newMap}));
//   //    setIsEditing(false);
//   //     //setIsEditing(false);

//   //   } catch (error){
//   //     console.error('Error updating inventory:', error);
//   //   }
//   // };
//   // Update the function signature to accept deletedIds alongside updatedPieces
//   const handleSaveBulkEdits = async (updatedPieces, deletedIds = []) => {
//     try {
//       await Promise.all([
//         // 1. Send PUT requests for your updated/edited pieces
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

//         // 2. Send DELETE requests for each ID marked for deletion
//         ...deletedIds.map(async (id) => {
//           await fetch(`http://localhost:5000/api/artPiece/${id}`, {
//             method: 'DELETE',
//           });
//         })
//       ]);

//       // 3. Update local states so the frontend instantly drops the deleted items 
//       // and updates the edited ones without needing a full page reload
//       setEditedItemsMap(prev => {
//         const copy = { ...prev };
//         deletedIds.forEach(id => delete copy[id]);
        
//         const newMap = {};
//         updatedPieces.forEach(p => {
//           if (p._id) newMap[p._id] = p;
//         });
//         return { ...copy, ...newMap };
//       });

//       // Also filter them out of localAddedItems if they were locally created items
//       setLocalAddedItems(prev => prev.filter(item => !deletedIds.includes(item._id || item.id)));

//       setIsEditing(false);
//     } catch (error) {
//       console.error('Error updating/deleting inventory:', error);
//     }
//   };

//   return (
//     <div className="app-container">
//       <TopHeader userName="User" />
      
//       <div className="main-layout">
//         <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

//         <main className="content-area">
//           <ControlsBar 
//             searchTerm={searchTerm} 
//             setSearchTerm={setSearchTerm} 
//             onAdd={() => {setIsAdding(true); setIsEditing(false);}} 
//             onEdit={() => {setIsEditing(true); setIsAdding(false);}}
//           />

//           {isAdding ? (
//             <AddPieceForm 
//               onCancel={() => setIsAdding(false)} 
//               onSave={handleSavePiece} 
//             />
//           ) : isEditing ? (
//             <EditInventorySpreadsheet 
//               pieces = {itemsList}
//               searchTerm={searchTerm}
//               onCancel={() => setIsEditing(false)}
//               onSave={handleSaveBulkEdits}
//               />
//           ) : (  
//             <div className="masterInvContainer">
//               <h2>UI Component-Driven Inventory Spreadsheet</h2>

//               <div className="table-wrapper">
//                 {/* Updated table header with separate columns for each size variant */}
//                 <div className="table-header">
//                   <div>Image Preview</div>
//                   <div>Piece Title</div>
//                   <div>5x7 (S)</div>
//                   <div>8x10 (M)</div>
//                   <div className="text-right">11x14 (L)</div>
//                 </div>

//                 {filteredInventory?.map((item) => (
//                   <InventoryRow key={item._id || item.id} item={item} />
//                 ))}
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
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


  // Filter items based on search input
  const filteredInventory = itemsList?.filter((item) => 
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <h2>Master Inventory</h2>

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