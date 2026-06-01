import geminiReview from "../services/geminiService.js";
import analyzeCode from "../services/eslintService.js";
import Review from "../models/Review.js";
import securityScanner from "../services/securityScanner.js";
import calculateScore from "../services/scoreCalculator.js";

  export const reviewCode = async (req, res) => {

  try {

    const { code, language } = req.body;

    const aiReview = await geminiReview(code);

    const eslintIssues = await analyzeCode(code);

    const securityIssues = securityScanner(code);

    const score = calculateScore(
  eslintIssues,
  securityIssues
);

const review = await Review.create({
  user: req.user.id,
  code,
  language,
  aiReview,
  eslintIssues,
  securityIssues,

severity:
  score.overall < 5
    ? "Critical"
    : score.overall < 7
    ? "High"
    : "Medium",
    
score,
});

    res.json({
      success: true,
      review,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};