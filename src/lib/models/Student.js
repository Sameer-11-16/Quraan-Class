import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Please provide a student code'],
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a student name'],
      trim: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      required: [true, 'Student must belong to a batch'],
    },
  },
  { timestamps: true }
);

// Prevent mongoose from compiling the model multiple times in Next.js
export default mongoose.models.Student || mongoose.model('Student', StudentSchema);
