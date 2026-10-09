import { useState, useEffect } from 'react';

export function useInventory() {
  const [artInventory, setArtInventory] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/artPiece')
      .then(res => res.json())
      .then(data => setArtInventory(data))
      .catch(err => console.error("Error pulling database payload:", err));
  }, []);

  return { artInventory, setArtInventory };
}
