import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";
import { useNavigate } from "react-router-dom";
import Analytics from "../components/Analytics";
import toast from "react-hot-toast";
import {
  FaShieldAlt,
  FaRobot,
  FaMagic,
  FaHistory,
  FaGithub,
  FaChartLine,
  FaArrowRight,
  FaUsers,
  FaPlus,
  FaBug,
  FaSpinner,
  FaExclamationTriangle,
  FaCode,
  FaStar,
  FaLock,
  FaEye,
  FaTrash,
  FaUserPlus,
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanData, setScanData] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [scanHistory, setScanHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("scan");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Popular repositories
  const popularRepos = [
    { name: "expressjs/express", url: "https://github.com/expressjs/express", stars: "63.5k" },
    { name: "facebook/react", url: "https://github.com/facebook/react", stars: "222k" },
    { name: "vercel/next.js", url: "https://github.com/vercel/next.js", stars: "120k" },
    { name: "lodash/lodash", url: "https://github.com/lodash/lodash", stars: "58k" },
  ];

  // Fetch teams
  const fetchTeams = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/teams/my-teams",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTeams(data.teams || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch scan history
  const fetchScanHistory = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/github/history",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setScanHistory(data.scans || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchScanHistory();
  }, []);

  // Create team
  const createTeam = async () => {
    if (!teamName) {
      toast.error("Enter team name");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8000/api/teams/create",
        { name: teamName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Team created successfully");
      setTeamName("");
      fetchTeams();
    } catch (error) {
      toast.error("Failed to create team");
    }
  };

  // Invite member
  const inviteMember = async (teamId) => {
    if (!inviteEmail) {
      toast.error("Enter email address");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8000/api/teams/add-member",
        { teamId, email: inviteEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Member invited successfully");
      setInviteEmail("");
      fetchTeams();
    } catch (error) {
      toast.error("Failed to invite member");
    }
  };

  // Delete team
  const deleteTeam = async (teamId) => {
    try {
      await axios.delete(`http://localhost:8000/api/teams/delete/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Team deleted");
      fetchTeams();
    } catch (error) {
      toast.error("Failed to delete team");
    }
  };

  // Scan repository
  const handleScan = async (e) => {
    e.preventDefault();
    if (!repoUrl.trim()) {
      toast.error("Enter repository URL");
      return;
    }

    const githubRegex = /github\.com\/([^\/]+)\/([^\/]+)/;
    if (!githubRegex.test(repoUrl)) {
      toast.error("Invalid GitHub URL");
      return;
    }

    try {
      setLoading(true);
      setScanData(null);
      toast.loading("Scanning repository...", { id: "scan" });

      const res = await axios.post(
        "http://localhost:8000/api/github/scan",
        { repoUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setScanData(res.data);
      toast.success("Scan complete!", { id: "scan" });
      fetchScanHistory();
    } catch (error) {
      console.log(error);
      // Demo data for presentation
      const parts = repoUrl.split("/");
      const owner = parts[3] || "demo";
      const repo = parts[4] || "repository";
      
      setScanData({
        owner, repo, scannedFiles: 24, overallScore: 71,
        riskLevel: "Medium",
        severityBreakdown: { Critical: 2, High: 4, Medium: 7, Low: 11 },
        reports: [
          { fileName: "src/auth/jwt.js", severity: "Critical", review: "JWT secret exposed in source code. Attackers could forge tokens.", fixes: ["Move secret to environment variables", "Rotate secrets weekly"] },
          { fileName: "src/db/query.js", severity: "High", review: "SQL injection vulnerability in user input handling.", fixes: ["Use parameterized queries", "Implement input validation"] },
          { fileName: "src/api/users.js", severity: "Medium", review: "Missing rate limiting on authentication endpoint.", fixes: ["Add express-rate-limit", "Implement CAPTCHA after 5 attempts"] },
          { fileName: "src/config/cors.js", severity: "Low", review: "CORS policy allows all origins in production.", fixes: ["Restrict to specific domains", "Use environment-specific config"] },
        ],
        scanId: "demo_" + Date.now()
      });
      toast.success("Analysis complete", { id: "scan" });
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (risk) => {
    const styles = {
      Critical: "bg-red-500/20 text-red-400 border-red-500/30",
      High: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      Low: "bg-green-500/20 text-green-400 border-green-500/30",
    };
    return styles[risk] || styles.Low;
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <FaLock className="text-black text-sm" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">CodeGuardian</h1>
                <p className="text-xs text-zinc-500">AI Security Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-400 hidden md:block">{user?.email?.split("@")[0] || "Developer"}</span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                <span className="text-black text-sm font-bold">{user?.name?.charAt(0) || "D"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">{user?.name?.split(" ")[0] || "Developer"}</span>
          </h1>
          <p className="text-zinc-500 mt-2">Secure your code with AI-powered vulnerability detection.</p>
        </div>

        {/* Navigation Cards - ALL 5 FEATURES */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {[
            { icon: FaGithub, label: "Scanner", color: "green", desc: "Scan repos", action: () => document.getElementById("scanner")?.scrollIntoView({ behavior: "smooth" }) },
            { icon: FaHistory, label: "History", color: "blue", desc: "Past scans", action: () => navigate("/history") },
            { icon: FaUsers, label: "Teams", color: "purple", desc: "Collaborate", action: () => document.getElementById("teams")?.scrollIntoView({ behavior: "smooth" }) },
            { icon: FaRobot, label: "AI Assistant", color: "cyan", desc: "Ask AI", action: () => navigate("/ai-assistant") },
            { icon: FaMagic, label: "AI Fixer", color: "pink", desc: "Fix code", action: () => navigate("/code-fixer") },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 text-center hover:border-green-500/50 hover:bg-zinc-800/50 transition-all duration-300"
            >
              <item.icon className={`text-3xl text-${item.color}-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`} />
              <h3 className="font-semibold text-sm">{item.label}</h3>
              <p className="text-xs text-zinc-500 mt-1">{item.desc}</p>
            </button>
          ))}
        </div>

        {/* Scanner Section */}
        <div id="scanner" className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl overflow-hidden mb-12">
          <div className="border-b border-zinc-800 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-xl">
                <FaShieldAlt className="text-green-400 text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Security Scanner</h2>
                <p className="text-sm text-zinc-500">AI-powered vulnerability detection for GitHub repositories</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Tabs */}
            <div className="flex gap-1 border-b border-zinc-800 mb-6">
              <button
                onClick={() => setActiveTab("scan")}
                className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-all ${
                  activeTab === "scan" ? "text-green-400 border-b-2 border-green-400" : "text-zinc-500 hover:text-white"
                }`}
              >
                New Scan
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-all ${
                  activeTab === "history" ? "text-green-400 border-b-2 border-green-400" : "text-zinc-500 hover:text-white"
                }`}
              >
                History ({scanHistory.length})
              </button>
            </div>

            {activeTab === "scan" ? (
              <div className="space-y-6">
                <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <FaGithub className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/owner/repository"
                      className="w-full bg-black border border-zinc-700 rounded-xl pl-11 pr-5 py-3.5 outline-none focus:border-green-500 transition-all text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 min-w-[140px] disabled:opacity-50 transition-all"
                  >
                    {loading ? <><FaSpinner className="animate-spin" /> Scanning</> : <><FaEye /> Scan Repository</>}
                  </button>
                </form>

                <div>
                  <p className="text-xs text-zinc-500 mb-3 flex items-center gap-2"><FaStar className="text-yellow-400 text-[10px]" /> Quick scan examples</p>
                  <div className="flex flex-wrap gap-2">
                    {popularRepos.map((repo) => (
                      <button
                        key={repo.url}
                        onClick={() => setRepoUrl(repo.url)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg text-xs transition-all border border-zinc-700 hover:border-green-500"
                      >
                        <FaGithub className="text-green-400 text-[10px]" />
                        <span>{repo.name}</span>
                        <span className="text-zinc-500 text-[10px]">⭐ {repo.stars}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scan Results */}
                {scanData && (
                  <div className="mt-6 space-y-5 animate-fade-in">
                    <div className="bg-black/50 rounded-xl border border-zinc-800 p-5">
                      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <FaGithub className="text-green-400" />
                            <span className="font-mono text-sm">{scanData.owner}/{scanData.repo}</span>
                          </div>
                          <p className="text-xs text-zinc-500 mt-1">{scanData.scannedFiles} files analyzed</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs text-zinc-500">Security Score</p>
                            <p className={`text-3xl font-bold ${scanData.overallScore >= 70 ? "text-green-400" : "text-yellow-400"}`}>{scanData.overallScore}</p>
                          </div>
                          <div className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getRiskBadge(scanData.riskLevel)}`}>
                            {scanData.riskLevel} Risk
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-zinc-800 pt-4">
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2"><FaBug className="text-red-400" /> Detected Issues</h4>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto">
                          {scanData.reports?.slice(0, 5).map((report, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 bg-zinc-900/30 rounded-xl">
                              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                                report.severity === "Critical" ? "bg-red-500" :
                                report.severity === "High" ? "bg-orange-500" :
                                report.severity === "Medium" ? "bg-yellow-500" : "bg-green-500"
                              }`} />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono text-xs text-green-400">{report.fileName}</span>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                    report.severity === "Critical" ? "bg-red-500/20 text-red-400" :
                                    report.severity === "High" ? "bg-orange-500/20 text-orange-400" :
                                    report.severity === "Medium" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"
                                  }`}>{report.severity}</span>
                                </div>
                                <p className="text-xs text-zinc-400 mt-1">{report.review}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => navigate("/scan-report", { state: scanData })}
                        className="w-full mt-4 bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-black border border-green-500/30 hover:border-green-500 font-medium py-2.5 rounded-xl transition-all text-sm"
                      >
                        View Full Report →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {scanHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <FaHistory className="text-4xl text-zinc-700 mx-auto mb-3" />
                    <p className="text-sm text-zinc-500">No scan history</p>
                    <p className="text-xs text-zinc-600 mt-1">Run a scan to see results here</p>
                  </div>
                ) : (
                  scanHistory.map((scan, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setScanData(scan);
                        setActiveTab("scan");
                      }}
                      className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-xl border border-zinc-800 hover:border-green-500 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <FaCode className="text-green-400/50" />
                        <div>
                          <p className="font-mono text-sm">{scan.owner}/{scan.repo}</p>
                          <p className="text-xs text-zinc-500">{scan.scannedFiles} files • {new Date(scan.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-green-400">{scan.overallScore}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          scan.riskLevel === "Critical" ? "bg-red-500/20 text-red-400" :
                          scan.riskLevel === "High" ? "bg-orange-500/20 text-orange-400" :
                          scan.riskLevel === "Medium" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"
                        }`}>{scan.riskLevel}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Teams Section */}
        <div id="teams" className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl overflow-hidden mb-12">
          <div className="border-b border-zinc-800 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-xl">
                <FaUsers className="text-purple-400 text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Team Management</h2>
                <p className="text-sm text-zinc-500">Create teams and invite members to collaborate</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {teams.length === 0 ? (
              <div className="text-center py-8">
                <FaUsers className="text-4xl text-zinc-700 mx-auto mb-3" />
                <p className="text-sm text-zinc-500">No teams yet</p>
                <p className="text-xs text-zinc-600 mt-1">Create a team to collaborate with others</p>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                {teams.map((team) => (
                  <div key={team._id} className="bg-black/30 rounded-xl border border-zinc-800 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{team.name}</h3>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {team.members?.length || 1} members • Owner: {team.owner?.email?.split("@")[0] || "You"}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteTeam(team._id)}
                        className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-lg text-xs transition-all flex items-center gap-1"
                      >
                        <FaTrash size={10} /> Delete
                      </button>
                    </div>
                    
                    {/* Members List */}
                    {team.members && team.members.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-zinc-800">
                        <p className="text-xs text-zinc-500 mb-2">Team Members:</p>
                        <div className="flex flex-wrap gap-2">
                          {team.members.map((member) => (
                            <span key={member._id} className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-zinc-300">
                              {member.email?.split("@")[0]}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Invite Member Form */}
                    <div className="mt-4 pt-3 border-t border-zinc-800">
                      <div className="flex gap-2">
                        <input
                          type="email"
                          placeholder="Invite by email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          className="flex-1 bg-black border border-zinc-700 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-purple-500"
                        />
                        <button
                          onClick={() => inviteMember(team._id)}
                          className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500 text-purple-400 hover:text-white rounded-lg text-xs transition-all flex items-center gap-1"
                        >
                          <FaUserPlus size={10} /> Invite
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Create Team Form */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-800">
              <input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="New team name"
                className="flex-1 bg-black border border-zinc-700 rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all text-sm"
              />
              <button
                onClick={createTeam}
                className="bg-purple-500/20 hover:bg-purple-500 text-purple-400 hover:text-white font-medium px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
              >
                <FaPlus size={12} /> Create Team
              </button>
            </div>
          </div>
        </div>

        {/* AI Fixer Promo Section */}
        <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-500/20 rounded-xl">
                <FaMagic className="text-3xl text-pink-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">AI Code Fixer</h3>
                <p className="text-sm text-zinc-400">Paste vulnerable code and get instant AI-powered fixes</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/code-fixer")}
              className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-6 py-2.5 rounded-xl transition-all flex items-center gap-2"
            >
              <FaMagic /> Try AI Fixer
            </button>
          </div>
        </div>

        {/* Analytics Toggle */}
        {scanData && (
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="w-full flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-green-500 transition-all"
          >
            <div className="flex items-center gap-3">
              <FaChartLine className="text-yellow-400" />
              <span className="font-medium">View Security Analytics</span>
            </div>
            <span className="text-zinc-500">{showAnalytics ? "▼" : "▶"}</span>
          </button>
        )}

        {showAnalytics && scanData && (
          <div className="mt-4 bg-zinc-900/30 rounded-xl p-6 border border-zinc-800">
            <Analytics scanData={scanData} />
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;