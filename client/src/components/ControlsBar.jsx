// function ControlsBar({ searchTerm, setSearchTerm, onAdd, onEdit, isAddingActive, isEditingActive, hideActionButtons, extraButton }) {
//   return (
//     <div className="controls-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
//       <input 
//         type="text" 
//         placeholder="Search inventory..." 
//         value={searchTerm} 
//         onChange={(e) => setSearchTerm(e.target.value)} 
//         className="search-input"
//         style={{ flex: 1, maxWidth: '350px' }}
//       />
      
//       <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
//         {extraButton}

//         {!hideActionButtons && (
//           <div className="control-buttons" style={{ display: 'flex', gap: '10px' }}>
//             <button 
//               onClick={onAdd} 
//               className={`action-btn ${isAddingActive ? 'active-green' : ''}`}
//             >
//               Add Piece
//             </button>
//             <button 
//               onClick={onEdit} 
//               className={`action-btn ${isEditingActive ? 'active-green' : ''}`}
//             >
//               Edit Inventory
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ControlsBar;
function ControlsBar({ searchTerm, setSearchTerm, onAdd, onEdit, isAddingActive, isEditingActive, hideActionButtons, extraButton }) {
  return (
    <div className="controls-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
      <input 
        type="text" 
        placeholder="Search inventory..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        className="search-input"
        style={{ flex: 1, maxWidth: '350px' }}
      />
      
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {/* Renders the review queue button dynamically */}
        {extraButton}

        {!hideActionButtons && (
          <div className="control-buttons" style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={onAdd} 
              className={`action-btn ${isAddingActive ? 'active-green' : ''}`}
            >
              Add Piece
            </button>
            <button 
              onClick={onEdit} 
              className={`action-btn ${isEditingActive ? 'active-green' : ''}`}
            >
              Edit Inventory
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ControlsBar;