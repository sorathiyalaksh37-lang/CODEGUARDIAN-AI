import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  HomeIcon,
  ClockIcon,
  UserGroupIcon,
  SparklesIcon,
  CodeBracketIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: HomeIcon },
    { path: "/history", label: "Scan History", icon: ClockIcon },
    { path: "/teams", label: "Teams", icon: UserGroupIcon },
    { path: "/ai-assistant", label: "AI Assistant", icon: SparklesIcon },
    { path: "/code-fixer", label: "Code Fixer", icon: CodeBracketIcon },
    { path: "/analytics", label: "Analytics", icon: ChartBarIcon },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-black text-white relative">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hidden lg:flex w-[280px] bg-zinc-950/50 backdrop-blur-xl border-r border-zinc-800 p-6 flex-col fixed h-full z-40"
      >
        {/* Logo */}
        <Link to="/dashboard" className="mb-10 group">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/50 group-hover:shadow-green-500/70 transition-all">
              <ShieldCheckIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                CodeGuardian
              </h1>
              <p className="text-zinc-500 text-xs">AI Security Platform</p>
            </div>
          </motion.div>
        </Link>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user?.name || "User"}</p>
              <p className="text-xs text-zinc-500 truncate">{user?.email || "user@example.com"}</p>
            </div>
          </div>
        </motion.div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.path);
            
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <Link
                  to={item.path}
                  className={`
                    relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group
                    ${isActive 
                      ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white border border-green-500/30" 
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-5 h-5 relative z-10 ${isActive ? "text-green-400" : ""} group-hover:scale-110 transition-transform`} />
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-2 h-2 bg-green-400 rounded-full"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={logout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 flex items-center gap-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-4 py-3 rounded-xl font-bold transition-all group border border-red-500/20 hover:border-red-500"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span>Logout</span>
        </motion.button>
      </motion.aside>

      {/* Mobile Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800"
      >
        <div className="flex items-center justify-between px-4 py-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/50">
              <ShieldCheckIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-black bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              CodeGuardian
            </h1>
          </Link>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 hover:border-green-500/50 transition-all"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <XMarkIcon className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Bars3Icon className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-[280px] bg-zinc-950/95 backdrop-blur-xl border-l border-zinc-800 z-50 p-6 flex flex-col"
            >
              {/* User Info */}
              <div className="mb-8 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center font-bold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{user?.name || "User"}</p>
                    <p className="text-xs text-zinc-500 truncate">{user?.email || "user@example.com"}</p>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 space-y-2">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.path);
                  
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                          ${isActive 
                            ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white border border-green-500/30" 
                            : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                          }
                        `}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? "text-green-400" : ""}`} />
                        <span>{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Mobile Logout */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="mt-6 flex items-center gap-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-4 py-3 rounded-xl font-bold transition-all border border-red-500/20"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Logout</span>
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-[280px] mt-[72px] lg:mt-0 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
