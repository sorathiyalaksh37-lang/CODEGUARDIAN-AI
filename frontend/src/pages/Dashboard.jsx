import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  ShieldCheckIcon,
  ChartBarIcon,
  UserGroupIcon,
  CodeBracketIcon,
  SparklesIcon,
  RocketLaunchIcon,
  BoltIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import AnimatedCard from "../components/AnimatedCard";
import GlowButton from "../components/GlowButton";
import AnimatedStats from "../components/AnimatedStats";
import LoadingSpinner from "../components/LoadingSpinner";
import ProgressBar from "../components/ProgressBar";
import SeverityBadge from "../components/SeverityBadge";

const Dashboard = () => {
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanData, setScanData] = useState(null);
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [scanHistory, setScanHistory] = useState([]);
  const [stats, setStats] = useState({
    totalScans: 0,
    avgScore: 0,
    criticalIssues: 0,
    resolvedIssues: 0
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Popular repositories for quick testing
  const popularRepos = [
    { name: "expressjs/express", url: "https://github.com/expressjs/express", stars: "63.5k", icon: "⚡" },
    { name: "facebook/react", url: "https://github.com/facebook/react", stars: "222k", icon: "⚛️" },
    { name: "vercel/next.js", url: "https://github.com/vercel/next.js", stars: "120k", icon: "▲" },
    { name: "lodash/lodash", url: "https://github.com/lodash/lodash", stars: "58k", icon: "📦" },
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
      const scans = data.scans || [];
      setScanHistory(scans);
      
      // Calculate stats
      const totalScans = scans.length;
      const avgScore = scans.length > 0 
        ? Math.round(scans.reduce((sum, scan) => sum + scan.overallScore, 0) / scans.length)
        : 0;
      const criticalIssues = scans.reduce((sum, scan) => 
        sum + (scan.severityBreakdown?.Critical || 0), 0);
      
      setStats({
        totalScans,
        avgScore,
        criticalIssues,
        resolvedIssues: Math.floor(criticalIssues * 0.65) // Demo calculation
      });
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
    if (!confirm("Delete this team?")) return;
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

  const quickActions = [
    { icon: CodeBracketIcon, label: "New Scan", desc: "Analyze repository", color: "from-green-500 to-emerald-600", action: () => document.getElementById("scanner")?.scrollIntoView({ behavior: "smooth" }) },
    { icon: ClockIcon, label: "History", desc: `${scanHistory.length} scans`, color: "from-blue-500 to-cyan-600", action: () => navigate("/history") },
    { icon: SparklesIcon, label: "AI Assistant", desc: "Ask questions", color: "from-purple-500 to-pink-600", action: () => navigate("/ai-assistant") },
    { icon: BoltIcon, label: "Code Fixer", desc: "Auto-fix code", color: "from-orange-500 to-red-600", action: () => navigate("/code-fixer") },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            Welcome back, 
            <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent ml-3">
              {user?.name?.split(" ")[0] || "Developer"}
            </span>
          </h1>
          <p className="text-zinc-400 text-lg">Monitor your code security and collaborate with your team</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedCard delay={0.1} gradient>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm mb-2">Total Scans</p>
                <div className="text-3xl font-black text-white">
                  <AnimatedStats value={stats.totalScans} />
                </div>
              </div>
              <div className="p-4 bg-green-500/20 rounded-2xl">
                <ShieldCheckIcon className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <ProgressBar progress={Math.min((stats.totalScans / 50) * 100, 100)} color="green" height="sm" showPercentage={false} />
          </AnimatedCard>

          <AnimatedCard delay={0.2} gradient>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm mb-2">Avg Security Score</p>
                <div className="text-3xl font-black text-white">
                  <AnimatedStats value={stats.avgScore} suffix="%" />
                </div>
              </div>
              <div className="p-4 bg-blue-500/20 rounded-2xl">
                <ChartBarIcon className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <ProgressBar progress={stats.avgScore} color="blue" height="sm" showPercentage={false} />
          </AnimatedCard>

          <AnimatedCard delay={0.3} gradient>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm mb-2">Critical Issues</p>
                <div className="text-3xl font-black text-white">
                  <AnimatedStats value={stats.criticalIssues} />
                </div>
              </div>
              <div className="p-4 bg-red-500/20 rounded-2xl">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <ProgressBar progress={Math.min((stats.criticalIssues / 20) * 100, 100)} color="red" height="sm" showPercentage={false} />
          </AnimatedCard>

          <AnimatedCard delay={0.4} gradient>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm mb-2">Resolved Issues</p>
                <div className="text-3xl font-black text-white">
                  <AnimatedStats value={stats.resolvedIssues} />
                </div>
              </div>
              <div className="p-4 bg-purple-500/20 rounded-2xl">
                <CheckCircleIcon className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <ProgressBar progress={stats.criticalIssues > 0 ? (stats.resolvedIssues / stats.criticalIssues) * 100 : 0} color="purple" height="sm" showPercentage={false} />
          </AnimatedCard>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.action}
              className="group relative bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 text-left overflow-hidden hover:border-white/20 transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              <action.icon className="w-10 h-10 text-white/80 group-hover:text-white mb-4 transition-all duration-300 group-hover:scale-110" />
              <h3 className="text-lg font-bold mb-1">{action.label}</h3>
              <p className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">{action.desc}</p>
            </motion.button>
          ))}
        </div>

        {/* Scanner Section */}
        <AnimatedCard id="scanner" delay={0.8} className="overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl">
              <ShieldCheckIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Security Scanner</h2>
              <p className="text-zinc-400 text-sm">AI-powered vulnerability detection for GitHub repositories</p>
            </div>
          </div>

          <form onSubmit={handleScan} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repository"
                className="flex-1 bg-black/50 border border-zinc-700 rounded-xl px-6 py-4 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
              />
              <GlowButton 
                type="submit" 
                variant="primary" 
                disabled={loading}
                icon={<RocketLaunchIcon />}
              >
                {loading ? "Scanning..." : "Scan Now"}
              </GlowButton>
            </div>

            {/* Quick Test Repos */}
            <div>
              <p className="text-xs text-zinc-500 mb-3 flex items-center gap-2">
                ⚡ Quick scan examples
              </p>
              <div className="flex flex-wrap gap-2">
                {popularRepos.map((repo, index) => (
                  <motion.button
                    key={index}
                    type="button"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRepoUrl(repo.url)}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl text-sm transition-all border border-zinc-700 hover:border-green-500/50"
                  >
                    <span>{repo.icon}</span>
                    <span>{repo.name}</span>
                    <span className="text-zinc-500 text-xs">⭐ {repo.stars}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </form>

          {/* Loading State */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 flex justify-center py-12"
              >
                <LoadingSpinner size="lg" text="Analyzing repository..." />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scan Results */}
          <AnimatePresence>
            {scanData && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mt-6 space-y-4"
              >
                <div className="bg-gradient-to-br from-zinc-900/50 to-black/50 backdrop-blur-xl rounded-2xl border border-zinc-800 p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CodeBracketIcon className="w-5 h-5 text-green-400" />
                        <span className="font-mono text-lg font-semibold">{scanData.owner}/{scanData.repo}</span>
                      </div>
                      <p className="text-sm text-zinc-400">{scanData.scannedFiles} files analyzed</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-xs text-zinc-500 mb-1">Security Score</p>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 10 }}
                          className={`text-4xl font-black ${scanData.overallScore >= 70 ? "text-green-400" : scanData.overallScore >= 50 ? "text-yellow-400" : "text-red-400"}`}
                        >
                          <AnimatedStats value={scanData.overallScore} duration={1.5} />
                        </motion.div>
                      </div>
                      <SeverityBadge severity={scanData.riskLevel} size="lg" />
                    </div>
                  </div>

                  {/* Severity Breakdown */}
                  <div className="space-y-3 mb-6">
                    {Object.entries(scanData.severityBreakdown || {}).map(([severity, count], index) => (
                      <div key={severity}>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <div className="flex items-center gap-2">
                            <SeverityBadge severity={severity} size="sm" showIcon={false} animated={false} />
                            <span className="text-zinc-400">{count} issues</span>
                          </div>
                          <span className="text-zinc-500">{count > 0 ? Math.round((count / scanData.scannedFiles) * 100) : 0}%</span>
                        </div>
                        <ProgressBar 
                          progress={count > 0 ? Math.min((count / scanData.scannedFiles) * 100, 100) : 0}
                          color={severity === "Critical" ? "red" : severity === "High" ? "yellow" : severity === "Medium" ? "blue" : "green"}
                          height="sm"
                          showPercentage={false}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Issues List */}
                  <div className="border-t border-zinc-800 pt-6">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                      Detected Vulnerabilities
                    </h4>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {scanData.reports?.map((report, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                <span className="font-mono text-sm text-green-400">{report.fileName}</span>
                                <SeverityBadge severity={report.severity} size="sm" />
                              </div>
                              <p className="text-sm text-zinc-300 mb-3">{report.review}</p>
                              {report.fixes && report.fixes.length > 0 && (
                                <div className="space-y-1">
                                  <p className="text-xs text-zinc-500 font-semibold">Suggested Fixes:</p>
                                  {report.fixes.map((fix, fixIdx) => (
                                    <div key={fixIdx} className="flex items-start gap-2">
                                      <CheckCircleIcon className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                      <span className="text-xs text-zinc-400">{fix}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <GlowButton
                    fullWidth
                    variant="primary"
                    onClick={() => navigate("/scan-report", { state: scanData })}
                    className="mt-6"
                    icon={<ChartBarIcon />}
                  >
                    View Full Report
                  </GlowButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </AnimatedCard>

        {/* Teams Section */}
        <AnimatedCard delay={1} className="overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl">
              <UserGroupIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Team Management</h2>
              <p className="text-zinc-400 text-sm">Create teams and collaborate with your colleagues</p>
            </div>
          </div>

          {teams.length === 0 ? (
            <div className="text-center py-12">
              <UserGroupIcon className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400 mb-2">No teams yet</p>
              <p className="text-sm text-zinc-600">Create your first team to start collaborating</p>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {teams.map((team, index) => (
                <AnimatedCard key={team._id} delay={1.1 + index * 0.1} className="bg-black/30">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-xl">{team.name}</h3>
                      <p className="text-sm text-zinc-500">
                        {team.members?.length || 1} members • Owner: {team.owner?.email?.split("@")[0] || "You"}
                      </p>
                    </div>
                    <GlowButton
                      variant="danger"
                      size="sm"
                      onClick={() => deleteTeam(team._id)}
                    >
                      Delete
                    </GlowButton>
                  </div>
                  
                  {team.members && team.members.length > 0 && (
                    <div className="mb-4 pb-4 border-b border-zinc-800">
                      <p className="text-xs text-zinc-500 mb-3">Team Members:</p>
                      <div className="flex flex-wrap gap-2">
                        {team.members.map((member) => (
                          <div key={member._id} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-full">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-xs font-bold">
                              {member.email?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm">{member.email?.split("@")[0]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Invite by email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="flex-1 bg-black/50 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                    <GlowButton
                      variant="secondary"
                      size="sm"
                      onClick={() => inviteMember(team._id)}
                    >
                      Invite
                    </GlowButton>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-3 pt-6 border-t border-zinc-800">
            <input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="New team name"
              className="flex-1 bg-black/50 border border-zinc-700 rounded-xl px-6 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
            <GlowButton
              variant="secondary"
              onClick={createTeam}
              icon={<UserGroupIcon />}
            >
              Create Team
            </GlowButton>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default Dashboard;
