import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import ScanReport from "./pages/ScanReport";
import AiAssistant from "./pages/AiAssistant";
import CodeFixer from "./pages/CodeFixer";
import OAuthSuccess from "./pages/OAuthSuccess";
import AnalyticsPage from "./pages/AnalyticsPage";
import Teams from "./pages/Teams";
import MainLayout from "./layouts/MainLayout";
import TeamChat from "./components/TeamChat";
import { Toaster } from "react-hot-toast";
import { NotificationProvider } from "./context/NotificationContext";

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <NotificationProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#111",
              color: "#fff",
              border: "1px solid #22c55e",
              padding: "16px",
              fontWeight: "bold",
            },
          }}
        />

        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          {/* PROTECTED ROUTES WITH LAYOUT */}
          <Route
            element={token ? <MainLayout /> : <Navigate to="/login" />}
          >
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/scan-report" element={<ScanReport />} />
            <Route path="/ai-assistant" element={<AiAssistant />} />
            <Route path="/code-fixer" element={<CodeFixer />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/team-chat/:id" element={<TeamChat />} />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
};

export default App;