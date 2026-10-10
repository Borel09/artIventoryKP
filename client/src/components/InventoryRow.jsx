

function InventoryRow({ item }) {
  // Grab URL from backend (imageUrl) or frontend upload preview
  const imageSrc = item.imageUrl || item.imagePreview || item.image;

  return (
    <div className="table-row">
      {/* Column 1: Image Preview */}
      <div className="img-preview">
        {imageSrc ? (
          <img src={imageSrc} alt={item.title} className="row-img" />
        ) : (
          <span className="no-img-text">No Image</span>
        )}
      </div>

      {/* Column 2: Piece Title */}
      <div className="piece-title">{item.title}</div>

      {/* Column 3: 5x7 (S) */}
      <div className="count-col">{item.sizes?.small ?? 0}</div>

      {/* Column 4: 8x10 (M) */}
      <div className="count-col">{item.sizes?.medium ?? 0}</div>

      {/* Column 5: 11x14 (L) */}
      <div className="count-col">{item.sizes?.large ?? 0}</div>
    </div>
  );
}

export default InventoryRow;