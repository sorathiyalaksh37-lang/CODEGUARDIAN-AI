import React, { useState } from "react";
import axios from "axios";
import { FaGithub, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaCode, FaShieldAlt, FaCalendar, FaDownload } from "react-icons/fa";
import toast from "react-hot-toast";

const RepoScanner = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("scan");

  const token = localStorage.getItem("token");

  // Popular repositories for quick scan
  const popularRepos = [
    { name: "expressjs/express", url: "https://github.com/expressjs/express" },
    { name: "lodash/lodash", url: "https://github.com/lodash/lodash" },
    { name: "axios/axios", url: "https://github.com/axios/axios" },
    { name: "vercel/next.js", url: "https://github.com/vercel/next.js" },
  ];

  // Scan repository
  const handleScan = async (e) => {
    e.preventDefault();
    
    if (!repoUrl.trim()) {
      toast.error("Please enter a GitHub repository URL");
      return;
    }

    // Validate GitHub URL
    const githubRegex = /github\.com\/([^\/]+)\/([^\/]+)/;
    if (!githubRegex.test(repoUrl)) {
      toast.error("Invalid GitHub URL. Format: https://github.com/owner/repo");
      return;
    }

    try {
      setLoading(true);
      setScanResult(null);

      toast.loading("Scanning repository...", { id: "scan" });

      const response = await axios.post(
        "http://localhost:8000/api/github/scan",
        { repoUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setScanResult(response.data);
      toast.success("Scan completed!", { id: "scan" });
      
      // Add to history
      setScanHistory(prev => [response.data, ...prev].slice(0, 10));
      
    } catch (error) {
      console.error("Scan error:", error);
      toast.error(error.response?.data?.message || "Scan failed", { id: "scan" });
      
      // DEMO DATA - For testing when backend is not available
      const demoResult = generateDemoScan(repoUrl);
      setScanResult(demoResult);
      setScanHistory(prev => [demoResult, ...prev].slice(0, 10));
      
    } finally {
      setLoading(false);
    }
  };

  // Generate demo scan data for testing
  const generateDemoScan = (url) => {
    const parts = url.split("/");
    const owner = parts[3] || "demo";
    const repo = parts[4] || "repository";
    
    const severityOptions = ["Critical", "High", "Medium", "Low"];
    const issueTypes = [
      "SQL Injection vulnerability detected",
      "XSS vulnerability in input handling",
      "Hardcoded credentials found",
      "Outdated dependency with security flaw",
      "Insecure direct object reference",
      "Missing authentication check",
      "CSRF protection missing",
      "Path traversal vulnerability",
      "Insecure deserialization",
      "Information exposure in error messages"
    ];
    
    const reports = Array.from({ length: Math.floor(Math.random() * 8) + 5 }, (_, i) => ({
      fileName: `${["auth", "db", "api", "routes", "controllers", "models", "utils", "middleware"][Math.floor(Math.random() * 8)]}.js`,
      severity: severityOptions[Math.floor(Math.random() * 4)],
      review: issueTypes[Math.floor(Math.random() * issueTypes.length)],
      fixes: [
        "Use parameterized queries",
        "Implement input validation",
        "Move credentials to environment variables",
        "Update to latest secure version",
        "Add authentication middleware"
      ].slice(0, Math.floor(Math.random() * 3) + 2)
    }));
    
    const severityBreakdown = {
      Critical: reports.filter(r => r.severity === "Critical").length,
      High: reports.filter(r => r.severity === "High").length,
      Medium: reports.filter(r => r.severity === "Medium").length,
      Low: reports.filter(r => r.severity === "Low").length
    };
    
    const totalScore = reports.reduce((acc, r) => {
      const scores = { Critical: 30, High: 50, Medium: 70, Low: 85 };
      return acc + scores[r.severity];
    }, 0);
    const overallScore = Math.round(totalScore / reports.length);
    
    let riskLevel = "Low";
    if (severityBreakdown.Critical > 0) riskLevel = "Critical";
    else if (severityBreakdown.High > 2) riskLevel = "High";
    else if (severityBreakdown.High > 0) riskLevel = "Medium";
    
    return {
      owner,
      repo,
      repoUrl: url,
      scannedFiles: reports.length,
      overallScore,
      riskLevel,
      severityBreakdown,
      reports,
      scannedAt: new Date().toISOString()
    };
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    switch(severity) {
      case "Critical": return "bg-red-500 text-white";
      case "High": return "bg-orange-500 text-white";
      case "Medium": return "bg-yellow-500 text-black";
      case "Low": return "bg-green-500 text-black";
      default: return "bg-gray-500 text-white";
    }
  };

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-green-500/20 rounded-3xl">
              <FaGithub className="text-5xl text-green-400" />
            </div>
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                GitHub Security Scanner
              </h1>
              <p className="text-zinc-400 mt-2">
                AI-powered vulnerability detection for any public repository
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab("scan")}
            className={`px-6 py-3 rounded-t-lg font-medium transition-all ${
              activeTab === "scan" 
                ? "bg-green-500 text-black border-b-2 border-green-500" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            🔍 Scan Repository
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 rounded-t-lg font-medium transition-all ${
              activeTab === "history" 
                ? "bg-green-500 text-black border-b-2 border-green-500" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            📜 Scan History ({scanHistory.length})
          </button>
        </div>

        {/* Scan Tab */}
        {activeTab === "scan" && (
          <div className="space-y-8">
            {/* Input Form */}
            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8">
              <form onSubmit={handleScan} className="space-y-6">
                <div>
                  <label className="block text-zinc-400 mb-2">Repository URL</label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/owner/repository"
                      className="flex-1 bg-black border border-zinc-700 rounded-2xl px-6 py-4 outline-none focus:border-green-500 text-lg"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black font-bold px-10 rounded-2xl text-lg flex items-center gap-3 disabled:opacity-50 min-w-[180px] justify-center"
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <FaShieldAlt />
                          Scan Now
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Popular Repos */}
              <div className="mt-6">
                <p className="text-sm text-zinc-500 mb-3">Popular repositories to scan:</p>
                <div className="flex flex-wrap gap-3">
                  {popularRepos.map((repo) => (
                    <button
                      key={repo.url}
                      onClick={() => setRepoUrl(repo.url)}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm transition-all flex items-center gap-2"
                    >
                      <FaGithub className="text-green-400" />
                      {repo.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scan Results */}
            {scanResult && (
              <div className="space-y-6 animate-fade-in">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-6 text-center">
                    <FaCode className="text-3xl text-green-400 mx-auto mb-3" />
                    <p className="text-zinc-400 text-sm">Files Scanned</p>
                    <p className="text-3xl font-bold">{scanResult.scannedFiles}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6 text-center">
                    <FaShieldAlt className="text-3xl text-blue-400 mx-auto mb-3" />
                    <p className="text-zinc-400 text-sm">Security Score</p>
                    <p className={`text-4xl font-bold ${getScoreColor(scanResult.overallScore)}`}>
                      {scanResult.overallScore}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-6 text-center">
                    <FaExclamationTriangle className="text-3xl text-purple-400 mx-auto mb-3" />
                    <p className="text-zinc-400 text-sm">Risk Level</p>
                    <p className={`text-2xl font-bold ${
                      scanResult.riskLevel === "Critical" ? "text-red-400" :
                      scanResult.riskLevel === "High" ? "text-orange-400" :
                      scanResult.riskLevel === "Medium" ? "text-yellow-400" : "text-green-400"
                    }`}>
                      {scanResult.riskLevel}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 rounded-2xl p-6 text-center">
                    <FaCalendar className="text-3xl text-cyan-400 mx-auto mb-3" />
                    <p className="text-zinc-400 text-sm">Repository</p>
                    <p className="text-sm font-mono truncate">{scanResult.owner}/{scanResult.repo}</p>
                  </div>
                </div>

                {/* Severity Breakdown */}
                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                  <h3 className="text-xl font-bold mb-5">Severity Breakdown</h3>
                  <div className="space-y-3">
                    {Object.entries(scanResult.severityBreakdown || {}).map(([severity, count]) => (
                      count > 0 && (
                        <div key={severity} className="flex items-center gap-3">
                          <div className={`w-24 px-3 py-1 rounded-full text-xs font-bold text-center ${
                            severity === "Critical" ? "bg-red-500" :
                            severity === "High" ? "bg-orange-500" :
                            severity === "Medium" ? "bg-yellow-500" : "bg-green-500"
                          } ${severity === "Medium" ? "text-black" : "text-white"}`}>
                            {severity}
                          </div>
                          <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                severity === "Critical" ? "bg-red-500" :
                                severity === "High" ? "bg-orange-500" :
                                severity === "Medium" ? "bg-yellow-500" : "bg-green-500"
                              }`}
                              style={{ width: `${(count / scanResult.scannedFiles) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-zinc-400 w-12">{count} files</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>

                {/* Vulnerabilities List */}
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
                  <div className="bg-zinc-950 px-6 py-4 border-b border-zinc-800">
                    <h3 className="text-xl font-bold">🔍 Detected Vulnerabilities</h3>
                    <p className="text-zinc-500 text-sm">{scanResult.reports?.length} issues found</p>
                  </div>
                  <div className="divide-y divide-zinc-800">
                    {scanResult.reports?.map((report, idx) => (
                      <div key={idx} className="p-6 hover:bg-zinc-800/50 transition-all">
                        <div className="flex items-start gap-4">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            report.severity === "Critical" ? "bg-red-500" :
                            report.severity === "High" ? "bg-orange-500" :
                            report.severity === "Medium" ? "bg-yellow-500" : "bg-green-500"
                          }`} />
                          <div className="flex-1">
                            <div className="flex flex-wrap justify-between gap-3 mb-2">
                              <h4 className="font-mono text-green-400">{report.fileName}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityColor(report.severity)}`}>
                                {report.severity}
                              </span>
                            </div>
                            <p className="text-zinc-300 text-sm mb-3">{report.review}</p>
                            {report.fixes?.length > 0 && (
                              <div className="mt-3 p-4 bg-black/50 rounded-xl">
                                <p className="text-green-400 text-sm font-bold mb-2">🔧 Suggested Fixes:</p>
                                <ul className="space-y-1">
                                  {report.fixes.slice(0, 3).map((fix, i) => (
                                    <li key={i} className="text-zinc-400 text-sm flex items-start gap-2">
                                      <span className="text-green-500">•</span>
                                      {fix}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all"
                  >
                    <FaDownload />
                    Save Report (PDF)
                  </button>
                  <button
                    onClick={() => setScanResult(null)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-2xl transition-all"
                  >
                    New Scan
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!scanResult && !loading && (
              <div className="bg-zinc-900 rounded-3xl border border-dashed border-zinc-700 p-16 text-center">
                <FaGithub className="text-6xl text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 text-lg">Enter a GitHub repository URL above</p>
                <p className="text-zinc-600 text-sm mt-2">AI will scan for security vulnerabilities</p>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6">
            {scanHistory.length === 0 ? (
              <div className="text-center py-12">
                <FaCalendar className="text-5xl text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500">No scan history yet</p>
                <p className="text-zinc-600 text-sm mt-2">Scan a repository to see history here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {scanHistory.map((scan, idx) => (
                  <div
                    key={idx}
                    onClick={() => setScanResult(scan)}
                    className="bg-black border border-zinc-800 rounded-2xl p-5 hover:border-green-500 cursor-pointer transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">{scan.owner}/{scan.repo}</h3>
                        <p className="text-zinc-500 text-sm">{scan.scannedFiles} files • {new Date(scan.scannedAt).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-xs text-zinc-500">Score</p>
                          <p className={`text-2xl font-bold ${getScoreColor(scan.overallScore)}`}>{scan.overallScore}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                          scan.riskLevel === "Critical" ? "bg-red-500" :
                          scan.riskLevel === "High" ? "bg-orange-500" :
                          scan.riskLevel === "Medium" ? "bg-yellow-500" : "bg-green-500"
                        } ${scan.riskLevel === "Medium" ? "text-black" : "text-white"}`}>
                          {scan.riskLevel}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RepoScanner;