// src/components/ControlsBar.jsx
// import React from 'react';

function ControlsBar({ searchTerm, setSearchTerm, onAdd, onDelete }) {
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
        <button className="action-btn" onClick={onAdd}>add</button>
        <button className="action-btn" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

export default ControlsBar;