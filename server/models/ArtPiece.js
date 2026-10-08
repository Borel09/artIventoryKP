import mongoose from 'mongoose';

const artPieceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title name required"]
    },
    imageUrl: {
        type: String,
        required: [true, "URL required"]
    },
    masterInventory: {
        type: Number,
        required: [true, "Baseline Count required"],
        default: 0
    }
}, {
    timestamps: true
});

const ArtPiece = mongoose.model('ArtPiece', artPieceSchema);
export default ArtPiece;