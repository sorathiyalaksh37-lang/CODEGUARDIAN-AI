import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Check if a file exists
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Run npm audit and parse results
 */
async function runNpmAudit(repoPath) {
  const packageJsonPath = path.join(repoPath, 'package.json');
  
  if (!await fileExists(packageJsonPath)) {
    console.log('📦 No package.json found, skipping npm audit');
    return { vulnerabilities: [], metadata: null };
  }

  try {
    console.log('🔍 Running npm audit...');
    
    // Run npm audit with JSON output
    const { stdout } = await execAsync('npm audit --json', { 
      cwd: repoPath,
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });
    
    const audit = JSON.parse(stdout);
    const vulnerabilities = [];

    // Parse npm audit v7+ format
    if (audit.vulnerabilities) {
      Object.entries(audit.vulnerabilities).forEach(([pkgName, vuln]) => {
        const via = Array.isArray(vuln.via) ? vuln.via : [vuln.via];
        
        via.forEach(v => {
          if (typeof v === 'object') {
            vulnerabilities.push({
              package: pkgName,
              severity: mapSeverity(vuln.severity),
              currentVersion: vuln.range || 'N/A',
              vulnerability: v.title || v.name || 'Unknown vulnerability',
              cve: v.cve ? v.cve.join(', ') : v.url?.match(/CVE-\d{4}-\d+/)?.[0] || 'N/A',
              cwe: v.cwe ? `CWE-${v.cwe.join(', CWE-')}` : 'N/A',
              fixVersion: vuln.fixAvailable?.version || 'No fix available',
              url: v.url || 'N/A',
              isDirect: vuln.isDirect || false,
              description: v.title || 'Vulnerability in dependency',
              recommendation: vuln.fixAvailable 
                ? `Update to version ${vuln.fixAvailable.version}`
                : 'Monitor for updates or consider alternative packages'
            });
          }
        });
      });
    }

    return {
      vulnerabilities,
      metadata: audit.metadata || null
    };
  } catch (error) {
    // npm audit returns exit code 1 when vulnerabilities found
    if (error.stdout) {
      try {
        const audit = JSON.parse(error.stdout);
        const vulnerabilities = [];

        if (audit.vulnerabilities) {
          Object.entries(audit.vulnerabilities).forEach(([pkgName, vuln]) => {
            const via = Array.isArray(vuln.via) ? vuln.via : [vuln.via];
            
            via.forEach(v => {
              if (typeof v === 'object') {
                vulnerabilities.push({
                  package: pkgName,
                  severity: mapSeverity(vuln.severity),
                  currentVersion: vuln.range || 'N/A',
                  vulnerability: v.title || 'Unknown vulnerability',
                  cve: v.cve ? v.cve.join(', ') : 'N/A',
                  cwe: v.cwe ? `CWE-${v.cwe.join(', CWE-')}` : 'N/A',
                  fixVersion: vuln.fixAvailable?.version || 'No fix available',
                  url: v.url || 'N/A',
                  isDirect: vuln.isDirect || false,
                  description: v.title || 'Vulnerability in dependency',
                  recommendation: vuln.fixAvailable 
                    ? `Update to version ${vuln.fixAvailable.version}`
                    : 'Monitor for updates'
                });
              }
            });
          });
        }

        return {
          vulnerabilities,
          metadata: audit.metadata || null
        };
      } catch (parseError) {
        console.error('❌ Error parsing npm audit output:', parseError.message);
        return { vulnerabilities: [], metadata: null };
      }
    }
    
    console.error('❌ npm audit failed:', error.message);
    return { vulnerabilities: [], metadata: null };
  }
}

/**
 * Check for outdated packages
 */
