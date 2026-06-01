const securityScanner = (code) => {

  const issues = [];

  // Hardcoded password
  if (
    code.includes("password") &&
    code.includes("=")
  ) {
    issues.push({
      severity: "High",
      issue: "Possible hardcoded password detected",
      fix: "Use environment variables",
    });
  }

  // eval detection
  if (code.includes("eval(")) {
    issues.push({
      severity: "Critical",
      issue: "Use of eval() detected",
      fix: "Avoid eval() due to code injection risk",
    });
  }

  // innerHTML detection
  if (code.includes("innerHTML")) {
    issues.push({
      severity: "High",
      issue: "Potential XSS vulnerability",
      fix: "Use textContent instead",
    });
  }

  // exec detection
  if (code.includes("exec(")) {
    issues.push({
      severity: "Critical",
      issue: "Command injection risk detected",
      fix: "Sanitize shell commands",
    });
  }

  // SQL Injection detection
  if (
    code.includes("SELECT * FROM") &&
    code.includes("${")
  ) {
    issues.push({
      severity: "Critical",
      issue: "Possible SQL Injection detected",
      fix: "Use parameterized queries",
    });
  }

  return issues;
};

export default securityScanner;