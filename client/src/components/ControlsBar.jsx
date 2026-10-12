function ControlsBar({ searchTerm, setSearchTerm, onAdd, onEdit }) {
  return (
    <div className="controls-bar">
      <input 
        type="text" 
        placeholder="Search box" 
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="btn-group">
        <button className="action-btn" onClick={onEdit}>Edit</button>
        <button className="action-btn" onClick={onAdd}>Add</button>
        <button className="action-btn">Delete</button>
      </div>
    </div>
  );
}

export default ControlsBar;