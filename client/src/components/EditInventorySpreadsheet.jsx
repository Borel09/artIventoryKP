import { useState } from 'react';

function EditInventorySpreadsheet({ pieces, searchTerm, onCancel, onSave }) {
  const [editablePieces, setEditablePieces] = useState(pieces);
  const [deleteIds, setDeleteIds] = useState([]);

  const filteredPieces = editablePieces.filter((piece) =>
    piece.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTitleChange = (id, newTitle) => {
    setEditablePieces(prev =>
      prev.map(p => (p._id === id || p.id === id ? { ...p, title: newTitle } : p))
    );
  };

  // Safe handler to update either 'count' or 'min' as an object per size
  const handleSizeSubFieldInput = (id, sizeKey, field, value) => {
    const numericValue = value === '' ? 0 : Math.max(0, parseInt(value, 10) || 0);

    setEditablePieces(prev =>
      prev.map(p => {
        if (p._id === id || p.id === id) {
          const currentSize = p.sizes?.[sizeKey];
          
          // Extract existing values or fall back safely
          let countVal = currentSize && typeof currentSize === 'object' ? (currentSize.count ?? 0) : (currentSize ?? 0);
          let minVal = currentSize && typeof currentSize === 'object' ? (currentSize.min ?? 0) : 0;

          // Apply the new value to the specific field being edited
          if (field === 'count') countVal = numericValue;
          if (field === 'min') minVal = numericValue;

          return {
            ...p,
            sizes: {
              ...(p.sizes || {}),
              [sizeKey]: { count: countVal, min: minVal }
            }
          };
        }
        return p;
      })
    );
  };

  const toggleDelete = (id) => {
    setDeleteIds(prev => {
       if(prev.includes(id)) {
        return prev.filter(itemIds => itemIds !== id);
       } else {
        return [...prev, id];
       }
    });
  };

  const handleSaveClick = () => {
    const cleanPieces = editablePieces.map(piece => {
      const finalTitle = piece.title.trim() === '' ? (piece.originalTitle || piece.title) : piece.title;
      
      // Copy the piece and strip out temporary UI props without destructuring
      const cleanPiece = { ...piece, title: finalTitle };
      delete cleanPiece.originalTitle;
      delete cleanPiece._isFocused;
      
      return cleanPiece;
    });

    onSave(cleanPieces, deleteIds);
  };

  // Helper to safely extract count or min for rendering inputs
  const getVal = (sizeObj, field) => {
    if (sizeObj && typeof sizeObj === 'object') {
      return sizeObj[field] ?? 0;
    }
    return field === 'count' ? (sizeObj ?? 0) : 0;
  };

  return (
    <div className="masterInvContainer">
      <style>{`
        .custom-edit-table {
          width: 100%;
          table-layout: auto;
          border-collapse: collapse;
          margin-top: 10px;
        }
        .custom-edit-table th {
          text-align: left;
          padding: 10px 12px;
          color: #aaa;
          font-weight: 600;
          font-size: 0.85rem;
          border-bottom: 2px solid #333;
        }
        .custom-edit-table th.center, .custom-edit-table td.center {
          text-align: center;
        }
        .custom-edit-table th.right, .custom-edit-table td.right {
          text-align: right;
        }
        .custom-edit-table tr {
          border-bottom: 1px solid #222;
          transition: background-color 0.2s, opacity 0.2s;
        }
        .custom-edit-table td {
          padding: 10px 12px;
          vertical-align: middle;
        }

        .row-deleted{
            background-color: rgba(40, 40, 40, 0.4) !important;
            opacity: 0.5;
        }

        .row-deleted input {
            pointer-events: none;
        }

        .edit-img-preview {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 6px;
          display: block;
        }
        
        .search-input.edit-title-input {
          background-color: #1f1f1f !important;
          border: 1px solid #383838 !important;
          border-radius: 6px !important;
          color: #d1d1d1 !important;
          width: 100% !important;
          min-width: 160px;
          padding: 8px 12px;
          font-size: 0.95rem;
          box-sizing: border-box;
        }

        /* Subdivided header layout */
        .sub-header-row th {
          font-size: 0.7rem;
          text-transform: uppercase;
          padding-top: 2px;
          padding-bottom: 6px;
          border-bottom: 1px solid #333;
        }

        .sub-header-current { color: #4caf50 !important; }
        .sub-header-min { color: #ffb74d !important; }

        /* Color-coded input borders */
        .edit-qty-input {
          width: 45px;
          text-align: center;
          font-size: 0.9rem;
          font-weight: 500;
          padding: 6px 2px;
          background-color: #1f1f1f !important;
          border-radius: 6px !important;
          color: #d1d1d1 !important;
          outline: none;
        }
        
        .input-current {
          border: 1px solid #4caf50 !important;
        }
        .input-min {
          border: 1px solid #ffb74d !important;
        }

        .sub-inputs-wrapper {
          display: flex;
          justify-content: center;
          gap: 6px;
        }

        .row-actions-cell {
          text-align: right;
          white-space: nowrap;
        }

        .trash-btn, .undo-btn {
          background: transparent;
          border: 1px solid #444;
          border-radius: 4px;
          padding: 6px 10px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;
        }
        .trash-btn { color: #ff5c5c; }
        .undo-btn { color: #4da6ff; border-color: #4da6ff; }

        .edit-header h2 {
          text-transform: none !important;
        }
      `}</style>

      <div className="form-header-bar edit-header">
        <h2>Edit Inventory</h2>
        <div className="form-actions">
          <button type="button" className="action-btn cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="action-btn save-btn" onClick={handleSaveClick}>
            Save
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-edit-table">
          <thead>
            <tr>
              <th rowSpan="2" style={{ width: '80px' }}>Image Preview</th>
              <th rowSpan="2">Piece Title</th>
              <th className="center" colSpan="2">5x7 (S)</th>
              <th className="center" colSpan="2">8x10 (M)</th>
              <th className="center" colSpan="2">11x14 (L)</th>
              <th rowSpan="2" className="right" style={{ width: '70px' }}>Actions</th>
            </tr>
            <tr className="sub-header-row">
              <th className="center sub-header-current">Current</th>
              <th className="center sub-header-min">Min</th>
              <th className="center sub-header-current">Current</th>
              <th className="center sub-header-min">Min</th>
              <th className="center sub-header-current">Current</th>
              <th className="center sub-header-min">Min</th>
            </tr>
          </thead>
          <tbody>
            {filteredPieces.map((piece) => {
              const pieceId = piece._id || piece.id;
              const isMarkedDeleted = deleteIds.includes(pieceId);
              
              return (
                <tr key={pieceId} className={isMarkedDeleted ? 'row-deleted' : ''}>
                  {/* Image Preview */}
                  <td>
                    <img 
                      src={piece.imageUrl || 'https://via.placeholder.com/50'} 
                      alt={piece.title} 
                      className="edit-img-preview"
                    />
                  </td>

                  {/* Piece Title Column */}
                  <td>
                    <input
                      type="text"
                      className="search-input edit-title-input"
                      placeholder={piece.originalTitle || piece.title}
                      value={piece.title}
                      onFocus={() => {
                        if (!piece._isFocused) {
                          setEditablePieces(prev =>
                            prev.map(p => 
                              p._id === piece._id 
                                ? { ...p, originalTitle: p.title, title: '', _isFocused: true } 
                                : p
                            )
                          );
                        }
                      }}
                      onBlur={() => {
                        setEditablePieces(prev =>
                          prev.map(p => {
                            if (p._id === piece._id && p.title.trim() === '') {
                              return { ...p, title: p.originalTitle || '', _isFocused: false };
                            }
                            return p;
                          })
                        );
                      }}
                      onChange={(e) => handleTitleChange(piece._id, e.target.value)}
                    />
                  </td>

                  {/* 5x7 Column (Current & Min) */}
                  <td className="center" colSpan="2">
                    <div className="sub-inputs-wrapper">
                      <input
                        type="number"
                        min="0"
                        value={getVal(piece.sizes?.small, 'count')}
                        onChange={(e) => handleSizeSubFieldInput(piece._id, 'small', 'count', e.target.value)}
                        className="edit-qty-input input-current"
                        title="Current 5x7 Count"
                      />
                      <input
                        type="number"
                        min="0"
                        value={getVal(piece.sizes?.small, 'min')}
                        onChange={(e) => handleSizeSubFieldInput(piece._id, 'small', 'min', e.target.value)}
                        className="edit-qty-input input-min"
                        title="Minimum 5x7 Threshold"
                      />
                    </div>
                  </td>

                  {/* 8x10 Column (Current & Min) */}
                  <td className="center" colSpan="2">
                    <div className="sub-inputs-wrapper">
                      <input
                        type="number"
                        min="0"
                        value={getVal(piece.sizes?.medium, 'count')}
                        onChange={(e) => handleSizeSubFieldInput(piece._id, 'medium', 'count', e.target.value)}
                        className="edit-qty-input input-current"
                        title="Current 8x10 Count"
                      />
                      <input
                        type="number"
                        min="0"
                        value={getVal(piece.sizes?.medium, 'min')}
                        onChange={(e) => handleSizeSubFieldInput(piece._id, 'medium', 'min', e.target.value)}
                        className="edit-qty-input input-min"
                        title="Minimum 8x10 Threshold"
                      />
                    </div>
                  </td>

                  {/* 11x14 Column (Current & Min) */}
                  <td className="center" colSpan="2">
                    <div className="sub-inputs-wrapper">
                      <input
                        type="number"
                        min="0"
                        value={getVal(piece.sizes?.large, 'count')}
                        onChange={(e) => handleSizeSubFieldInput(piece._id, 'large', 'count', e.target.value)}
                        className="edit-qty-input input-current"
                        title="Current 11x14 Count"
                      />
                      <input
                        type="number"
                        min="0"
                        value={getVal(piece.sizes?.large, 'min')}
                        onChange={(e) => handleSizeSubFieldInput(piece._id, 'large', 'min', e.target.value)}
                        className="edit-qty-input input-min"
                        title="Minimum 11x14 Threshold"
                      />
                    </div>
                  </td>
                  
                  {/* Actions Column */}
                  <td className="row-actions-cell">
                    {isMarkedDeleted ? (
                      <button 
                        type="button" 
                        className="undo-btn" 
                        onClick={() => toggleDelete(pieceId)}
                        title="Undo deletion"
                      >
                        Undo
                      </button>
                    ) : (
                      <button 
                        type="button" 
                        className="trash-btn" 
                        onClick={() => toggleDelete(pieceId)}
                        title="Mark for deletion"
                      >
                        🗑️
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EditInventorySpreadsheet;