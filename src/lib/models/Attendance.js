import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema(
  {
    date: {
      type: String, // e.g. "2024-10-25"
      required: [true, 'Please provide an attendance date'],
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      required: [true, 'Attendance must belong to a batch'],
    },
    // records is an object mapping studentId to their attendance record
    records: {
      type: Map,
      of: new mongoose.Schema({
        classAttendance: String,
        halqaAttendance: String,
        halqaParticipation: String,
        notesMarks: String,
        homework: String,
        followUp: String,
        remark: String,
      }, { _id: false }), // _id: false prevents sub-documents from getting their own IDs
      required: true,
      default: {},
    }
  },
  { timestamps: true }
);

// Compound index to ensure one attendance record per date per batch
AttendanceSchema.index({ date: 1, batch: 1 }, { unique: true });

// Prevent mongoose from compiling the model multiple times in Next.js
export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
