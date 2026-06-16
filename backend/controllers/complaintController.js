import Complaint from '../models/Complaint.js';

// @desc    Register a new complaint
// @route   POST /api/complaints
// @access  Public
export const createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority, reporterName, reporterEmail } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      reporterName,
      reporterEmail,
    });

    res.status(201).json({
      success: true,
      message: 'Complaint registered successfully',
      data: complaint,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Public
export const getComplaints = async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message,
    });
  }
};

// @desc    Get single complaint by ID
// @route   GET /api/complaints/:id
// @access  Public
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: 'Complaint not found',
      });
    }

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Invalid Complaint ID or Server Error',
    });
  }
};

// @desc    Update complaint status/priority
// @route   PUT /api/complaints/:id
// @access  Public
export const updateComplaint = async (req, res) => {
  try {
    const { status, priority } = req.body;

    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: 'Complaint not found',
      });
    }

    // Update fields if provided
    if (status) complaint.status = status;
    if (priority) complaint.priority = priority;

    const updatedComplaint = await complaint.save();

    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      data: updatedComplaint,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
// @access  Public
export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: 'Complaint not found',
      });
    }

    await complaint.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Server Error: ' + error.message,
    });
  }
};
