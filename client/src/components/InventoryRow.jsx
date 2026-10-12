

// function InventoryRow({ item }) {
//   // Grab URL from backend (imageUrl) or frontend upload preview
//   const imageSrc = item.imageUrl || item.imagePreview || item.image;

//   //Helper to check stock status across all sizes
//   const getStockAlertClass = () => {
//     let hasRed = false;
//     let hasYellow = false;
    
//     const sizes = item.sizes || {};

//     Object.values(sizes).forEach(sizeObj => {
//       //Handle backward compatibility (size = raw numb vs an object)
//       const count = typeof sizeObj === 'object' ? (sizeObj?.count ?? 0) : (sizeObj ?? 0);
//       const min = sizeObj === 'object' ? (sizeObj?.min ?? 0) : 0;

//       if(count <= min) {
//         hasRed = true;
//       } else if (count <= min + 3){
//         hasYellow = true;
//       }
//     });

//     if(hasRed) return 'row-alert-red';
//     if(hasYellow) return 'row-alert-yellow';
//     return '';
//   };

//   const alertClass = getStockAlertClass();

//   //Helper to cleanly display count values on the row
//   const renderCount = (sizeKey) => {
//     const val = item.sizes?.[sizeKey];
//     if( val && typeof val === 'object'){
//       return val.count ?? 0;
//     }
//     return val ?? 0;
//   };

//   return (
//     <div className={`table-row ${alertClass}`}>
//       {/* Column 1: Image Preview */}
//       <div className="img-preview">
//         {imageSrc ? (
//           <img src={imageSrc} alt={item.title} className="row-img" />
//         ) : (
//           <span className="no-img-text">No Image</span>
//         )}
//       </div>

//       {/* Column 2: Piece Title */}
//       <div className="piece-title">{item.title}</div>

//       {/* Column 3: 5x7 (S) */}
//       <div className="count-col">{renderCount('small')}</div>

//       {/* Column 4: 8x10 (M) */}
//       <div className="count-col">{renderCount('medium')}</div>

//       {/* Column 5: 11x14 (L) */}
//       <div className="count-col">{renderCount('large')}</div>
//     </div>
//   );
// }

// export default InventoryRow;
function InventoryRow({ item }) {
  const imageSrc = item.imageUrl || item.imagePreview || item.image;

  // Helper to check stock status for a specific size
  const getSizeStatus = (sizeObj) => {
    const count = typeof sizeObj === 'object' ? (sizeObj?.count ?? 0) : (sizeObj ?? 0);
    const min = typeof sizeObj === 'object' ? (sizeObj?.min ?? 0) : 0;

    if (count <= min) return 'size-alert-red'; // At or below min
    if (count <= min + 3) return 'size-alert-yellow'; // Approaching min
    return '';
  };

  const renderCount = (sizeKey) => {
    const val = item.sizes?.[sizeKey];
    const count = val && typeof val === 'object' ? (val.count ?? 0) : (val ?? 0);
    const statusClass = getSizeStatus(val);

    return (
      <span className={`size-count-badge ${statusClass}`}>
        {count}
      </span>
    );
  };

  return (
    <div className="table-row">
      <div className="img-preview">
        {imageSrc ? (
          <img src={imageSrc} alt={item.title} className="row-img" />
        ) : (
          <span className="no-img-text">No Image</span>
        )}
      </div>

      <div className="piece-title">{item.title}</div>

      <div className="count-col">{renderCount('small')}</div>
      <div className="count-col">{renderCount('medium')}</div>
      <div className="count-col">{renderCount('large')}</div>
    </div>
  );
}

export default InventoryRow;