async function checkOutdatedPackages(repoPath) {
  const packageJsonPath = path.join(repoPath, 'package.json');
  
  if (!await fileExists(packageJsonPath)) {
    return [];
  }

  try {
    console.log('📊 Checking outdated packages...');
    
    const { stdout } = await execAsync('npm outdated --json', { 
      cwd: repoPath,
      maxBuffer: 1024 * 1024 * 10
    });
    
    const outdated = JSON.parse(stdout);
    return Object.entries(outdated).map(([pkg, info]) => ({
      package: pkg,
      current: info.current,
      wanted: info.wanted,
      latest: info.latest,
      location: info.location,
      type: info.type
    }));
  } catch (error) {
    // npm outdated returns exit code 1 when packages are outdated
    if (error.stdout) {
      try {
        const outdated = JSON.parse(error.stdout);
        return Object.entries(outdated).map(([pkg, info]) => ({
          package: pkg,
          current: info.current,
          wanted: info.wanted,
          latest: info.latest,
          location: info.location,
          type: info.type
        }));
      } catch (parseError) {
        console.error('❌ Error parsing npm outdated output');
        return [];
      }
    }
    return [];
  }
}

/**
 * Analyze package.json for risky patterns
 */
async function analyzePackageJson(repoPath) {
  const packageJsonPath = path.join(repoPath, 'package.json');
  
  if (!await fileExists(packageJsonPath)) {
    return { issues: [] };
  }

  try {
    const content = await fs.readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(content);
    const issues = [];

    // Check for wildcard versions
    const checkVersions = (deps, type) => {
      if (!deps) return;
      
      Object.entries(deps).forEach(([pkg, version]) => {
        if (version === '*' || version === 'latest') {
          issues.push({
            type: 'Unsafe Version',
            severity: 'Medium',
            package: pkg,
            issue: `Using "${version}" version in ${type}`,
            recommendation: 'Pin to specific version or use semver range',
            cwe: 'CWE-1104'
          });
        }
      });
    };

    checkVersions(packageJson.dependencies, 'dependencies');
    checkVersions(packageJson.devDependencies, 'devDependencies');

    // Check for postinstall scripts (potential security risk)
    if (packageJson.scripts?.postinstall) {
      issues.push({
        type: 'Risky Script',
        severity: 'High',
        issue: 'Package has postinstall script',
        script: packageJson.scripts.postinstall,
        recommendation: 'Review the postinstall script for malicious code',
        cwe: 'CWE-829'
      });
    }

    // Check for deprecated fields
    if (packageJson.preferGlobal) {
      issues.push({
        type: 'Deprecated Field',
        severity: 'Low',
        issue: 'preferGlobal is deprecated',
        recommendation: 'Remove preferGlobal field',
        cwe: 'N/A'
      });
    }

    return { issues };
  } catch (error) {
    console.error('❌ Error analyzing package.json:', error.message);
    return { issues: [] };
  }
}

/**
 * Map npm severity to our severity levels
 */
function mapSeverity(npmSeverity) {
  const severityMap = {
    'critical': 'Critical',
    'high': 'High',
    'moderate': 'Medium',
    'low': 'Low',
    'info': 'Info'
  };
  
  return severityMap[npmSeverity?.toLowerCase()] || 'Medium';
}

/**
 * Main dependency scanning function
 */
export async function scanDependencies(repoPath) {
  console.log('📦 Starting dependency vulnerability scan...');
  
  const [npmAudit, outdated, packageAnalysis] = await Promise.all([
    runNpmAudit(repoPath),
    checkOutdatedPackages(repoPath),
    analyzePackageJson(repoPath)
  ]);

  const allVulnerabilities = [
    ...npmAudit.vulnerabilities,
    ...packageAnalysis.issues
  ];

  const summary = {
    total: allVulnerabilities.length,
    critical: allVulnerabilities.filter(v => v.severity === 'Critical').length,
    high: allVulnerabilities.filter(v => v.severity === 'High').length,
    medium: allVulnerabilities.filter(v => v.severity === 'Medium').length,
    low: allVulnerabilities.filter(v => v.severity === 'Low').length,
    info: allVulnerabilities.filter(v => v.severity === 'Info').length
  };

  console.log(`✅ Dependency scan complete. Found ${summary.total} issues.`);

  return {
    vulnerabilities: allVulnerabilities,
    outdated: outdated,
    summary: summary,
    metadata: npmAudit.metadata,
    timestamp: new Date().toISOString(),
    scannedPath: repoPath
  };
}

export default scanDependencies;
