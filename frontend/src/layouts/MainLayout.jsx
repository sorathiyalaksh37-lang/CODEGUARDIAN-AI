import React from "react";
import { FaShieldAlt, FaHistory, FaSignOutAlt, FaHome, FaRobot, FaUsers } from "react-icons/fa";
import { Link, Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const MainLayout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* SIDEBAR */}
      <div className="w-[280px] bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col fixed h-full">
        {/* LOGO */}
        <div className="mb-10">
          <h1 className="text-3xl font-black bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            CodeGuardian
          </h1>
          <p className="text-zinc-500 text-sm mt-1">AI Security Scanner</p>
        </div>

        {/* MENU */}
        <div className="flex flex-col gap-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-zinc-400 hover:text-white hover:bg-zinc-900 px-4 py-3 rounded-xl transition-all"
          >
            <FaHome className="text-lg" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/history"
            className="flex items-center gap-3 text-zinc-400 hover:text-white hover:bg-zinc-900 px-4 py-3 rounded-xl transition-all"
          >
            <FaHistory className="text-lg" />
            <span>Scan History</span>
          </Link>

          <Link
            to="/teams"
            className="flex items-center gap-3 text-zinc-400 hover:text-white hover:bg-zinc-900 px-4 py-3 rounded-xl transition-all"
          >
            <FaUsers className="text-lg" />
            <span>Teams</span>
          </Link>

          <Link
            to="/ai-assistant"
            className="flex items-center gap-3 text-zinc-400 hover:text-white hover:bg-zinc-900 px-4 py-3 rounded-xl transition-all"
          >
            <FaRobot className="text-lg" />
            <span>AI Assistant</span>
          </Link>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={logout}
          className="mt-auto flex items-center gap-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-4 py-3 rounded-xl font-bold transition-all"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-[280px] overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;