const calculateRiskLevel = (
  overallScore,
  severityBreakdown
) => {

  if (severityBreakdown.Critical > 0) {
    return "Critical";
  }

  if (severityBreakdown.High > 3) {
    return "High";
  }

  if (overallScore >= 80) {
    return "Low";
  }

  if (overallScore >= 50) {
    return "Medium";
  }

  return "High";

};

export default calculateRiskLevel;