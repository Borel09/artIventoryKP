import ArtPiece from '../models/ArtPiece.js';

//@desc     Get all art piece inventory records from database
//@route    GET /api/art

//Export async function to handle fetching the entire collection
export const getInventory = async (req, res) => {
    try {
        // .find() is a Mongoose command that tells MongoDB to pull everthing
        const inventory = await ArtPiece.find();
        //return a successful status code 200 along with database
        res.status(200).json(inventory);
    //Open catch block for any errors
    } catch (error){
        //Return a failure status code 500 alongside a detailed JSON error message
        res.status(500).json({
            message: "Failed to fetch inventory dataset", error: error.message
        });
    }
};

//Export a second async function to handle creating new entries in the system
export const addArtPiece = async (req, res) => {
    //Open try block
    try{
        const {title, imageUrl, masterInventory} = req.body;
        const newPiece = await ArtPiece.create({
            title,
            imageUrl,
            masterInventory
    });
        res.status(201).json(newPiece);
    } catch (error){
        res.status(400).json({
            message: "Failed to create art piece entry", error: error.message
        });
    }
    
};