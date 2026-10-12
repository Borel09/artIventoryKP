// function ControlsBar({ searchTerm, setSearchTerm, onAdd, onEdit }) {
//   return (
//     <div className="controls-bar">
//       <input 
//         type="text" 
//         placeholder="Search box" 
//         className="search-input"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//       <div className="btn-group">
//         <button className="action-btn" onClick={onEdit}>Edit</button>
//         <button className="action-btn" onClick={onAdd}>Add</button>
//         {/* <button className="action-btn">Delete</button> */}
//       </div>
//     </div>
//   );
// }

// export default ControlsBar;

// Example inside ControlsBar.jsx
function ControlsBar({ searchTerm, setSearchTerm, onAdd, onEdit, isAddingActive, isEditingActive }) {
  return (
    <div className="controls-bar">
      <input 
        type="text" 
        placeholder="Search inventory..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        className="search-input"
      />
      <div className="control-buttons" style={{display: 'flex', gap: '12px'}}>
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
    </div>
  );
}
export default ControlsBar;