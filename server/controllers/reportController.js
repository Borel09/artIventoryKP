import ShiftReport from '../models/ShiftReport.js';
import ArtPiece from '../models/ArtPiece.js';

// 1. Submit a new EOD shift report (Sales User / Admin action)
export const submitShiftReport = async (req, res) => {
  try {
    const { itemsSold, submittedBy } = req.body;
    
    const newReport = await ShiftReport.create({
      submittedBy: submittedBy || 'Sales Employee',
      itemsSold,
      status: 'pending'
    });

    res.status(201).json({ message: 'Shift report submitted successfully for admin review!', newReport });
  } catch (error) {
    console.error("SUBMIT REPORT ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 2. Fetch all pending reports (Admin Review Hub)
export const getPendingReports = async (req, res) => {
  try {
    const reports = await ShiftReport.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    console.error("FETCH PENDING ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 3. Approve a report (Admin action: deducts counts from ArtPiece & updates status)
export const approveShiftReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await ShiftReport.findById(reportId);

    if (!report || report.status !== 'pending') {
      return res.status(404).json({ error: 'Pending shift report not found' });
    }

    // Loop through each sold entry and subtract quantities from master inventory
    for (const entry of report.itemsSold) {
      const piece = await ArtPiece.findById(entry.artPieceId);
      if (piece) {
        piece.sizes.small.count = Math.max(0, piece.sizes.small.count - (entry.sold.small || 0));
        piece.sizes.medium.count = Math.max(0, piece.sizes.medium.count - (entry.sold.medium || 0));
        piece.sizes.large.count = Math.max(0, piece.sizes.large.count - (entry.sold.large || 0));
        await piece.save();
      }
    }

    // Mark the report as approved
    report.status = 'approved';
    await report.save();

    res.status(200).json({ message: 'Report approved and master inventory updated!' });
  } catch (error) {
    console.error("APPROVE REPORT ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
};