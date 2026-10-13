// import mongoose from 'mongoose';

// const soldItemSchema = new mongoose.Schema({
//   artPieceId: { type: mongoose.Schema.Types.ObjectId, ref: 'ArtPiece', required: true },
//   title: String,
//   imageUrl: String,
//   sold: {
//     small: { type: Number, default: 0 },
//     medium: { type: Number, default: 0 },
//     large: { type: Number, default: 0 }
//   }
// }, { _id: false });

// const shiftReportSchema = new mongoose.Schema({
//   submittedBy: { type: String, default: 'Sales Employee' },
//   status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
//   itemsSold: [soldItemSchema],
// }, { timestamps: true });

// export default mongoose.model('ShiftReport', shiftReportSchema);
// server/models/ShiftReport.js
import mongoose from 'mongoose';

const shiftReportSchema = new mongoose.Schema({
    submittedBy: { type: String, required: true },
    location: { type: String, required: true }, // <--- Add this line
    status: { type: String, default: 'pending' },
    itemsSold: [
        {
            artPieceId: { type: mongoose.Schema.Types.ObjectId, ref: 'ArtPiece' },
            title: String,
            imageUrl: String,
            sold: {
                small: { type: Number, default: 0 },
                medium: { type: Number, default: 0 },
                large: { type: Number, default: 0 }
            }
        }
    ]
}, { timestamps: true });

export default mongoose.model('ShiftReport', shiftReportSchema);