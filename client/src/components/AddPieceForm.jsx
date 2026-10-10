import { useState } from 'react';

function AddPieceForm({ onCancel, onSave }) {
  const [title, setTitle] = useState('');
  const [count, setCount] = useState(1);
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Send the new piece data up to App.jsx
    onSave({
      _id: Date.now().toString(), // Temporary unique ID for frontend display
      title: title,
      count: Number(count),
      imagePreview: image ? URL.createObjectURL(image) : null,
    });
  };

  return (
    <div className="masterInvContainer">
      <h2>Add New Art Piece</h2>
      <form onSubmit={handleSubmit} className="add-piece-form">
        <div className="form-group">
          <label>Piece Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g. French Quarter Sunset" 
            required 
          />
        </div>

        <div className="form-group">
          <label>Initial On-Hand Count</label>
          <input 
            type="number" 
            value={count} 
            onChange={(e) => setCount(e.target.value)} 
            min="0" 
            required 
          />
        </div>

        <div className="form-group">
          <label>Upload Image</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setImage(e.target.files[0])} 
          />
        </div>

        <div className="form-actions">
          <button type="button" className="action-btn" onClick={onCancel}>
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