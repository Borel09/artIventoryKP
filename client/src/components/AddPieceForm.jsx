import { useState } from 'react';
// import './AddPieceForm.css';

function AddPieceForm({ onCancel, onSave }) {
  const [title, setTitle] = useState('');
  const [smallCount, setSmallCount] = useState(0);
  const [mediumCount, setMediumCount] = useState(0);
  const [largeCount, setLargeCount] = useState(0);
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formData = new FormData();
    formData.append('title', title);
    
    if (image) {
      formData.append('image', image);
    }
    
    formData.append('sizes', JSON.stringify({
      small: { count: Number(smallCount) || 0, min: 0 },
      medium: { count: Number(mediumCount) || 0, min: 0 },
      large: { count: Number(largeCount) || 0, min: 0 },
    }));

    try {
      const response = await fetch('http://localhost:5000/api/artPiece', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const savedPiece = await response.json();
        onSave(savedPiece); // This passes the real MongoDB document back up to update your UI!
      } else {
        console.error('Failed to save art piece to server');
      }
    } catch (error) {
      console.error('Error connecting to server:', error);
    }
  };

  return (
    <div className="masterInvContainer add-piece-container">
      <div className="form-header-bar">
        <h2>add art piece</h2>
      </div>

      <form onSubmit={handleSubmit} className="add-piece-form">
        {/* Drag & Drop Zone */}
        <div 
          className={`drop-zone ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {image ? (
            <p className="file-selected-text">Selected: {image.name}</p>
          ) : (
            <div className="drop-zone-text">
              <p>drag&drop</p>
              <p>image uploader</p>
            </div>
          )}
        </div>

        {/* Choose File Option Button */}
        <div className="file-picker-container">
          <label className="choose-file-btn">
            choose file option
            <input 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImage(e.target.files[0]);
                }
              }} 
            />
          </label>
        </div>

        {/* All Inputs on One Single Bottom Row */}
        <div className="form-inputs-row">
          <div className="input-field-group title-group">
            <label>title:</label>
            <input 
              type="text" 
              className="form-input title-input"
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Piece title..." 
              required 
            />
          </div>

          <div className="input-field-group">
            <label>5x7:</label>
            <input 
              type="number" 
              className="form-input size-num-input"
              value={smallCount} 
              onChange={(e) => setSmallCount(e.target.value)} 
              min="0" 
            />
          </div>

          <div className="input-field-group">
            <label>8x10:</label>
            <input 
              type="number" 
              className="form-input size-num-input"
              value={mediumCount} 
              onChange={(e) => setMediumCount(e.target.value)} 
              min="0" 
            />
          </div>

          <div className="input-field-group">
            <label>11x14:</label>
            <input 
              type="number" 
              className="form-input size-num-input"
              value={largeCount} 
              onChange={(e) => setLargeCount(e.target.value)} 
              min="0" 
            />
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="form-actions">
          <button type="button" className="action-btn cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="action-btn save-btn">
            Save Piece
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPieceForm;