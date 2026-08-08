import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import AnimatedCard from "../components/AnimatedCard";
import AnimatedStats from "../components/AnimatedStats";
import GlowButton from "../components/GlowButton";
import ProgressBar from "../components/ProgressBar";
import SeverityBadge from "../components/SeverityBadge";

const ScanReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scan = location.state;
  const [expandedCards, setExpandedCards] = useState({});

  // Toggle card expansion
  const toggleCard = (index) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // NO DATA
  if (!scan) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <ExclamationTriangleIcon className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-5xl font-black mb-5">No Report Found</h1>
          <p className="text-zinc-400 mb-8">The scan report you're looking for doesn't exist</p>
          <GlowButton
            variant="primary"
            onClick={() => navigate("/history")}
            icon={<ArrowLeftIcon />}
          >
            Go Back to History
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  // DOWNLOAD PDF
  const downloadPDF = () => {
    try {
      const pdf = new jsPDF();
      let y = 20;

      pdf.setFontSize(22);
      pdf.text("CodeGuardian AI Security Report", 20, y);
      y += 15;

      pdf.setFontSize(13);
      pdf.text(`Repository: ${scan.owner}/${scan.repo}`, 20, y);
      y += 10;
      pdf.text(`Overall Score: ${scan.overallScore}`, 20, y);
      y += 10;
      pdf.text(`Risk Level: ${scan.riskLevel}`, 20, y);
      y += 15;

      scan.reports?.forEach((report, index) => {
        if (y > 250) {
          pdf.addPage();
          y = 20;
        }

        pdf.setFontSize(15);
        pdf.text(`${index + 1}. ${report.fileName}`, 20, y);
        y += 8;

        pdf.setFontSize(12);
        pdf.text(`Severity: ${report.severity}`, 20, y);
        y += 8;

        const reviewLines = pdf.splitTextToSize(`Review: ${report.review}`, 170);
        pdf.text(reviewLines, 20, y);
        y += reviewLines.length * 7 + 10;

        if (report.fixes?.length > 0) {
          pdf.text("Suggested Fixes:", 20, y);
          y += 8;

          report.fixes.forEach((fix) => {
            const fixLines = pdf.splitTextToSize(`• ${fix}`, 160);
            pdf.text(fixLines, 25, y);
            y += fixLines.length * 7 + 5;
          });
        }
        y += 12;
      });

      pdf.save(`${scan.repo}-security-report.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Actions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
          <GlowButton
            variant="ghost"
            onClick={() => navigate("/history")}
            icon={<ArrowLeftIcon />}
          >
            Back to History
          </GlowButton>

          <GlowButton
            variant="primary"
            onClick={downloadPDF}
            icon={<ArrowDownTrayIcon />}
          >
            Download PDF Report
          </GlowButton>
        </motion.div>

        {/* Report Header */}
        <AnimatedCard delay={0.1} gradient className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/50"
            >
              <ShieldCheckIcon className="w-10 h-10 text-white" />
            </motion.div>

            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-black mb-2"
              >
                Security Scan Report
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-zinc-400 text-lg break-all"
              >
                <span className="font-mono text-green-400">{scan.owner}/{scan.repo}</span>
              </motion.p>
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <SeverityBadge severity={scan.riskLevel} size="lg" />
            </motion.div>
          </div>
        </AnimatedCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Security Score */}
          <AnimatedCard delay={0.2} gradient>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-2xl">
                <ShieldCheckIcon className="w-8 h-8 text-green-400" />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="text-right"
              >
                <div className="text-5xl font-black text-white">
                  <AnimatedStats value={scan.overallScore} duration={2} />
                </div>
              </motion.div>
            </div>
            <p className="text-zinc-400 text-sm mb-3">Security Score</p>
            <ProgressBar 
              progress={scan.overallScore} 
              color={scan.overallScore >= 70 ? "green" : scan.overallScore >= 50 ? "yellow" : "red"}
              height="md"
              showPercentage={false}
            />
          </AnimatedCard>

          {/* Risk Level */}
          <AnimatedCard delay={0.3} gradient>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-2xl">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
              </div>
              <motion.h2
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="text-4xl font-black"
              >
                {scan.riskLevel}
              </motion.h2>
            </div>
            <p className="text-zinc-400 text-sm mb-3">Risk Level</p>
            <div className="text-xs text-zinc-500">
              Based on severity distribution
            </div>
          </AnimatedCard>

          {/* Files Scanned */}
          <AnimatedCard delay={0.4} gradient>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-2xl">
                <DocumentTextIcon className="w-8 h-8 text-blue-400" />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                className="text-5xl font-black text-white"
              >
                <AnimatedStats value={scan.scannedFiles} duration={2} />
              </motion.div>
            </div>
            <p className="text-zinc-400 text-sm mb-3">Files Analyzed</p>
            <div className="text-xs text-zinc-500">
              Deep security analysis complete
            </div>
          </AnimatedCard>
        </div>

        {/* Severity Breakdown */}
        {scan.severityBreakdown && (
          <AnimatedCard delay={0.5} gradient className="mb-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <SparklesIcon className="w-6 h-6 text-purple-400" />
              Severity Breakdown
            </h3>
            <div className="space-y-4">
              {Object.entries(scan.severityBreakdown).map(([severity, count], index) => (
                <motion.div
                  key={severity}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <SeverityBadge severity={severity} size="md" />
                      <span className="text-zinc-400">{count} {count === 1 ? 'issue' : 'issues'}</span>
                    </div>
                    <span className="text-zinc-500 text-sm">
                      {count > 0 ? Math.round((count / scan.scannedFiles) * 100) : 0}%
                    </span>
                  </div>
                  <ProgressBar
                    progress={count > 0 ? Math.min((count / scan.scannedFiles) * 100, 100) : 0}
                    color={
                      severity === "Critical" ? "red" :
                      severity === "High" ? "yellow" :
                      severity === "Medium" ? "blue" : "green"
                    }
                    height="md"
                    showPercentage={false}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatedCard>
        )}

        {/* Vulnerability Reports */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
            <ExclamationTriangleIcon className="w-8 h-8 text-yellow-400" />
            Detected Vulnerabilities ({scan.reports?.length || 0})
          </h2>

          {scan.reports?.map((report, index) => (
            <AnimatedCard key={index} delay={0.9 + index * 0.05} gradient>
              <div className="space-y-4">
                {/* Card Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h3 className="text-xl font-bold text-white break-all">
                        {report.fileName}
                      </h3>
                      <SeverityBadge severity={report.severity} size="md" />
                    </div>
                    <p className="text-sm text-zinc-500">
                      Issue #{index + 1} • AI-Powered Analysis
                    </p>
                  </div>

                  <motion.button
                    onClick={() => toggleCard(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl transition-all text-sm"
                  >
                    {expandedCards[index] ? "Show Less" : "Show More"}
                    {expandedCards[index] ? (
                      <ChevronUpIcon className="w-4 h-4" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>

                {/* AI Review - Always visible */}
                <div className="bg-black/30 rounded-xl p-5 border border-zinc-800">
                  <h4 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5" />
                    AI Security Analysis
                  </h4>
                  <p className="text-zinc-300 leading-relaxed">
                    {report.review}
                  </p>
                </div>

                {/* Expandable Fixes Section */}
                <AnimatePresence>
                  {expandedCards[index] && report.fixes?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-5 border border-blue-500/30">
                        <h4 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
                          <CheckCircleIcon className="w-5 h-5" />
                          Recommended Fixes
                        </h4>
                        <ul className="space-y-3">
                          {report.fixes.map((fix, fixIdx) => (
                            <motion.li
                              key={fixIdx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: fixIdx * 0.1 }}
                              className="flex items-start gap-3 bg-black/30 rounded-lg px-4 py-3 border border-zinc-800"
                            >
                              <div className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center mt-0.5">
                                <span className="text-blue-400 text-xs font-bold">{fixIdx + 1}</span>
                              </div>
                              <p className="text-zinc-300 text-sm leading-relaxed flex-1">
                                {fix}
                              </p>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedCard>
          ))}
        </motion.div>

        {/* Bottom Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-12 flex flex-col md:flex-row gap-4 justify-center"
        >
          <GlowButton
            variant="secondary"
            onClick={() => navigate("/dashboard")}
          >
            Scan Another Repository
          </GlowButton>
          <GlowButton
            variant="primary"
            onClick={downloadPDF}
            icon={<ArrowDownTrayIcon />}
          >
            Download Full Report
          </GlowButton>
        </motion.div>
      </div>
    </div>
  );
};

export default ScanReport;
