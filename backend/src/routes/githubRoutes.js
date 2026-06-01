import express
  from "express";

import {
  scanGithubRepo,
  getMyScans,
  getSingleScan,
  downloadPDFReport,
} from "../controllers/githubController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router =
  express.Router();

/**
 * @swagger
 * tags:
 *   name: GitHub
 *   description: GitHub Repository APIs
 */

/**
 * @swagger
 * /api/github/scan:
 *   post:
 *     summary: Scan GitHub repository
 *     tags: [GitHub]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               repoUrl:
 *                 type: string
 *                 example: https://github.com/facebook/react
 *     responses:
 *       200:
 *         description: Repository scanned successfully
 */
router.post(
  "/scan",
  protect,
  scanGithubRepo
);

/**
 * @swagger
 * /api/github/history:
 *   get:
 *     summary: Get user scan history
 *     tags: [GitHub]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Scan history fetched successfully
 */
router.get(
  "/history",
  protect,
  getMyScans
);

/**
 * @swagger
 * /api/github/scan/{id}:
 *   get:
 *     summary: Get single scan report
 *     tags: [GitHub]
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
 *         description: Scan fetched successfully
 */
router.get(
  "/scan/:id",
  protect,
  getSingleScan
);

/**
 * @swagger
 * /api/github/download/{id}:
 *   get:
 *     summary: Download PDF Report
 *     tags: [GitHub]
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
 *         description: PDF downloaded successfully
 */
router.get(
  "/download/:id",
  protect,
  downloadPDFReport
);

export default router;