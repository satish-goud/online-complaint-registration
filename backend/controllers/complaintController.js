import Complaint from '../models/Complaint.js';

const buildUserFilter = (user) => {
  if (user.role === 'admin' || user.role === 'agent') {
    return {};
  }
  return { userId: user.id };
};

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
      userId: req.user.id,
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

export const getComplaints = async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = buildUserFilter(req.user);

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

export const getComplaintStats = async (req, res) => {
  try {
    const filter = buildUserFilter(req.user);
    const complaints = await Complaint.find(filter);

    res.status(200).json({
      success: true,
      data: {
        total: complaints.length,
        pending: complaints.filter((c) => c.status === 'Pending').length,
        progress: complaints.filter((c) => c.status === 'In Progress').length,
        resolved: complaints.filter((c) => c.status === 'Resolved').length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message,
    });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const filter = { _id: req.params.id, ...buildUserFilter(req.user) };
    const complaint = await Complaint.findOne(filter);

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

export const updateComplaint = async (req, res) => {
  try {
    const { status, priority } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: 'Complaint not found',
      });
    }

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
