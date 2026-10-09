import { useInventory } from './hooks/useInventory';
import InventoryRow from './components/InventoryRow';

function App() {
  // Grab our data using our isolated custom hook logic
  const { artInventory } = useInventory();

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#1a1a1a', color: '#fff', minHeight: '100vh' }}>
      
      <h2>UI Component-Driven Inventory Spreadsheet</h2>

      <div style={{ width: '100%', maxWidth: '950px', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
        
        {/* SPREADSHEET STICKY HEADER */}
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 140px', backgroundColor: '#2a2a2a', padding: '15px', fontWeight: 'bold', borderBottom: '2px solid #444', color: '#aaa' }}>
          <div>Image Preview</div>
          <div>Piece Title</div>
          <div style={{ textAlign: 'right' }}>On-Hand Count</div>
        </div>

        {/* COMPONENT STREAM ROW MAPPING */}
        {artInventory.map((item) => (
          <InventoryRow key={item._id} item={item} />
        ))}

      </div>
    </div>
  );
}

export default App;
