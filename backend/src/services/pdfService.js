import PDFDocument
  from "pdfkit";

const generatePDFReport =
  (scan, res) => {

    const doc =
      new PDFDocument({
        margin: 40,
      });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${scan.repo}-report.pdf`
    );

    doc.pipe(res);

    // TITLE
    doc
      .fontSize(28)
      .fillColor("#16a34a")
      .text(
        "CodeGuardian AI Security Report",
        {
          align: "center",
        }
      );

    doc.moveDown(2);

    // REPO INFO
    doc
      .fontSize(18)
      .fillColor("black")
      .text(
        `Repository: ${scan.owner}/${scan.repo}`
      );

    doc.text(
      `Overall Score: ${scan.overallScore}`
    );

    doc.text(
      `Risk Level: ${scan.riskLevel}`
    );

    doc.text(
      `Files Scanned: ${scan.scannedFiles}`
    );

    doc.moveDown(2);

    // SEVERITY
    doc
      .fontSize(22)
      .fillColor("#dc2626")
      .text("Severity Breakdown");

    doc.moveDown();

    Object.entries(
      scan.severityBreakdown
    ).forEach(
      ([key, value]) => {

        doc
          .fontSize(14)
          .fillColor("black")
          .text(
            `${key}: ${value}`
          );

      }
    );

    doc.moveDown(2);

    // REPORTS
    doc
      .fontSize(22)
      .fillColor("#2563eb")
      .text("File Reports");

    doc.moveDown();

    scan.reports.forEach(
      (report, index) => {

        doc
          .fontSize(16)
          .fillColor("#16a34a")
          .text(
            `${index + 1}. ${report.fileName}`
          );

        doc
          .fontSize(12)
          .fillColor("black")
          .text(
            `Severity: ${report.severity}`
          );

        doc.text(
          `Score: ${
            report.score?.overall || 0
          }`
        );

        doc.text(
          `Review: ${report.review}`
        );

        // FIXES
        if (
          report.fixes?.length > 0
        ) {

          doc.moveDown(0.5);

          doc
            .fillColor("#2563eb")
            .text(
              "Suggested Fixes:"
            );

          report.fixes.forEach(
            (fix) => {

              doc
                .fillColor("black")
                .text(`• ${fix}`);

            }
          );

        }

        doc.moveDown(2);

      }
    );

    doc.end();

  };

export default generatePDFReport;