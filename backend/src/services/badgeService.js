/**
 * Generate SVG badge for security score
 */
export function generateSecurityBadge(score, style = 'flat') {
  const color = getScoreColor(score);
  const label = 'security';
  const value = `${score}/100`;
  
  if (style === 'flat-square') {
    return generateFlatSquareBadge(label, value, color);
  }
  
  return generateFlatBadge(label, value, color);
}

/**
 * Generate SVG badge for vulnerability count
 */
export function generateVulnerabilityBadge(count, style = 'flat') {
  const color = getVulnColor(count);
  const label = 'vulnerabilities';
  const value = count.toString();
  
  if (style === 'flat-square') {
    return generateFlatSquareBadge(label, value, color);
  }
  
  return generateFlatBadge(label, value, color);
}

/**
 * Generate SVG badge for severity breakdown
 */
export function generateSeverityBadge(critical, high, medium, low, style = 'flat') {
  const label = 'issues';
  const value = `${critical}C ${high}H ${medium}M ${low}L`;
  const color = critical > 0 ? '#e74c3c' : high > 0 ? '#e67e22' : medium > 0 ? '#f39c12' : '#27ae60';
  
  if (style === 'flat-square') {
    return generateFlatSquareBadge(label, value, color);
  }
  
  return generateFlatBadge(label, value, color);
}

/**
 * Get color based on security score
 */
function getScoreColor(score) {
  if (score >= 90) return '#27ae60'; // Green
  if (score >= 70) return '#2ecc71'; // Light Green
  if (score >= 50) return '#f39c12'; // Yellow
  if (score >= 30) return '#e67e22'; // Orange
  return '#e74c3c'; // Red
}

/**
 * Get color based on vulnerability count
 */
function getVulnColor(count) {
  if (count === 0) return '#27ae60'; // Green
  if (count <= 5) return '#f39c12'; // Yellow
  if (count <= 15) return '#e67e22'; // Orange
  return '#e74c3c'; // Red
}

/**
 * Generate flat style badge (similar to shields.io)
 */
function generateFlatBadge(label, value, color) {
  const labelWidth = label.length * 7 + 10;
  const valueWidth = value.length * 7 + 10;
  const totalWidth = labelWidth + valueWidth;
  
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${value}">
  <title>${label}: ${value}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#555"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="${labelWidth / 2 * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(label.length * 70).toString()}">${label}</text>
    <text x="${labelWidth / 2 * 10}" y="140" transform="scale(.1)" fill="#fff" textLength="${(label.length * 70).toString()}">${label}</text>
    <text aria-hidden="true" x="${(labelWidth + valueWidth / 2) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(value.length * 70).toString()}">${value}</text>
    <text x="${(labelWidth + valueWidth / 2) * 10}" y="140" transform="scale(.1)" fill="#fff" textLength="${(value.length * 70).toString()}">${value}</text>
  </g>
</svg>`.trim();
}

/**
 * Generate flat-square style badge
 */
function generateFlatSquareBadge(label, value, color) {
  const labelWidth = label.length * 7 + 10;
  const valueWidth = value.length * 7 + 10;
  const totalWidth = labelWidth + valueWidth;
  
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${value}">
  <title>${label}: ${value}</title>
  <g shape-rendering="crispEdges">
    <rect width="${labelWidth}" height="20" fill="#555"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="${color}"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text x="${labelWidth / 2 * 10}" y="140" transform="scale(.1)" fill="#fff" textLength="${(label.length * 70).toString()}">${label}</text>
    <text x="${(labelWidth + valueWidth / 2) * 10}" y="140" transform="scale(.1)" fill="#fff" textLength="${(value.length * 70).toString()}">${value}</text>
  </g>
</svg>`.trim();
}

/**
 * Generate badge URL for README
 */
export function getBadgeMarkdown(userId, repoName, badgeType = 'score', style = 'flat') {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:8000';
  const url = `${baseUrl}/api/security/badge/${userId}/${repoName}/${badgeType}.svg?style=${style}`;
  const altText = `CodeGuardian ${badgeType}`;
  
  return `![${altText}](${url})`;
}

/**
 * Generate all badge URLs for a repository
 */
export function getAllBadges(userId, repoName, style = 'flat') {
  return {
    score: getBadgeMarkdown(userId, repoName, 'score', style),
    vulnerabilities: getBadgeMarkdown(userId, repoName, 'vulns', style),
    severity: getBadgeMarkdown(userId, repoName, 'severity', style)
  };
}

export default {
  generateSecurityBadge,
  generateVulnerabilityBadge,
  generateSeverityBadge,
  getBadgeMarkdown,
  getAllBadges
};
