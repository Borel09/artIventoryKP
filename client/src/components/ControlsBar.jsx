function ControlsBar({ searchTerm, setSearchTerm, onAdd, onEdit, isAddingActive, isEditingActive, hideActionButtons }) {
  return (
    <div className="controls-bar">
      <input 
        type="text" 
        placeholder="Search inventory..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        className="search-input"
      />
      
      {!hideActionButtons && (
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
      )}
    </div>
  );
}

export default ControlsBar;