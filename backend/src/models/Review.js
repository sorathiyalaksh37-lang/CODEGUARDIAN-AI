import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    language: String,

    code: String,

    aiReview: String,

    securityIssues: Array,

    eslintIssues: Array,

    severity: String,

    score: {
  security: Number,
  codeQuality: Number,
  performance: Number,
  overall: Number,
},
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;