import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

//Init Server APP
dotenv.config();        
const app = express(); //Creates teh Express server engine.

// MIDDLEWARE (GATEKEEPERS)
app.use(cors()); 
app.use(express.json());

//CREATING TEST ENDPOINT (API ROUTE)
app.get('/api/artPiece', (req, res) => {
    const mockInventory = [
        {title: "testpieceOne", masterInventory: 25, imageUrl: ""},
        {title: "testpieceTwo", masterInventory: 8, imageUrl: ""}
    ];

    res.json(mockInventory);
})

//STARTING HARDWARE PORT LISTENER
const PORT = 5000;
app.listen(PORT, () => {
    console.log('Server is open and listening on port: ${PORT}');
});