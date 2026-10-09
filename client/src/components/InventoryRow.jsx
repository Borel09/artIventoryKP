export default function InventoryRow({ item }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 140px', padding: '20px 15px', alignItems: 'center', borderBottom: '1px solid #333', backgroundColor: '#222' }}>
      
      {/* 1. THE IMAGE CELLS */}
      <div>
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #444' }} 
        />
      </div>

      {/* 2. THE TITLE CELL */}
      <div style={{ fontSize: '18px', fontWeight: '500', color: '#f0f0f0' }}>
        {item.title}
      </div>

      {/* 3. THE VALUE QUANTITY CELL */}
      <div style={{ textAlign: 'right', fontSize: '22px', fontWeight: 'bold', color: '#4caf50' }}>
        {item.masterInventory} <span style={{ fontSize: '14px', color: '#777', fontWeight: 'normal' }}>units</span>
      </div>

    </div>
  );
}
