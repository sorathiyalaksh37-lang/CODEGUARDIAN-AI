import express from 'express';
import scanForSecrets from '../services/secretScanner.js';
import scanDependencies from '../services/dependencyScanner.js';
import { enhancedScan } from '../services/scanService.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/security/scan-secrets
 * @desc    Scan repository for exposed secrets
 * @access  Private
 */
router.post('/scan-secrets', authenticateToken, async (req, res) => {
  try {
    const { repoPath } = req.body;

    if (!repoPath) {
      return res.status(400).json({ error: 'Repository path is required' });
    }

    const results = await scanForSecrets(repoPath);

    res.json({
      success: true,
      data: results,
      message: `Found ${results.found} potential secrets`
    });
  } catch (error) {
    console.error('Secret scan error:', error);
    res.status(500).json({ 
      error: 'Secret scanning failed', 
      details: error.message 
    });
  }
});

/**
 * @route   POST /api/security/scan-dependencies
 * @desc    Scan dependencies for vulnerabilities
 * @access  Private
 */
router.post('/scan-dependencies', authenticateToken, async (req, res) => {
  try {
    const { repoPath } = req.body;

    if (!repoPath) {
      return res.status(400).json({ error: 'Repository path is required' });
    }

    const results = await scanDependencies(repoPath);

    res.json({
      success: true,
      data: results,
      message: `Found ${results.summary.total} dependency vulnerabilities`
    });
  } catch (error) {
    console.error('Dependency scan error:', error);
    res.status(500).json({ 
      error: 'Dependency scanning failed', 
      details: error.message 
    });
  }
});

/**
 * @route   POST /api/security/enhanced-scan
 * @desc    Run comprehensive security scan (files + secrets + dependencies)
 * @access  Private
 */
router.post('/enhanced-scan', authenticateToken, async (req, res) => {
  try {
    const { repoPath, files } = req.body;

    if (!repoPath) {
      return res.status(400).json({ error: 'Repository path is required' });
    }

    if (!files || !Array.isArray(files)) {
      return res.status(400).json({ error: 'Files array is required' });
    }

    const results = await enhancedScan(repoPath, files);

    res.json({
      success: true,
      data: results,
      message: 'Enhanced security scan completed'
    });
  } catch (error) {
    console.error('Enhanced scan error:', error);
    res.status(500).json({ 
      error: 'Enhanced scan failed', 
      details: error.message 
    });
  }
});

/**
 * @route   GET /api/security/scan-stats
 * @desc    Get statistics for recent scans
 * @access  Private
 */
router.get('/scan-stats', authenticateToken, async (req, res) => {
  try {
    // This would normally query the database for scan history
    // For now, return a sample response
    res.json({
      success: true,
      data: {
        totalScans: 0,
        secretsFound: 0,
        dependencyVulns: 0,
        averageScore: 0
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
