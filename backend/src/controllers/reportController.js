import PDFDocument from "pdfkit";
import ScanHistory from "../models/scanHistoryModel.js";

export const downloadPDFReport = async (req, res) => {

    try {

        const { id } = req.params;

        const scan = await ScanHistory.findById(id);

        if (!scan) {

            return res.status(404).json({
                success: false,
                message: "Scan report not found",
            });

        }

        const doc = new PDFDocument({
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
            .fontSize(24)
            .text("CodeGuardian AI Report", {
                align: "center",
            });

        doc.moveDown();

        // REPO INFO
        doc
            .fontSize(16)
            .text(`Repository: ${scan.owner}/${scan.repo}`);

        doc.text(`Overall Score: ${scan.overallScore}`);
            
        doc.text(
            `Risk Level: ${scan.riskLevel || "Low"}`
        );

        doc.text(`Files Scanned: ${scan.scannedFiles}`);

        doc.moveDown();

        // SEVERITY
        doc
            .fontSize(18)
            .text("Severity Breakdown");

        doc.moveDown(0.5);

        doc.fontSize(12);

        doc.text(
            `Critical: ${scan.severityBreakdown.critical}`
        );

        doc.text(
            `High: ${scan.severityBreakdown.high}`
        );

        doc.text(
            `Medium: ${scan.severityBreakdown.medium}`
        );

        doc.text(
            `Low: ${scan.severityBreakdown.low}`
        );

        doc.moveDown();

        // FILE REPORTS
        scan.reports.forEach((report, index) => {

            doc
                .fontSize(16)
                .text(
                    `${index + 1}. ${report.file}`
                );

            doc.moveDown(0.5);

            doc
                .fontSize(12)
                .text(
                    `Overall Score: ${report.score.overall}`
                );

            doc.moveDown(0.5);

            doc.text("AI Review:");

            doc.fontSize(10).text(
                report.aiReview || "No AI Review",
                {
                    width: 500,
                }
            );

            doc.moveDown();

        });

        doc.end();

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};