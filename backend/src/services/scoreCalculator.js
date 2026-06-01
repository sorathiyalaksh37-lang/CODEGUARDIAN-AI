const calculateScore = (
  eslintIssues,
  securityIssues
) => {

  let security = 10;
  let codeQuality = 10;
  let performance = 10;

  // Security deductions
  securityIssues.forEach((issue) => {

    if (issue.severity === "Critical") {
      security -= 4;
    }

    else if (issue.severity === "High") {
      security -= 2;
    }

  });

  // ESLint deductions
  eslintIssues.forEach((issue) => {

    if (issue.severity === "High") {
      codeQuality -= 1;
    }

    if (
      issue.rule === "no-console"
    ) {
      performance -= 1;
    }

  });

  // Prevent negative scores
  security = Math.max(security, 0);
  codeQuality = Math.max(codeQuality, 0);
  performance = Math.max(performance, 0);

  const overall = Math.round(
    (
      security +
      codeQuality +
      performance
    ) / 3
  );

  return {
    security,
    codeQuality,
    performance,
    overall,
  };
};

export default calculateScore;