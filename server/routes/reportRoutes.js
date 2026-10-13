import express from 'express';
import { 
  submitShiftReport, 
  getPendingReports, 
  approveShiftReport 
} from '../controllers/reportController.js';

const router = express.Router();

router.post('/', submitShiftReport);            // POST /api/reports
router.get('/pending', getPendingReports);      // GET /api/reports/pending
router.put('/:reportId/approve', approveShiftReport); // PUT /api/reports/:id/approve

export default router;