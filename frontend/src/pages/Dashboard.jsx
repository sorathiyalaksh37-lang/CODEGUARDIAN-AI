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
  FaFilePdf,
  FaBug,
  FaTrash,
  FaComments,
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
  const [selectedTeam, setSelectedTeam] = useState(null);

  const token = localStorage.getItem("token");

  // FETCH TEAMS
  const fetchTeams = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/teams/my-teams",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTeams(data.teams || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed To Load Teams");
    }
  };

  useEffect(() => {
    if (token) {
      fetchTeams();
    }
  }, [token]);

  // SOCKET NOTIFICATIONS
  useEffect(() => {
    socket.on("scan-completed", (data) => {
      toast.success(`Repository ${data?.repo || ""} Secured Successfully`);
    });

    socket.on("new-vulnerability", () => {
      toast.error("New Vulnerability Detected");
    });

    return () => {
      socket.off("scan-completed");
      socket.off("new-vulnerability");
    };
  }, []);

  // CREATE TEAM
  const createTeam = async () => {
    try {
      if (!teamName) {
        toast.error("Enter Team Name");
        return;
      }

      await axios.post(
        "http://localhost:8000/api/teams/create",
        { name: teamName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Team Created Successfully");
      setTeamName("");
      fetchTeams();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Create Team Failed");
    }
  };

  // DELETE TEAM
  const deleteTeam = async (teamId) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/teams/delete/${teamId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Team Deleted");
      fetchTeams();
      if (selectedTeam?._id === teamId) {
        setSelectedTeam(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete Failed");
    }
  };

  // INVITE MEMBER
  const inviteMember = async (teamId) => {
    try {
      if (!inviteEmail) {
        toast.error("Enter email address");
        return;
      }

      await axios.post(
        "http://localhost:8000/api/teams/add-member",
        { teamId, email: inviteEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Member Invited Successfully");
      setInviteEmail("");
      fetchTeams();
    } catch (error) {
      toast.error(error.response?.data?.message || "Invite Failed");
    }
  };

  // SCAN REPOSITORY
  const handleScan = async (e) => {
    e.preventDefault();

    if (!repoUrl) {
      toast.error("Enter Repository URL");
      return;
    }

    try {
      setLoading(true);
      setScanData(null);

      toast.loading("Scanning Repository...", {
        id: "scan",
      });

      const res = await axios.post(
        "http://localhost:8000/api/github/scan",
        { repoUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setScanData(res.data);

      toast.success("Scan Completed Successfully", {
        id: "scan",
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Scan Failed", {
        id: "scan",
      });
    } finally {
      setLoading(false);
    }
  };

  // DOWNLOAD PDF
  const downloadPDF = async () => {
    if (!scanData?.scanId) {
      toast.error("No scan data available");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/api/github/download/${scanData.scanId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${scanData.repo}-security-report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("PDF Downloaded Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to download PDF");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      {/* HERO SECTION */}
      <div className="bg-gradient-to-br from-zinc-950 to-green-950/20 border border-zinc-800 rounded-[35px] p-10">
        <div className="flex items-center gap-5">
          <div className="w-24 h-24 rounded-3xl bg-green-500 flex items-center justify-center">
            <FaShieldAlt className="text-black text-5xl" />
          </div>
          <div>
            <h1 className="text-6xl font-black">CODEGUARDIAN</h1>
            <p className="text-zinc-400 mt-2 text-lg">
              AI Cyber Security Platform
            </p>
          </div>
        </div>
      </div>

      {/* FEATURES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mt-10">
        <button
          onClick={() => navigate("/teams")}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7 hover:bg-zinc-800 transition-all group"
        >
          <FaUsers className="text-5xl text-green-400 group-hover:scale-110 transition-transform" />
          <h2 className="text-2xl font-black mt-5">Teams</h2>
          <p className="text-zinc-500 text-sm mt-2">Collaborate with team</p>
        </button>

        <button
          onClick={() => navigate("/history")}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7 hover:bg-zinc-800 transition-all group"
        >
          <FaHistory className="text-5xl text-blue-400 group-hover:scale-110 transition-transform" />
          <h2 className="text-2xl font-black mt-5">History</h2>
          <p className="text-zinc-500 text-sm mt-2">View past scans</p>
        </button>

        <button
          onClick={() => navigate("/ai-assistant")}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7 hover:bg-zinc-800 transition-all group"
        >
          <FaRobot className="text-5xl text-purple-400 group-hover:scale-110 transition-transform" />
          <h2 className="text-2xl font-black mt-5">AI Assistant</h2>
          <p className="text-zinc-500 text-sm mt-2">Ask security questions</p>
        </button>

        <button
          onClick={() => navigate("/code-fixer")}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7 hover:bg-zinc-800 transition-all group"
        >
          <FaMagic className="text-5xl text-pink-400 group-hover:scale-110 transition-transform" />
          <h2 className="text-2xl font-black mt-5">AI Fixer</h2>
          <p className="text-zinc-500 text-sm mt-2">Fix vulnerabilities</p>
        </button>

        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7 hover:bg-zinc-800 transition-all group"
        >
          <FaChartLine className="text-5xl text-yellow-400 group-hover:scale-110 transition-transform" />
          <h2 className="text-2xl font-black mt-5">Analytics</h2>
          <p className="text-zinc-500 text-sm mt-2">View insights</p>
        </button>
      </div>

      {/* MY TEAMS SECTION */}
      <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-[30px] p-7">
        <div className="flex items-center gap-4 mb-6">
          <FaUsers className="text-green-400 text-3xl" />
          <h2 className="text-3xl font-black">My Teams</h2>
        </div>

        {teams.length === 0 ? (
          <div className="text-center text-zinc-500 py-8">
            No teams yet. Create your first team below!
          </div>
        ) : (
          <div className="space-y-4">
            {teams.map((team) => (
              <div key={team._id} className="bg-black rounded-2xl p-5 border border-zinc-800">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-green-400">{team.name}</h3>
                    <p className="text-zinc-500 text-sm">
                      {team.members?.length || 1} members • Owner: {team.owner?.email?.split("@")[0] || "You"}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/team-chat/${team._id}`)}
                      className="bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white px-4 py-2 rounded-xl transition-all flex items-center gap-2"
                    >
                      <FaComments />
                      Chat
                    </button>
                    <button
                      onClick={() => deleteTeam(team._id)}
                      className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-4 py-2 rounded-xl transition-all flex items-center gap-2"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Team Form */}
        <div className="mt-6 pt-6 border-t border-zinc-800">
          <h3 className="text-lg font-bold mb-4">Create New Team</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter Team Name"
              className="flex-1 bg-black border border-zinc-700 rounded-2xl px-5 py-3 outline-none focus:border-green-500"
            />
            <button
              onClick={createTeam}
              className="bg-green-500 hover:bg-green-600 text-black font-bold px-8 py-3 rounded-2xl transition-all"
            >
              Create Team
            </button>
          </div>
        </div>
      </div>

      {/* SCAN REPOSITORY SECTION */}
      <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-[35px] p-8">
        <div className="flex items-center gap-4 mb-7">
          <FaGithub className="text-4xl text-green-400" />
          <h2 className="text-4xl font-black">Scan GitHub Repository</h2>
        </div>

        <form onSubmit={handleScan} className="flex flex-col xl:flex-row gap-5">
          <input
            type="text"
            placeholder="https://github.com/owner/repository"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="flex-1 bg-black border border-zinc-700 rounded-2xl px-6 py-5 outline-none text-lg focus:border-green-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-black font-bold px-10 rounded-2xl text-xl flex items-center justify-center gap-3 min-w-[250px] disabled:opacity-50"
          >
            {loading ? "SCANNING..." : "SCAN NOW"}
            <FaArrowRight />
          </button>
        </form>
      </div>

      {/* LIVE ANALYSIS LOADING */}
      {loading && (
        <div className="mt-10 bg-zinc-900 border border-green-500 rounded-[35px] p-8 animate-pulse">
          <h2 className="text-4xl font-black text-green-400 mb-8">LIVE AI ANALYSIS</h2>
          <div className="space-y-5">
            <div className="bg-black p-5 rounded-2xl">🔍 Repository Security Scan Running...</div>
            <div className="bg-black p-5 rounded-2xl">🐛 Detecting Vulnerabilities...</div>
            <div className="bg-black p-5 rounded-2xl">🤖 Generating AI Security Fixes...</div>
          </div>
        </div>
      )}

      {/* SCAN RESULTS */}
      {scanData && (
        <div className="mt-10">
          <div className="flex flex-wrap gap-5 mb-8">
            <button
              onClick={() => navigate("/scan-report", { state: scanData })}
              className="bg-green-500 hover:bg-green-600 text-black font-bold px-8 py-4 rounded-2xl transition-all"
            >
              📄 SHOW FULL REPORT
            </button>
            <button
              onClick={downloadPDF}
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-4 rounded-2xl flex items-center gap-3 transition-all"
            >
              <FaFilePdf />
              DOWNLOAD PDF REPORT
            </button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-[35px] p-8">
            <h2 className="text-4xl font-black mb-8">🔐 Security Analysis Results</h2>
            
            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-black rounded-2xl p-6 text-center">
                <p className="text-zinc-400">Overall Security Score</p>
                <h3 className="text-6xl font-black text-green-400">{scanData.overallScore || 0}</h3>
              </div>
              <div className="bg-black rounded-2xl p-6 text-center">
                <p className="text-zinc-400">Risk Level</p>
                <h3 className={`text-5xl font-black ${
                  scanData.riskLevel === "Critical" ? "text-red-500" :
                  scanData.riskLevel === "High" ? "text-orange-500" :
                  scanData.riskLevel === "Medium" ? "text-yellow-500" : "text-green-500"
                }`}>
                  {scanData.riskLevel || "Unknown"}
                </h3>
              </div>
              <div className="bg-black rounded-2xl p-6 text-center">
                <p className="text-zinc-400">Files Scanned</p>
                <h3 className="text-6xl font-black text-blue-400">{scanData.scannedFiles || 0}</h3>
              </div>
            </div>

            {/* Vulnerabilities List */}
            <h3 className="text-2xl font-bold mb-5">📋 Detected Vulnerabilities</h3>
            <div className="space-y-5">
              {scanData.reports?.slice(0, 15)?.map((report, index) => (
                <div key={index} className="bg-black border border-zinc-800 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <FaBug className="text-red-500 text-2xl mt-1" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{report.fileName}</h3>
                      <p className="text-zinc-400 mt-3">{report.review}</p>
                      <div className="flex flex-wrap gap-3 mt-4">
                        <span className={`inline-block px-4 py-2 rounded-full font-bold text-sm ${
                          report.severity === "Critical" ? "bg-red-500 text-white" :
                          report.severity === "High" ? "bg-orange-500 text-white" :
                          report.severity === "Medium" ? "bg-yellow-500 text-black" : "bg-green-500 text-black"
                        }`}>
                          {report.severity}
                        </span>
                      </div>
                      {report.fixes?.length > 0 && (
                        <div className="mt-4 p-4 bg-zinc-900 rounded-xl">
                          <p className="text-green-400 font-bold mb-2">Suggested Fixes:</p>
                          <ul className="list-disc list-inside text-zinc-300 space-y-1">
                            {report.fixes.slice(0, 3).map((fix, idx) => (
                              <li key={idx}>{fix}</li>
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
        </div>
      )}

      {/* ANALYTICS SECTION */}
      {showAnalytics && scanData && (
        <div className="mt-10">
          <Analytics scanData={scanData} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;