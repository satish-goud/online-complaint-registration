import express from 'express';
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
} from '../controllers/complaintController.js';

const router = express.Router();

router.route('/')
  .post(createComplaint)
  .get(getComplaints);

router.route('/:id')
  .get(getComplaintById)
  .put(updateComplaint)
  .delete(deleteComplaint);

export default router;
