import { useState } from 'react';

function EditInventorySpreadsheet({ pieces, searchTerm, onCancel, onSave }) {
  const [editablePieces, setEditablePieces] = useState(pieces);
  const [deleteIds, setDeleteIds] = useState([]);

  const filteredPieces = editablePieces.filter((piece) =>
    piece.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTitleChange = (id, newTitle) => {
    setEditablePieces(prev =>
      prev.map(p => (p._id === id ? { ...p, title: newTitle } : p))
    );
  };

  const handleSizeDirectInput = (id, sizeKey, value) => {
    const numericValue = value === '' ? 0 : Math.max(0, parseInt(value, 10) || 0);
    setEditablePieces(prev =>
      prev.map(p => {
        if (p._id === id) {
          return {
            ...p,
            sizes: { ...p.sizes, [sizeKey]: numericValue }
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
    })
  }

  // UPDATE START: Clean data handler to strip out temporary UI props before saving
  const handleSaveClick = () => {
    const cleanPieces = editablePieces.map(piece => {
      // Fall back to original title if they left it empty
      const finalTitle = piece.title.trim() === '' ? (piece.originalTitle || piece.title) : piece.title;
      
      // Remove temporary tracking fields so your backend/parent only gets pure piece data
      const {...rest } = piece;
    //   originalTitle, _isFocused, 
      return {
        ...rest,
        title: finalTitle
      };
    });

    onSave(cleanPieces, deleteIds);
  };
  // UPDATE END

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
          padding: 14px 16px;
          color: #aaa;
          font-weight: 600;
          font-size: 0.95rem;
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
          padding: 14px 16px;
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
          width: 55px;
          height: 55px;
          object-fit: cover;
          border-radius: 6px;
          display: block;
        }
        
        .search-input.edit-title-input, .edit-qty-input {
          background-color: #1f1f1f !important;
          border: 1px solid #383838 !important;
          border-radius: 6px !important;
          color: #d1d1d1 !important;
          outline: none;
          transition: border-color 0.2s;
        }
        .search-input.edit-title-input:focus, .edit-qty-input:focus {
          border-color: #555 !important;
        }

        .search-input.edit-title-input {
          width: 100% !important;
          min-width: 180px;
          padding: 8px 12px;
          font-size: 0.95rem;
          box-sizing: border-box;
        }

        .search-input.edit-title-input::placeholder {
          color: #8c8c8c !important;
          opacity: 1 !important;
        }

        .edit-size-cell-content {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .edit-size-cell-content.right-align {
          justify-content: flex-end;
        }

        .edit-qty-input {
          width: 60px;
          text-align: center;
          font-size: 1rem;
          font-weight: 500;
          padding: 6px 4px;
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
        .trash-btn {
          color: #ff5c5c;
        }
        .trash-btn:hover {
          background: rgba(255, 92, 92, 0.1);
          border-color: #ff5c5c;
        }
        .undo-btn {
          color: #4da6ff;
          border-color: #4da6ff;
        }
        .undo-btn:hover {
          background: rgba(77, 166, 255, 0.1);
        }

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
          {/* Updated to use our clean data wrapper */}
          <button type="button" className="action-btn save-btn" onClick={handleSaveClick}>
            Save
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-edit-table">
          <thead>
            <tr>
              <th style={{ width: '90px' }}>Image Preview</th>
              <th>Piece Title</th>
              <th className="center" style={{ width: '135px' }}>5x7 (S)</th>
              <th className="center" style={{ width: '135px' }}>8x10 (M)</th>
              <th className="right" style={{ width: '135px' }}>11x14 (L)</th>

              <th className="right" style={{width: '80px'}}>Actions</th>  

            </tr>
          </thead>
          <tbody>
            {filteredPieces.map((piece) => {
                const pieceId = piece._id || piece.id;
                const isMarkedDeleted = deleteIds.includes(pieceId);
                
                return (
              <tr key={pieceId} className={isMarkedDeleted? 'row-deleted': ''}>
                {/* Image Preview */}
                <td>
                  <img 
                    src={piece.imageUrl || 'https://via.placeholder.com/55'} 
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

                {/* 5x7 Column */}
                <td className="center">
                  <div className="edit-size-cell-content">
                    <input
                      type="number"
                      min="0"
                      value={piece.sizes?.small ?? 0}
                      onChange={(e) => handleSizeDirectInput(piece._id, 'small', e.target.value)}
                      className="edit-qty-input"
                    />
                  </div>
                </td>

                {/* 8x10 Column */}
                <td className="center">
                  <div className="edit-size-cell-content">
                    <input
                      type="number"
                      min="0"
                      value={piece.sizes?.medium ?? 0}
                      onChange={(e) => handleSizeDirectInput(piece._id, 'medium', e.target.value)}
                      className="edit-qty-input"
                    />
                  </div>
                </td>

                {/* 11x14 Column */}
                <td className="right">
                  <div className="edit-size-cell-content right-align">
                    <input
                      type="number"
                      min="0"
                      value={piece.sizes?.large ?? 0}
                      onChange={(e) => handleSizeDirectInput(piece._id, 'large', e.target.value)}
                      className="edit-qty-input"
                    />
                  </div>
                </td>
                
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