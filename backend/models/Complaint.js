import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a complaint title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a complaint description'],
    },
    category: {
      type: String,
      required: [true, 'Please select a complaint category'],
      enum: ['Billing', 'Technical', 'Security', 'Facility', 'Others'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Closed'],
      default: 'Pending',
    },
    reporterName: {
      type: String,
      required: [true, 'Please add the reporter name'],
    },
    reporterEmail: {
      type: String,
      required: [true, 'Please add the reporter email address'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email address',
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
