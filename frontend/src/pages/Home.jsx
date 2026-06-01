import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

const History = () => {

  const navigate =
    useNavigate();

  const [scans, setScans] =
    useState([]);

  const [loading, setLoading] =
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

        const response =
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
          response.data.scans || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

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
        text-3xl
        font-bold
        "
      >
        Loading History...
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

      <h1
        className="
        text-5xl
        font-black
        mb-10
        "
      >
        Scan History
      </h1>

      {
        scans.length === 0 ? (

          <div
            className="
            bg-zinc-900
            p-10
            rounded-3xl
            text-center
            border
            border-zinc-700
            "
          >

            <h2
              className="
              text-3xl
              font-bold
              "
            >
              No Scan History
            </h2>

          </div>

        ) : (

          <div className="space-y-6">

            {
              scans.map((scan) => (

                <div

                  key={scan._id}

                  onClick={() => {

                    console.log(scan);

                    navigate(
                      "/scan-report",
                      {
                        state: {
                          ...scan,
                        },
                      }
                    );

                  }}

                  className="
                  bg-zinc-900
                  border
                  border-zinc-700
                  rounded-3xl
                  p-6
                  cursor-pointer
                  hover:border-green-400
                  hover:scale-[1.01]
                  transition-all
                  "

                >

                  <div
                    className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    md:justify-between
                    gap-5
                    "
                  >

                    <div>

                      <h2
                        className="
                        text-2xl
                        font-bold
                        "
                      >
                        {scan.owner}/
                        {scan.repo}
                      </h2>

                      <p
                        className="
                        text-zinc-400
                        mt-2
                        "
                      >
                        Files Scanned:
                        {" "}
                        {scan.scannedFiles}
                      </p>

                    </div>

                    <div
                      className="
                      flex
                      gap-10
                      "
                    >

                      <div>

                        <p className="text-zinc-400">
                          Score
                        </p>

                        <h3
                          className="
                          text-4xl
                          font-black
                          "
                        >
                          {
                            scan.overallScore
                          }
                        </h3>

                      </div>

                      <div>

                        <p className="text-zinc-400">
                          Risk
                        </p>

                        <h3
                          className="
                          text-3xl
                          font-black
                          "
                        >
                          {
                            scan.riskLevel
                          }
                        </h3>

                      </div>

                    </div>

                  </div>

                </div>

              ))
            }

          </div>

        )
      }

    </div>

  );

};

export default History;