import express from "express";

import { protect }
    from "../middleware/authMiddleware.js";

import {
    downloadPDFReport,
} from "../controllers/reportController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: PDF Report APIs
 */

/**
 * @swagger
 * /api/report/pdf/{id}:
 *   get:
 *     summary: Download PDF report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PDF generated successfully
 */
router.get(
    "/pdf/:id",
    protect,
    downloadPDFReport
);

// TEST ROUTE
router.get(
    "/test",
    (req, res) => {

        res.send(
            "Report Route Working"
        );

    }
);

export default router;