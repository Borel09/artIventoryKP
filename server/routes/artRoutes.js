import express from 'express';
import {getInventory, addArtPiece, updateArtPiece, deleteArtPiece} from '../controllers/artController.js';

const router = express.Router();

router.get('/', getInventory);
router.post('/', addArtPiece);
router.put('/:id', updateArtPiece);
router.delete('/:id', deleteArtPiece);

export default router;