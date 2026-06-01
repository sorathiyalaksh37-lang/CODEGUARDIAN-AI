import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import {
  FaShieldAlt,
  FaBug,
  FaCode,
  FaChartLine,
} from "react-icons/fa";

const COLORS = [
  "#22c55e",
  "#eab308",
  "#f97316",
  "#ef4444",
];

const AnalyticsPage = () => {

  const [scans,
    setScans] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    fetchHistory();

  }, []);

  const fetchHistory =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const { data } =
          await axios.get(

            "http://localhost:8000/api/github/history",

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );

        setScans(
          data.scans || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  // TOTALS

  const totalScans =
    scans.length;

  const totalFiles =
    scans.reduce(
      (
        acc,
        scan
      ) =>
        acc +
        (
          scan.scannedFiles ||
          0
        ),
      0
    );

  const averageScore =
    scans.length > 0
      ? Math.round(

          scans.reduce(
            (
              acc,
              scan
            ) =>
              acc +
              (
                scan.overallScore ||
                0
              ),
            0
          ) / scans.length

        )
      : 0;

  // SEVERITY DATA

  const severityData = [

    {

      name: "Critical",

      value:
        scans.reduce(
          (
            acc,
            scan
          ) =>
            acc +
            (
              scan
                .severityBreakdown
                ?.Critical || 0
            ),
          0
        ),

    },

    {

      name: "High",

      value:
        scans.reduce(
          (
            acc,
            scan
          ) =>
            acc +
            (
              scan
                .severityBreakdown
                ?.High || 0
            ),
          0
        ),

    },

    {

      name: "Medium",

      value:
        scans.reduce(
          (
            acc,
            scan
          ) =>
            acc +
            (
              scan
                .severityBreakdown
                ?.Medium || 0
            ),
          0
        ),

    },

    {

      name: "Low",

      value:
        scans.reduce(
          (
            acc,
            scan
          ) =>
            acc +
            (
              scan
                .severityBreakdown
                ?.Low || 0
            ),
          0
        ),

    },

  ];

  // TREND DATA

  const trendData =
    scans.map(
      (scan) => ({

        repo:
          scan.repo,

        score:
          scan.overallScore,

      })
    );

  if (loading) {

    return (

      <div
        className="
        min-h-screen
        bg-black
        text-white
        flex
        items-center
        justify-center
        text-4xl
        font-black
        "
      >

        Loading Analytics...

      </div>

    );

  }

  return (

    <div
      className="
      min-h-screen
      bg-black
      text-white
      p-8
      "
    >

      {/* HEADER */}

      <div className="mb-12">

        <h1
          className="
          text-6xl
          font-black
          "
        >

          Security Analytics

        </h1>

        <p
          className="
          text-zinc-400
          mt-4
          text-lg
          "
        >

          AI Powered Security Insights

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
        mb-10
        "
      >

        {/* TOTAL SCANS */}

        <div
          className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          p-7
          "
        >

          <FaShieldAlt
            className="
            text-green-400
            text-5xl
            "
          />

          <p
            className="
            text-zinc-400
            mt-5
            "
          >

            Total Scans

          </p>

          <h2
            className="
            text-6xl
            font-black
            mt-2
            "
          >

            {totalScans}

          </h2>

        </div>

        {/* TOTAL FILES */}

        <div
          className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          p-7
          "
        >

          <FaCode
            className="
            text-blue-400
            text-5xl
            "
          />

          <p
            className="
            text-zinc-400
            mt-5
            "
          >

            Files Scanned

          </p>

          <h2
            className="
            text-6xl
            font-black
            mt-2
            "
          >

            {totalFiles}

          </h2>

        </div>

        {/* AVG SCORE */}

        <div
          className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          p-7
          "
        >

          <FaChartLine
            className="
            text-yellow-400
            text-5xl
            "
          />

          <p
            className="
            text-zinc-400
            mt-5
            "
          >

            Average Score

          </p>

          <h2
            className="
            text-6xl
            font-black
            mt-2
            "
          >

            {averageScore}

          </h2>

        </div>

        {/* TOTAL BUGS */}

        <div
          className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          p-7
          "
        >

          <FaBug
            className="
            text-red-400
            text-5xl
            "
          />

          <p
            className="
            text-zinc-400
            mt-5
            "
          >

            Vulnerabilities

          </p>

          <h2
            className="
            text-6xl
            font-black
            mt-2
            "
          >

            {
              severityData.reduce(
                (
                  acc,
                  item
                ) =>
                  acc +
                  item.value,
                0
              )
            }

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
          h-[500px]
          "
        >

          <h2
            className="
            text-3xl
            font-black
            mb-8
            "
          >

            Vulnerability Breakdown

          </h2>

          <ResponsiveContainer
            width="100%"
            height="90%"
          >

            <PieChart>

              <Pie

                data={severityData}

                dataKey="value"

                nameKey="name"

                cx="50%"

                cy="50%"

                outerRadius={150}

                label

              >

                {
                  severityData.map(
                    (
                      entry,
                      index
                    ) => (

                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index
                          ]
                        }
                      />

                    )
                  )
                }

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* AREA CHART */}

        <div
          className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          p-8
          h-[500px]
          "
        >

          <h2
            className="
            text-3xl
            font-black
            mb-8
            "
          >

            Scan Performance

          </h2>

          <ResponsiveContainer
            width="100%"
            height="90%"
          >

            <AreaChart
              data={trendData}
            >

              <defs>

                <linearGradient
                  id="colorScore"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="5%"
                    stopColor="#22c55e"
                    stopOpacity={0.8}
                  />

                  <stop
                    offset="95%"
                    stopColor="#22c55e"
                    stopOpacity={0}
                  />

                </linearGradient>

              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
              />

              <XAxis
                dataKey="repo"
                stroke="#aaa"
              />

              <YAxis
                stroke="#aaa"
              />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="score"
                stroke="#22c55e"
                fillOpacity={1}
                fill="url(#colorScore)"
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );

};

export default AnalyticsPage;