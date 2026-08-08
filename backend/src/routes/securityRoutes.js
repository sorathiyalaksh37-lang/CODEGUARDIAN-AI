import express from 'express';
import scanForSecrets from '../services/secretScanner.js';
import scanDependencies from '../services/dependencyScanner.js';
import { enhancedScan } from '../services/scanService.js';
import { protect } from '../middleware/authMiddleware.js';
import { 
  generateSecurityBadge, 
  generateVulnerabilityBadge, 
  generateSeverityBadge,
  getAllBadges 
} from '../services/badgeService.js';
import { installGitHooks, uninstallGitHooks, checkInstalledHooks } from '../utils/gitHooks.js';
import Review from '../models/Review.js';

const router = express.Router();

/**
 * @route   POST /api/security/scan-secrets
 * @desc    Scan repository for exposed secrets
 * @access  Private
 */
router.post('/scan-secrets', protect, async (req, res) => {
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
router.post('/scan-dependencies', protect, async (req, res) => {
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
router.post('/enhanced-scan', protect, async (req, res) => {
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
router.get('/scan-stats', protect, async (req, res) => {
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

/**
 * @route   GET /api/security/badge/:userId/:repoName/:type.svg
 * @desc    Generate security badge SVG
 * @access  Public
 */
router.get('/badge/:userId/:repoName/:type.svg', async (req, res) => {
  try {
    const { userId, repoName, type } = req.params;
    const { style = 'flat' } = req.query;

    // Find latest scan for this repo
    const latestScan = await Review.findOne({ 
      user: userId,
      repositoryName: repoName 
    }).sort({ createdAt: -1 });

    if (!latestScan) {
      // Return default "no data" badge
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.send(generateSecurityBadge(0, style));
    }

    let badge;
    
    switch (type) {
      case 'score':
        badge = generateSecurityBadge(latestScan.overallScore || 0, style);
        break;
      
      case 'vulns':
        const vulnCount = latestScan.reports?.length || 0;
        badge = generateVulnerabilityBadge(vulnCount, style);
        break;
      
      case 'severity':
        const critical = latestScan.reports?.filter(r => r.severity === 'Critical').length || 0;
        const high = latestScan.reports?.filter(r => r.severity === 'High').length || 0;
        const medium = latestScan.reports?.filter(r => r.severity === 'Medium').length || 0;
        const low = latestScan.reports?.filter(r => r.severity === 'Low').length || 0;
        badge = generateSeverityBadge(critical, high, medium, low, style);
        break;
      
      default:
        return res.status(400).json({ error: 'Invalid badge type' });
    }

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    res.send(badge);
  } catch (error) {
    console.error('Badge generation error:', error);
    res.status(500).send(generateSecurityBadge(0, 'flat'));
  }
});

/**
 * @route   GET /api/security/badges/:userId/:repoName
 * @desc    Get all badge markdown for repository
 * @access  Private
 */
router.get('/badges/:userId/:repoName', protect, async (req, res) => {
  try {
    const { userId, repoName } = req.params;
    const { style = 'flat' } = req.query;

    const badges = getAllBadges(userId, repoName, style);

    res.json({
      success: true,
      badges,
      markdown: `
## Security Badges

${badges.score}
${badges.vulnerabilities}
${badges.severity}

Add these to your README.md!
      `.trim()
    });
  } catch (error) {
    console.error('Badge markdown error:', error);
    res.status(500).json({ error: 'Failed to generate badge markdown' });
  }
});

/**
 * @route   POST /api/security/git-hooks/install
 * @desc    Install git hooks for security scanning
 * @access  Private
 */
router.post('/git-hooks/install', protect, async (req, res) => {
  try {
    const { repoPath } = req.body;

    if (!repoPath) {
      return res.status(400).json({ error: 'Repository path is required' });
    }

    const result = await installGitHooks(repoPath);

    res.json({
      success: result.success,
      data: result,
      message: result.message
    });
  } catch (error) {
    console.error('Git hooks installation error:', error);
    res.status(500).json({ 
      error: 'Failed to install git hooks', 
      details: error.message 
    });
  }
});

/**
 * @route   POST /api/security/git-hooks/uninstall
 * @desc    Uninstall CodeGuardian git hooks
 * @access  Private
 */
router.post('/git-hooks/uninstall', protect, async (req, res) => {
  try {
    const { repoPath } = req.body;

    if (!repoPath) {
      return res.status(400).json({ error: 'Repository path is required' });
    }

    const result = await uninstallGitHooks(repoPath);

    res.json({
      success: result.success,
      data: result,
      message: result.message
    });
  } catch (error) {
    console.error('Git hooks uninstallation error:', error);
    res.status(500).json({ 
      error: 'Failed to uninstall git hooks', 
      details: error.message 
    });
  }
});

/**
 * @route   GET /api/security/git-hooks/status
 * @desc    Check git hooks installation status
 * @access  Private
 */
router.post('/git-hooks/status', protect, async (req, res) => {
  try {
    const { repoPath } = req.body;

    if (!repoPath) {
      return res.status(400).json({ error: 'Repository path is required' });
    }

    const hooks = await checkInstalledHooks(repoPath);

    res.json({
      success: true,
      hooks: hooks
    });
  } catch (error) {
    console.error('Git hooks status error:', error);
    res.status(500).json({ 
      error: 'Failed to check git hooks status', 
      details: error.message 
    });
  }
});

export default router;
