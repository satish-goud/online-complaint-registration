import express from 'express';
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getComplaintStats,
} from '../controllers/complaintController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, getComplaintStats);

router.route('/')
  .post(protect, createComplaint)
  .get(protect, getComplaints);

router.route('/:id')
  .get(protect, getComplaintById)
  .put(protect, authorize('admin', 'agent'), updateComplaint)
  .delete(protect, authorize('admin'), deleteComplaint);

export default router;
