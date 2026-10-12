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

    // 1. Check if Multer successfully caught and saved a file
    let imageUrl = '';
    if (req.file) {
      // Build the public URL pointing to your server's assets folder
      imageUrl = `http://localhost:5000/assets/${req.file.filename}`;
    }

    // 2. Parse sizes (since FormData sends objects as JSON strings)
    const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;

    // 3. Create the document in MongoDB
    const newArtPiece = await ArtPiece.create({
      title,
      imageUrl,
      sizes: parsedSizes || { small: 0, medium: 0, large: 0 }
    });

    res.status(201).json(newArtPiece);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 1. UPDATE FEATURE: Find an art print by ID and change its values
// @route   PUT /api/artPiece/:id
export const updateArtPiece = async (req, res) => {
    try {
        // req.params.id grabs the target string from the URL path
        // req.body contains the updated fields (like title or count)
        // { new: true } tells Mongoose to return the updated record back to us
        const updatedPiece = await ArtPiece.findByIdAndUpdate(
            req.params.id, 
            req.body, 
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
