import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  CodeBracketIcon,
  ShieldCheckIcon,
  SparklesIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import { FaGithub } from "react-icons/fa";
import AnimatedCard from "../components/AnimatedCard";
import GlowButton from "../components/GlowButton";
import SeverityBadge from "../components/SeverityBadge";
import LoadingSpinner from "../components/LoadingSpinner";

const CodeFixer = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const [repoUrl, setRepoUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const token = localStorage.getItem("token");

  // Example vulnerable code snippets
  const examples = [
    {
      name: "SQL Injection",
      type: "sqlInjection",
      color: "from-red-500 to-pink-600",
      code: `// VULNERABLE SQL QUERY
const getUser = (req, res) => {
  const id = req.params.id;
  // DANGER: SQL Injection vulnerability!
  const query = \`SELECT * FROM users WHERE id = \${id}\`;
  db.query(query, (err, result) => {
    res.json(result);
  });
};`,
    },
    {
      name: "XSS Attack",
      type: "xssVulnerability",
      color: "from-yellow-500 to-orange-600",
      code: `// VULNERABLE XSS CODE
const displayMessage = (message) => {
  // DANGER: XSS vulnerability!
  document.getElementById('output').innerHTML = message;
};`,
    },
    {
      name: "Hardcoded Password",
      type: "hardcodedPassword",
      color: "from-orange-500 to-red-600",
      code: `// VULNERABLE HARDCODED PASSWORD
const authenticate = (req, res) => {
  const password = req.body.password;
  // DANGER: Hardcoded credentials!
  if (password === 'admin123') {
    res.json({ success: true });
  }
};`,
    },
    {
      name: "Eval Usage",
      type: "evalUsage",
      color: "from-purple-500 to-pink-600",
      code: `// VULNERABLE EVAL USAGE
const calculate = (expression) => {
  // DANGER: Code injection risk!
  return eval(expression);
};`,
    },
  ];

  const loadExample = (example) => {
    setCode(example.code);
    setResult(null);
    setActiveTab("code");
    toast.success(`Loaded ${example.name} example`);
  };

  const handleFix = async () => {
    if (!code.trim()) {
      toast.error("Please enter code to analyze");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const response = await axios.post(
        "http://localhost:8000/api/aifix/fix",
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(response.data.result);
      toast.success("AI Analysis Complete!");
    } catch (error) {
      console.error(error);
      toast.error("Analysis failed. Showing demo results.");

      // Fallback demo result
      setResult({
        vulnerability: "Security Vulnerability Detected",
        severity: "High",
        explanation: "This code contains patterns that could lead to security vulnerabilities including injection attacks, XSS, or insecure data handling.",
        fixedCode: code.includes("eval") 
          ? code.replace(/eval\(/g, "// FIXED: Removed eval for security\n  // safeExecute(")
          : code.replace(/innerHTML/g, "textContent"),
        recommendations: [
          "Use parameterized queries instead of string concatenation",
          "Implement input validation and sanitization",
          "Never hardcode credentials in source code",
          "Use textContent instead of innerHTML for user-generated content",
          "Apply the principle of least privilege",
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (result?.fixedCode) {
      navigator.clipboard.writeText(result.fixedCode);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleScanRepo = async (e) => {
    e.preventDefault();
    if (!repoUrl.trim()) {
      toast.error("Enter GitHub repository URL");
      return;
    }

    try {
      setScanning(true);
      setScanResult(null);

      const response = await axios.post(
        "http://localhost:8000/api/github/scan",
        { repoUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setScanResult(response.data);
      toast.success(`Scanned ${response.data.scannedFiles} files!`);
    } catch (error) {
      console.error(error);
      toast.error("Scan failed. Showing demo results.");

      // Demo scan result
      setScanResult({
        owner: "example",
        repo: "demo-repo",
        scannedFiles: 24,
        overallScore: 68,
        riskLevel: "Medium",
        severityBreakdown: { Critical: 2, High: 5, Medium: 8, Low: 9 },
        reports: [
          { fileName: "src/auth/jwt.js", severity: "Critical", review: "JWT secret exposed in source code" },
          { fileName: "src/db/query.js", severity: "High", review: "SQL injection vulnerability detected" },
          { fileName: "src/api/users.js", severity: "Medium", review: "Missing rate limiting on auth endpoint" },
        ],
      });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-block p-4 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-3xl mb-6"
          >
            <SparklesIcon className="w-16 h-16 text-pink-400" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
              AI Code Fixer
            </span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Paste vulnerable code and get instant AI-powered security analysis with automated fixes
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab("code")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "code"
                ? "text-pink-400 border-b-2 border-pink-400"
                : "text-zinc-500 hover:text-white"
            }`}
          >
            <CodeBracketIcon className="w-5 h-5 inline mr-2" />
            Code Analysis
          </button>
          <button
            onClick={() => setActiveTab("repo")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "repo"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-zinc-500 hover:text-white"
            }`}
          >
            <FaGithub className="inline mr-2" />
            Repository Scanner
          </button>
        </div>

        {/* Code Analysis Tab */}
        {activeTab === "code" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Example Buttons */}
            <AnimatedCard delay={0.1}>
              <h3 className="text-sm font-semibold text-zinc-400 mb-4 flex items-center gap-2">
                <LightBulbIcon className="w-5 h-5 text-yellow-400" />
                Example Vulnerable Code Snippets
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {examples.map((example, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => loadExample(example)}
                    className={`px-4 py-3 bg-gradient-to-r ${example.color} bg-opacity-10 hover:bg-opacity-20 rounded-xl text-sm font-semibold transition-all border border-white/10`}
                  >
                    {example.name}
                  </motion.button>
                ))}
              </div>
            </AnimatedCard>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Panel */}
              <AnimatedCard delay={0.2} gradient>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CodeBracketIcon className="w-5 h-5 text-red-400" />
                      <span className="font-mono text-sm">vulnerable-code.js</span>
                    </div>
                    <span className="text-xs text-zinc-500">Enter code to analyze</span>
                  </div>

                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder='// Paste your vulnerable code here...
// Example: 
const query = `SELECT * FROM users WHERE id = ${userId}`;'
                    className="w-full h-[400px] bg-black/50 border border-zinc-800 rounded-xl p-4 font-mono text-sm outline-none resize-none text-zinc-300 focus:border-pink-500/50 transition-all"
                  />

                  <GlowButton
                    fullWidth
                    variant="primary"
                    onClick={handleFix}
                    disabled={loading}
                    icon={loading ? null : <SparklesIcon />}
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing Code...
                      </div>
                    ) : (
                      "Generate Secure Fix"
                    )}
                  </GlowButton>
                </div>
              </AnimatedCard>

              {/* Output Panel */}
              <div className="space-y-6">
                <AnimatePresence mode="wait">
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-center items-center h-full"
                    >
                      <LoadingSpinner size="lg" text="AI is analyzing your code..." />
                    </motion.div>
                  )}

                  {!loading && result && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      {/* Vulnerability Card */}
                      <AnimatedCard gradient className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-3 bg-red-500/20 rounded-2xl">
                            <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-2">{result.vulnerability}</h3>
                            <SeverityBadge severity={result.severity} size="md" />
                          </div>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">{result.explanation}</p>
                      </AnimatedCard>

                      {/* Fixed Code */}
                      <AnimatedCard gradient className="border-green-500/30">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <ShieldCheckIcon className="w-5 h-5 text-green-400" />
                            <span className="font-mono text-sm">secure-fixed-code.js</span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={copyCode}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white rounded-xl transition-all text-sm font-semibold"
                          >
                            {copied ? (
                              <>
                                <CheckIcon className="w-4 h-4" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <DocumentDuplicateIcon className="w-4 h-4" />
                                Copy
                              </>
                            )}
                          </motion.button>
                        </div>
                        <pre className="bg-black/50 rounded-xl p-4 overflow-x-auto max-h-[300px] border border-zinc-800">
                          <code className="text-sm text-green-300 font-mono whitespace-pre-wrap">
                            {result.fixedCode}
                          </code>
                        </pre>
                      </AnimatedCard>

                      {/* Recommendations */}
                      {result.recommendations && (
                        <AnimatedCard gradient>
                          <h4 className="font-bold text-blue-400 mb-4 flex items-center gap-2">
                            <LightBulbIcon className="w-5 h-5" />
                            Security Recommendations
                          </h4>
                          <ul className="space-y-3">
                            {result.recommendations.map((rec, idx) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-start gap-3 text-zinc-300 text-sm"
                              >
                                <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                <span>{rec}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </AnimatedCard>
                      )}
                    </motion.div>
                  )}

                  {!loading && !result && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full text-center py-20"
                    >
                      <SparklesIcon className="w-24 h-24 text-zinc-700 mb-6" />
                      <p className="text-zinc-500 text-lg">Enter vulnerable code above</p>
                      <p className="text-zinc-600 text-sm mt-2">AI will detect and fix security issues instantly</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {/* Repository Scanner Tab */}
        {activeTab === "repo" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AnimatedCard gradient className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-2xl">
                  <FaGithub className="text-4xl text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Scan GitHub Repository</h2>
                  <p className="text-zinc-400 text-sm">AI-powered security analysis for any public repository</p>
                </div>
              </div>

              <form onSubmit={handleScanRepo} className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                  type="text"
                  placeholder="https://github.com/owner/repository"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="flex-1 bg-black/50 border border-zinc-700 rounded-xl px-6 py-4 outline-none focus:border-blue-500 transition-all"
                />
                <GlowButton
                  type="submit"
                  variant="secondary"
                  disabled={scanning}
                  icon={scanning ? null : <ShieldCheckIcon />}
                >
                  {scanning ? "Scanning..." : "Scan Repository"}
                </GlowButton>
              </form>

              {/* Scan Results */}
              <AnimatePresence>
                {scanning && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex justify-center py-12"
                  >
                    <LoadingSpinner size="lg" text="Scanning repository files..." />
                  </motion.div>
                )}

                {scanResult && !scanning && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/50 rounded-2xl p-6 border border-zinc-800"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                      <div>
                        <h3 className="font-bold text-xl mb-1">
                          {scanResult.owner}/{scanResult.repo}
                        </h3>
                        <p className="text-zinc-500 text-sm">{scanResult.scannedFiles} files analyzed</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-xs text-zinc-400 mb-1">Security Score</p>
                          <p className={`text-4xl font-black ${scanResult.overallScore >= 70 ? "text-green-400" : "text-yellow-400"}`}>
                            {scanResult.overallScore}
                          </p>
                        </div>
                        <SeverityBadge severity={scanResult.riskLevel} size="lg" />
                      </div>
                    </div>

                    {/* Severity Distribution */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      {Object.entries(scanResult.severityBreakdown || {}).map(([severity, count]) => (
                        <div key={severity} className="flex items-center gap-2">
                          <SeverityBadge severity={severity} size="sm" />
                          <span className="text-sm text-zinc-400">{count}</span>
                        </div>
                      ))}
                    </div>

                    {/* Top Issues */}
                    <div>
                      <p className="text-sm font-semibold text-zinc-400 mb-3">Top Vulnerabilities:</p>
                      <div className="space-y-3">
                        {scanResult.reports?.slice(0, 3).map((report, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start gap-3 bg-zinc-900/50 rounded-xl p-4"
                          >
                            <SeverityBadge severity={report.severity} size="sm" />
                            <div className="flex-1">
                              <p className="font-mono text-sm text-green-400 mb-1">{report.fileName}</p>
                              <p className="text-sm text-zinc-400">{report.review}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </AnimatedCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CodeFixer;
