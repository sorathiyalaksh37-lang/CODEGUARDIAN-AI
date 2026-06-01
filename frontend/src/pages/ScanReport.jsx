  // src/pages/ScanReport.jsx

  import React from "react";

  import {
    useLocation,
    useNavigate,
  } from "react-router-dom";

  import jsPDF from "jspdf";

  import {
    FaArrowLeft,
    FaDownload,
    FaShieldAlt,
    FaBug,
    FaFileCode,
  } from "react-icons/fa";

  const ScanReport = () => {

    const location =
      useLocation();

    const navigate =
      useNavigate();

    const scan =
      location.state;

    // NO DATA

    if (!scan) {

      return (

        <div
          className="
          min-h-screen
          bg-black
          flex
          items-center
          justify-center
          text-white
          "
        >

          <div className="text-center">

            <h1
              className="
              text-5xl
              font-black
              mb-5
              "
            >
              No Report Found
            </h1>

            <button

              onClick={() =>
                navigate("/history")
              }

              className="
              bg-green-500
              hover:bg-green-600
              text-black
              font-bold
              px-7
              py-4
              rounded-2xl
              "

            >
              Go Back

            </button>

          </div>

        </div>

      );

    }

    // DOWNLOAD PDF

    const downloadPDF =
      () => {

        const pdf =
          new jsPDF();

        let y = 20;

        pdf.setFontSize(22);

        pdf.text(
          "CodeGuardian AI Security Report",
          20,
          y
        );

        y += 15;

        pdf.setFontSize(13);

        pdf.text(
          `Repository: ${scan.owner}/${scan.repo}`,
          20,
          y
        );

        y += 10;

        pdf.text(
          `Overall Score: ${scan.overallScore}`,
          20,
          y
        );

        y += 10;

        pdf.text(
          `Risk Level: ${scan.riskLevel}`,
          20,
          y
        );

        y += 15;

        scan.reports?.forEach(

          (
            report,
            index
          ) => {

            if (y > 250) {

              pdf.addPage();

              y = 20;

            }

            pdf.setFontSize(15);

            pdf.text(

              `${index + 1}. ${report.fileName}`,

              20,

              y

            );

            y += 8;

            pdf.setFontSize(12);

            pdf.text(

              `Severity: ${report.severity}`,

              20,

              y

            );

            y += 8;

            const reviewLines =

              pdf.splitTextToSize(

                `Review: ${report.review}`,

                170

              );

            pdf.text(

              reviewLines,

              20,

              y

            );

            y +=
              reviewLines.length *
              7 +
              10;

            if (
              report.fixes?.length > 0
            ) {

              pdf.text(
                "Suggested Fixes:",
                20,
                y
              );

              y += 8;

              report.fixes.forEach(
                (fix) => {

                  const fixLines =

                    pdf.splitTextToSize(

                      `• ${fix}`,

                      160

                    );

                  pdf.text(
                    fixLines,
                    25,
                    y
                  );

                  y +=
                    fixLines.length *
                    7 +
                    5;

                }
              );

            }

            y += 12;

          }
        );

        pdf.save(
          `${scan.repo}-report.pdf`
        );

      };

    const severityColors = {

      Critical:
        "bg-red-600 text-white",

      High:
        "bg-orange-500 text-white",

      Medium:
        "bg-yellow-400 text-black",

      Low:
        "bg-green-500 text-black",

    };

    return (

      <div
        className="
        min-h-screen
        bg-black
        text-white
        p-5
        md:p-10
        "
      >

        {/* TOP */}

        <div
          className="
          flex
          flex-col
          md:flex-row
          justify-between
          gap-5
          mb-10
          "
        >

          <button

            onClick={() =>
              navigate("/history")
            }

            className="
            flex
            items-center
            gap-3
            bg-zinc-900
            border
            border-zinc-700
            hover:border-green-500
            px-6
            py-4
            rounded-2xl
            "

          >

            <FaArrowLeft />

            Back

          </button>

          <button

            onClick={downloadPDF}

            className="
            flex
            items-center
            gap-3
            bg-green-500
            hover:bg-green-600
            text-black
            font-black
            px-7
            py-4
            rounded-2xl
            "

          >

            <FaDownload />

            Download PDF

          </button>

        </div>

        {/* HEADER */}

        <div
          className="
          bg-zinc-950
          border
          border-zinc-800
          rounded-[35px]
          p-8
          mb-10
          "
        >

          <div
            className="
            flex
            items-center
            gap-5
            "
          >

            <div
              className="
              w-20
              h-20
              rounded-3xl
              bg-green-500
              flex
              items-center
              justify-center
              "
            >

              <FaShieldAlt
                className="
                text-black
                text-4xl
                "
              />

            </div>

            <div>

              <h1
                className="
                text-5xl
                font-black
                "
              >
                Scan Report
              </h1>

              <p
                className="
                text-zinc-400
                mt-2
                break-all
                "
              >
                {scan.owner}/{scan.repo}
              </p>

            </div>

          </div>

        </div>

        {/* STATS */}

        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-6
          mb-10
          "
        >

          {/* SCORE */}

          <div
            className="
            bg-zinc-950
            border
            border-zinc-800
            rounded-3xl
            p-7
            "
          >

            <FaShieldAlt
              className="
              text-green-400
              text-3xl
              "
            />

            <p
              className="
              text-zinc-500
              mt-4
              "
            >
              Security Score
            </p>

            <h2
              className="
              text-6xl
              font-black
              mt-3
              "
            >
              {scan.overallScore}
            </h2>

          </div>

          {/* RISK */}

          <div
            className="
            bg-zinc-950
            border
            border-zinc-800
            rounded-3xl
            p-7
            "
          >

            <FaBug
              className="
              text-red-400
              text-3xl
              "
            />

            <p
              className="
              text-zinc-500
              mt-4
              "
            >
              Risk Level
            </p>

            <h2
              className="
              text-5xl
              font-black
              mt-3
              "
            >
              {scan.riskLevel}
            </h2>

          </div>

          {/* FILES */}

          <div
            className="
            bg-zinc-950
            border
            border-zinc-800
            rounded-3xl
            p-7
            "
          >

            <FaFileCode
              className="
              text-blue-400
              text-3xl
              "
            />

            <p
              className="
              text-zinc-500
              mt-4
              "
            >
              Files Scanned
            </p>

            <h2
              className="
              text-6xl
              font-black
              mt-3
              "
            >
              {scan.scannedFiles}
            </h2>

          </div>

        </div>

        {/* FILE REPORTS */}

        <div className="space-y-6">

          {
            scan.reports?.map(

              (
                report,
                index
              ) => (

                <div

                  key={index}

                  className="
                  bg-zinc-950
                  border
                  border-zinc-800
                  rounded-3xl
                  p-7
                  "

                >

                  {/* TOP */}

                  <div
                    className="
                    flex
                    flex-col
                    lg:flex-row
                    justify-between
                    gap-5
                    "
                  >

                    <div>

                      <h2
                        className="
                        text-2xl
                        font-black
                        break-all
                        "
                      >
                        {report.fileName}
                      </h2>

                      <p
                        className="
                        text-zinc-500
                        mt-2
                        "
                      >
                        AI Vulnerability Analysis
                      </p>

                    </div>

                    <span
                      className={`
                      px-6
                      py-3
                      rounded-full
                      font-bold
                      h-fit
                      ${severityColors[
                        report.severity
                      ]}
                      `}
                    >
                      {report.severity}
                    </span>

                  </div>

                  {/* REVIEW */}

                  <div className="mt-7">

                    <h3
                      className="
                      text-green-400
                      text-xl
                      font-bold
                      "
                    >
                      AI Review
                    </h3>

                    <p
                      className="
                      text-zinc-300
                      leading-8
                      mt-4
                      "
                    >
                      {report.review}
                    </p>

                  </div>

                  {/* FIXES */}

                  {
                    report.fixes?.length > 0 && (

                      <div className="mt-8">

                        <h3
                          className="
                          text-blue-400
                          text-xl
                          font-bold
                          "
                        >
                          Suggested Fixes
                        </h3>

                        <ul
                          className="
                          mt-4
                          space-y-3
                          "
                        >

                          {
                            report.fixes.map(

                              (
                                fix,
                                idx
                              ) => (

                                <li

                                  key={idx}

                                  className="
                                  bg-black
                                  border
                                  border-zinc-800
                                  rounded-2xl
                                  px-5
                                  py-4
                                  text-zinc-300
                                  "

                                >
                                  {fix}
                                </li>

                              )
                            )
                          }

                        </ul>

                      </div>

                    )
                  }

                </div>

              )
            )
          }

        </div>

      </div>

    );

  };

  export default ScanReport;