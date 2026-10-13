// function InventoryRow({ item, selectedSaleSize, onSelectSize }) {
//   const imageSrc = item.imageUrl || item.imagePreview || item.image;
//   const itemId = item._id || item.id;

//   // Helper to check stock status for a specific size (used in normal inventory view)
//   const getSizeStatus = (sizeObj) => {
//     const count = typeof sizeObj === 'object' ? (sizeObj?.count ?? 0) : (sizeObj ?? 0);
//     const min = typeof sizeObj === 'object' ? (sizeObj?.min ?? 0) : 0;

//     if (count <= min) return 'size-alert-red'; 
//     if (count <= min + 3) return 'size-alert-yellow'; 
//     return '';
//   };

//   const renderContent = (sizeKey) => {
//     // If onSelectSize is provided, we are in the Sales Log mode and render a checkbox
//     if (onSelectSize) {
//       const isChecked = selectedSaleSize === sizeKey;
//       return (
//         <input 
//           type="checkbox"
//           checked={isChecked}
//           onChange={(e) => onSelectSize(itemId, sizeKey, e.target.checked)}
//           style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#2e7d32' }}
//         />
//       );
//     }

//     // Otherwise, render the normal inventory stock badge
//     const val = item.sizes?.[sizeKey];
//     const count = val && typeof val === 'object' ? (val.count ?? 0) : (val ?? 0);
//     const statusClass = getSizeStatus(val);

//     return (
//       <span className={`size-count-badge ${statusClass}`}>
//         {count}
//       </span>
//     );
//   };

//   const isSelected = selectedSaleSize !== undefined && selectedSaleSize !== null;

//   return (
//     <div 
//       className="table-row"
//       style={isSelected ? { backgroundColor: '#1e3320' } : {}}
//     >
//       <div className="img-preview">
//         {imageSrc ? (
//           <img src={imageSrc} alt={item.title} className="row-img" />
//         ) : (
//           <span className="no-img-text">No Image</span>
//         )}
//       </div>

//       <div className="piece-title">{item.title}</div>

//       <div className="count-col">{renderContent('small')}</div>
//       <div className="count-col">{renderContent('medium')}</div>
//       <div className="count-col">{renderContent('large')}</div>
//     </div>
//   );
// }

// export default InventoryRow;

function InventoryRow({ item, selectedSaleSizes, onToggleSize }) {
  const imageSrc = item.imageUrl || item.imagePreview || item.image;
  const itemId = item._id || item.id;

  const getSizeStatus = (sizeObj) => {
    const count = typeof sizeObj === 'object' ? (sizeObj?.count ?? 0) : (sizeObj ?? 0);
    const min = typeof sizeObj === 'object' ? (sizeObj?.min ?? 0) : 0;

    if (count <= min) return 'size-alert-red'; 
    if (count <= min + 3) return 'size-alert-yellow'; 
    return '';
  };

  const renderContent = (sizeKey) => {
    // If onToggleSize is provided, we render checkboxes for multi-select sales mode
    if (onToggleSize) {
      const isChecked = selectedSaleSizes?.[sizeKey] || false;
      return (
        <input 
          type="checkbox"
          checked={isChecked}
          onChange={(e) => onToggleSize(itemId, sizeKey, e.target.checked)}
          style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#2e7d32' }}
        />
      );
    }

    const val = item.sizes?.[sizeKey];
    const count = val && typeof val === 'object' ? (val.count ?? 0) : (val ?? 0);
    const statusClass = getSizeStatus(val);

    return (
      <span className={`size-count-badge ${statusClass}`}>
        {count}
      </span>
    );
  };

  const hasAnySelected = selectedSaleSizes && Object.values(selectedSaleSizes).some(Boolean);

  return (
    <div 
      className="table-row"
      style={hasAnySelected ? { backgroundColor: '#1e3320' } : {}}
    >
      <div className="img-preview">
        {imageSrc ? (
          <img src={imageSrc} alt={item.title} className="row-img" />
        ) : (
          <span className="no-img-text">No Image</span>
        )}
      </div>

      <div className="piece-title">{item.title}</div>

      <div className="count-col">{renderContent('small')}</div>
      <div className="count-col">{renderContent('medium')}</div>
      <div className="count-col">{renderContent('large')}</div>
    </div>
  );
}

export default InventoryRow;