import mongoose from "mongoose";

const scanHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  repo: {
    type: String,
    required: true,
  },
  totalFiles: {
    type: Number,
    default: 0,
  },
  scannedFiles: {
    type: Number,
    default: 0,
  },
  overallScore: {
    type: Number,
    default: 0,
  },
  riskLevel: {
    type: String,
    default: "Low",
  },
  severityBreakdown: {
    Critical: { type: Number, default: 0 },
    High: { type: Number, default: 0 },
    Medium: { type: Number, default: 0 },
    Low: { type: Number, default: 0 },
  },
  reports: [{
    fileName: { type: String, required: true },
    severity: { type: String, required: true },
    review: { type: String, required: true },
    fixes: [{ type: String }],
    score: {
      overall: { type: Number, default: 0 }
    }
  }],
  scannedAt: {
    type: Date,
    default: Date.now,
  },
});

const ScanHistory = mongoose.model("ScanHistory", scanHistorySchema);
export default ScanHistory;