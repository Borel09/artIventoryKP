//IMPORTING BACKEND TOOLS
import mongoose from 'mongoose';
import artRoutes from './routes/artRoutes.js';
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
// app.get('/api/artPiece', (req, res) => {
//     const mockInventory = [
//         {title: "testpieceOne", masterInventory: 25, imageUrl: "/artIventoryKP/Ferguson.jpg"},
//         {title: "testpieceTwo", masterInventory: 8, imageUrl: "/artIventoryKP/Garage.jpg"}
//     ];

//     res.json(mockInventory);
// })

app.use('/api/artPiece', artRoutes);

//STARTING HARDWARE PORT LISTENER
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// console.log("--- DEBUGGING CONNECTION VARIABLES ---");
// console.log("Captured Port Number:", PORT);
// console.log("Captured Connection String:", MONGO_URI);

//verify that the server can read your hidden .env creditials file
if(!MONGO_URI){
    console.error("MONGO_URI is missing from your local .env file!");
} else {
    mongoose.connect(MONGO_URI)
        .then(() => {
            console.log("Successfully connected to KPartCluster on MongoDB")
            app.listen(PORT, () => console.log(`Server is open and listening on port: ${PORT}`));
        })
        .catch(err => console.log("MongoDB Connection failure:", err));
}

