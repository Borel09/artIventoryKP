import ArtPiece from '../models/ArtPiece.js';
import fs from 'fs';
import path from 'path';


export const getInventory = async (req, res) => {
    try {
        const inventory = await ArtPiece.find();
        res.status(200).json(inventory);
    } catch (error){
        res.status(500).json({
            message: "Failed to fetch inventory dataset", error: error.message
        });
    }
};


export const addArtPiece = async (req, res) => {
  try {
    const { title, sizes } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = `http://localhost:5000/assets/${req.file.filename}`;
    }

    // Safely parse sizes if sent as a string from FormData
    let parsedSizes = {
      small: { count: 0, min: 0 },
      medium: { count: 0, min: 0 },
      large: { count: 0, min: 0 }
    };

    if (sizes) {
      parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    }

    const newArtPiece = await ArtPiece.create({
      title,
      imageUrl,
      sizes: parsedSizes
    });

    res.status(201).json(newArtPiece);
  } catch (error) {
    console.error("SERVER ADD ERROR:", error.message); // This will show the exact reason in your terminal
    res.status(500).json({ error: error.message });
  }
};

// 1. UPDATE FEATURE: Find an art print by ID and change its values
// @route   PUT /api/artPiece/:id
export const updateArtPiece = async (req, res) => {
    try {
        const { title, sizes } = req.body;
        const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;            

        // req.params.id grabs the target string from the URL path
        // req.body contains the updated fields (like title or count)
        // { new: true } tells Mongoose to return the updated record back to us
        const updatedPiece = await ArtPiece.findByIdAndUpdate(
            req.params.id, 
            { 
              ...(title && { title }), 
              ...(parsedSizes && { sizes: parsedSizes }) 
            }, 
            { new: true, runValidators: true }
        );

        if (!updatedPiece) {
            return res.status(404).json({ message: "Inventory record not found" });
        }

        res.status(200).json(updatedPiece);
    } catch (error) {
        res.status(400).json({ message: "Failed to update item", error: error.message });
    }
};

// 2. DELETE FEATURE: Find a single art print by ID and destroy it
// @route   DELETE /api/artPiece/:id
export const deleteArtPiece = async (req, res) => {
    try {
        const pieceToDelete = await ArtPiece.findById(req.params.id);

        if(pieceToDelete.imageUrl){
            const filename = path.basename(pieceToDelete.imageUrl);
            const filePath = path.join(path.resolve(), 'assets', filename);

            if(fs.existsSync(filePath)){
                fs.unlinkSync(filePath);
            }
        }

        await ArtPiece.findByIdAndDelete(req.params.id);
        // const deletedPiece = await ArtPiece.findByIdAndDelete(req.params.id);

        // if (!deletedPiece) {
        //     return res.status(404).json({ message: "Inventory record not found" });
        // }

        res.status(200).json({ message: "⚡ Item removed from cloud collection successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete item", error: error.message });
    }
};
