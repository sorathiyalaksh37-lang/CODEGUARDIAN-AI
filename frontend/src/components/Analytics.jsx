import React from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

import {
  FaChartPie,
  FaBug,
  FaShieldAlt,
  FaCode,
  FaBrain,
} from "react-icons/fa";

const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
];

const Analytics = ({ scanData }) => {

  if (!scanData) {

    return null;

  }

  const severityData = [

    {
      name: "Critical",
      value:
        scanData
          ?.severityBreakdown
          ?.Critical || 0,
    },

    {
      name: "High",
      value:
        scanData
          ?.severityBreakdown
          ?.High || 0,
    },

    {
      name: "Medium",
      value:
        scanData
          ?.severityBreakdown
          ?.Medium || 0,
    },

    {
      name: "Low",
      value:
        scanData
          ?.severityBreakdown
          ?.Low || 0,
    },

  ];

  const performanceData = [

    {
      name: "Files",
      value:
        scanData?.scannedFiles || 0,
    },

    {
      name: "Score",
      value:
        scanData?.overallScore || 0,
    },

    {
      name: "Issues",
      value:
        scanData?.reports?.length || 0,
    },

  ];

  const aiStats = [

    {
      name: "AI Accuracy",
      value: 98,
    },

    {
      name: "Detection",
      value: 96,
    },

    {
      name: "Optimization",
      value: 94,
    },

    {
      name: "Coverage",
      value: 99,
    },

  ];

  return (

    <div className="mt-12 space-y-8">

      {/* TITLE */}

      <div>

        <h2
          className="
          text-4xl
          font-black
          text-white
          "
        >
          Enterprise Security Analytics
        </h2>

        <p className="text-zinc-400 mt-3 text-lg">
          Professional cyber intelligence dashboard powered by AI.
        </p>

      </div>

      {/* TOP CARDS */}

      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
        "
      >

        <div
          className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          p-7
          "
        >

          <FaShieldAlt className="text-green-400 text-4xl" />

          <h3 className="text-zinc-400 mt-5">
            Security Score
          </h3>

          <h2 className="text-5xl font-black mt-2">
            {scanData?.overallScore}
          </h2>

        </div>

        <div
          className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          p-7
          "
        >

          <FaBug className="text-red-400 text-4xl" />

          <h3 className="text-zinc-400 mt-5">
            Vulnerabilities
          </h3>

          <h2 className="text-5xl font-black mt-2">
            {scanData?.reports?.length}
          </h2>

        </div>

        <div
          className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          p-7
          "
        >

          <FaCode className="text-blue-400 text-4xl" />

          <h3 className="text-zinc-400 mt-5">
            Files Scanned
          </h3>

          <h2 className="text-5xl font-black mt-2">
            {scanData?.scannedFiles}
          </h2>

        </div>

        <div
          className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          p-7
          "
        >

          <FaBrain className="text-purple-400 text-4xl" />

          <h3 className="text-zinc-400 mt-5">
            AI Risk Level
          </h3>

          <h2 className="text-4xl font-black mt-2">
            {scanData?.riskLevel}
          </h2>

        </div>

      </div>

      {/* CHARTS */}

      <div
        className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-8
        "
      >

        {/* PIE CHART */}

        <div
          className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          p-8
          h-[450px]
          "
        >

          <div className="flex items-center gap-3 mb-8">

            <FaChartPie className="text-cyan-400 text-2xl" />

            <h2 className="text-2xl font-bold">
              Vulnerability Breakdown
            </h2>

          </div>

          <ResponsiveContainer width="100%" height="90%">

            <PieChart>

              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                label
              >

                {
                  severityData.map(
                    (entry, index) => (

                      <Cell
                        key={index}
                        fill={COLORS[index]}
                      />

                    )
                  )
                }

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* BAR CHART */}

        <div
          className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          p-8
          h-[450px]
          "
        >

          <h2 className="text-2xl font-bold mb-8">
            Scan Performance
          </h2>

          <ResponsiveContainer width="100%" height="90%">

            <BarChart data={performanceData}>

              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />

              <XAxis dataKey="name" stroke="#ffffff" />

              <YAxis stroke="#ffffff" />

              <Tooltip />

              <Bar dataKey="value" fill="#22c55e" radius={[10,10,0,0]} />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* AI STATS */}

      <div
        className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-8
        "
      >

        {/* LINE GRAPH */}

        <div
          className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          p-8
          h-[450px]
          "
        >

          <h2 className="text-2xl font-bold mb-8">
            AI Detection Analytics
          </h2>

          <ResponsiveContainer width="100%" height="90%">

            <LineChart data={aiStats}>

              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />

              <XAxis dataKey="name" stroke="#ffffff" />

              <YAxis stroke="#ffffff" />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={4}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* AREA GRAPH */}

        <div
          className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          p-8
          h-[450px]
          "
        >

          <h2 className="text-2xl font-bold mb-8">
            Security Intelligence
          </h2>

          <ResponsiveContainer width="100%" height="90%">

            <AreaChart data={aiStats}>

              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />

              <XAxis dataKey="name" stroke="#ffffff" />

              <YAxis stroke="#ffffff" />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#06b6d4"
                fill="#164e63"
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );

};

export default Analytics;