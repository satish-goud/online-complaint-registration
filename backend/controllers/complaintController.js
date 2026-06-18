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

    // Validate required fields
    if (!title || !description || !category || !reporterName || !reporterEmail) {
      return res.status(400).json({
        success: false,
        error: 'All fields (title, description, category, reporterName, reporterEmail) are required',
      });
    }

    // Validate enum values
    const validCategories = ['Billing', 'Technical', 'Security', 'Facility', 'Others'];
    const validPriorities = ['Low', 'Medium', 'High'];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid category. Must be one of: ' + validCategories.join(', '),
      });
    }

    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid priority. Must be one of: ' + validPriorities.join(', '),
      });
    }

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
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid complaint ID format',
      });
    }

    const filter = { _id: req.params.id, ...buildUserFilter(req.user) };
    const complaint = await Complaint.findOne(filter);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: 'Complaint not found or you do not have permission to view it',
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

    // Validate enum values
    const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Closed'];
    const validPriorities = ['Low', 'Medium', 'High'];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', '),
      });
    }

    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid priority. Must be one of: ' + validPriorities.join(', '),
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: 'Complaint not found',
      });
    }

    // Verify ownership - agents can only update their own complaints
    const userRole = req.user.role;
    if (userRole === 'agent' && complaint.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You can only update your own complaints',
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

    // Verify ownership - only allow deletion of own complaints for agents
    const userRole = req.user.role;
    if (userRole === 'agent' && complaint.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own complaints',
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
