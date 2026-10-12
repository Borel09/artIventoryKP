import express from 'express';
import multer from 'multer';
import {getInventory, addArtPiece, updateArtPiece, deleteArtPiece} from '../controllers/artController.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'assets/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({storage: storage});

router.get('/', getInventory);
router.post('/', upload.single('image'), addArtPiece);
router.put('/:id', updateArtPiece);
router.delete('/:id', deleteArtPiece);

export default router;