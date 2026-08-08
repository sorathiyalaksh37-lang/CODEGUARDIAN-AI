import Groq from "groq-sdk";
import scanForSecrets from './secretScanner.js';
import scanDependencies from './dependencyScanner.js';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const scanSingleFile = async (file, content) => {

  try {

const prompt = `
You are an expert senior security engineer.

Analyze this source code carefully.

Return JSON only.

Required JSON format:

{
  "severity": "Low",
  "score": {
    "overall": 85
  },
  "review": "Short explanation",
  "fixes": [
    "Fix 1",
    "Fix 2"
  ]
}

Rules:
- Detect security vulnerabilities
- Detect bad coding practices
- Detect performance issues
- Detect exposed secrets
- Detect unsafe functions
- Give realistic scores
- High score = safer code
- Low score = risky code

Code:
${content}
`;

    const completion =
      await groq.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.2,

      });

    const response =
      completion.choices[0]?.message?.content;

    const cleaned =
      response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    const parsed = JSON.parse(cleaned);

    return {

      fileName: file.path,

      severity:
        parsed.severity || "Low",

      score: {
        overall:
          parsed.score?.overall || 50,
      },

      review:
        parsed.review || "No review",

      fixes:
        parsed.fixes || [],

    };

  } catch (error) {

    console.log(
      "AI Scan Error:",
      error.message
    );

    return {

      fileName: file.path,

      severity: "Low",

      score: {
        overall: 50,
      },

      review:
        "AI scan failed",

      fixes: [],

    };

  }

};

/**
 * Enhanced scan with secret detection and dependency scanning
 */
export const enhancedScan = async (repoPath, files) => {
  console.log('🚀 Starting enhanced security scan...');
  
  // Run all scanners in parallel
  const [secretScan, dependencyScan, fileScanResults] = await Promise.all([
    scanForSecrets(repoPath).catch(err => {
      console.error('Secret scan failed:', err);
      return { found: 0, items: [], summary: {} };
    }),
    scanDependencies(repoPath).catch(err => {
      console.error('Dependency scan failed:', err);
      return { vulnerabilities: [], summary: { total: 0 } };
    }),
    Promise.all(files.map(async (file) => {
      const result = await scanSingleFile(file, file.content);
      return result;
    }))
  ]);

  // Calculate overall security score
  const avgFileScore = fileScanResults.reduce((sum, r) => sum + r.score.overall, 0) / (fileScanResults.length || 1);
  
  // Penalty for secrets and dependencies
  const secretPenalty = secretScan.summary.critical * 15 + secretScan.summary.high * 10 + secretScan.summary.medium * 5;
  const dependencyPenalty = dependencyScan.summary.critical * 10 + dependencyScan.summary.high * 7 + dependencyScan.summary.medium * 3;
  
  const finalScore = Math.max(0, Math.min(100, avgFileScore - secretPenalty - dependencyPenalty));

  return {
    overallScore: Math.round(finalScore),
    fileScans: fileScanResults,
    secrets: secretScan,
    dependencies: dependencyScan,
    summary: {
      totalFiles: fileScanResults.length,
      secretsFound: secretScan.found,
      dependencyVulns: dependencyScan.summary.total,
      criticalIssues: secretScan.summary.critical + dependencyScan.summary.critical,
      highIssues: secretScan.summary.high + dependencyScan.summary.high,
      mediumIssues: secretScan.summary.medium + dependencyScan.summary.medium
    },
    timestamp: new Date().toISOString()
  };
};

export default scanSingleFile;