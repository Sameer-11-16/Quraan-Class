import mongoose from 'mongoose';

const BatchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for the batch'],
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent mongoose from compiling the model multiple times in Next.js
export default mongoose.models.Batch || mongoose.model('Batch', BatchSchema);
