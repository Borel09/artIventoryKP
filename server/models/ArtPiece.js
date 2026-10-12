import mongoose from 'mongoose';
const sizeSubSchema = new mongoose.Schema ({
    count: {type: Number, default: 0},
    min: {type: Number, default: 0}
}, {_id: false});

const artPieceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title name required"]
    },
    imageUrl: {
        type: String,
        required: [true, "URL required"]
    },
    sizes: {
        small: {type: sizeSubSchema, default:{count: 0, min: 0}},
        medium: {type: sizeSubSchema, default:{count: 0, min: 0}},
        large: {type: sizeSubSchema, default:{count: 0, min: 0}}
    }
}, {
    timestamps: true
});

const ArtPiece = mongoose.model('ArtPiece', artPieceSchema);
export default ArtPiece;