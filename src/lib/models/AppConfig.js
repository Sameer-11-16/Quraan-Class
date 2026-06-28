import mongoose from 'mongoose';

const AppConfigSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.AppConfig || mongoose.model('AppConfig', AppConfigSchema);
