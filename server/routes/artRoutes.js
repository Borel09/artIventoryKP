import express from 'express';
import {getInventory, addArtPiece} from '../controllers/artController.js';

const router = express.Router();

router.get('/', getInventory);
router.post('/', addArtPiece);

export default router;