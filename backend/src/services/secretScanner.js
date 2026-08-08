import fs from 'fs/promises';
import path from 'path';

const SECRET_PATTERNS = {
  aws_access_key: {
    pattern: /(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/g,
    name: 'AWS Access Key',
    severity: 'Critical',
    cwe: 'CWE-798',
    description: 'AWS access key exposed in code'
  },
  aws_secret_key: {
    pattern: /aws(.{0,20})?(?:secret)?(.{0,20})?['\"][0-9a-zA-Z\/+]{40}['\"]/gi,
    name: 'AWS Secret Key',
    severity: 'Critical',
    cwe: 'CWE-798',
    description: 'AWS secret key exposed in code'
  },
  github_token: {
    pattern: /(ghp|gho|ghu|ghs|ghr)_[0-9a-zA-Z]{36}/g,
    name: 'GitHub Token',
    severity: 'Critical',
    cwe: 'CWE-798',
    description: 'GitHub personal access token exposed'
  },
  github_app_token: {
    pattern: /(ghu|ghs)_[0-9a-zA-Z]{36}/g,
    name: 'GitHub App Token',
    severity: 'Critical',
    cwe: 'CWE-798',
    description: 'GitHub app token exposed'
  },
  google_api_key: {
    pattern: /AIza[0-9A-Za-z\-_]{35}/g,
    name: 'Google API Key',
    severity: 'High',
    cwe: 'CWE-798',
    description: 'Google API key exposed'
  },
  google_oauth: {
    pattern: /[0-9]+-[0-9A-Za-z_]{32}\.apps\.googleusercontent\.com/g,
    name: 'Google OAuth Client ID',
    severity: 'High',
    cwe: 'CWE-798',
    description: 'Google OAuth credentials exposed'
  },
  slack_token: {
    pattern: /xox[baprs]-([0-9a-zA-Z]{10,48})/g,
    name: 'Slack Token',
    severity: 'High',
    cwe: 'CWE-798',
    description: 'Slack API token exposed'
  },
  slack_webhook: {
    pattern: /https:\/\/hooks\.slack\.com\/services\/T[a-zA-Z0-9_]{8}\/B[a-zA-Z0-9_]{8}\/[a-zA-Z0-9_]{24}/g,
    name: 'Slack Webhook URL',
    severity: 'High',
    cwe: 'CWE-798',
    description: 'Slack webhook URL exposed'
  },
  stripe_key: {
    pattern: /(sk|pk)_(test|live)_[0-9a-zA-Z]{24,}/g,
    name: 'Stripe API Key',
    severity: 'Critical',
    cwe: 'CWE-798',
    description: 'Stripe API key exposed'
  },
  paypal_token: {
    pattern: /access_token\$production\$[0-9a-z]{16}\$[0-9a-f]{32}/gi,
    name: 'PayPal Token',
    severity: 'Critical',
    cwe: 'CWE-798',
    description: 'PayPal access token exposed'
  },
  private_key: {
    pattern: /-----BEGIN (RSA |DSA |EC |OPENSSH )?PRIVATE KEY-----/g,
    name: 'Private Key',
    severity: 'Critical',
    cwe: 'CWE-798',
    description: 'Private cryptographic key exposed'
  },
  jwt_secret: {
    pattern: /(jwt|token)(_secret|Secret|_key|Key)?['"\s]*[=:]['"\s]*['"][a-zA-Z0-9_\-]{20,}['"]/gi,
    name: 'JWT Secret',
    severity: 'High',
    cwe: 'CWE-798',
    description: 'JWT secret key exposed'
  },
  database_url: {
    pattern: /(mongodb|mysql|postgres|postgresql):\/\/[^\s'"]+/gi,
    name: 'Database Connection String',
    severity: 'Critical',
    cwe: 'CWE-798',
    description: 'Database connection string with credentials exposed'
  },
  redis_url: {
    pattern: /redis:\/\/[^\s'"]+/gi,
    name: 'Redis Connection String',
    severity: 'High',
    cwe: 'CWE-798',
    description: 'Redis connection string exposed'
  },
  generic_api_key: {
    pattern: /(api[_-]?key|apikey|api[_-]?secret)['"\s]*[=:]['"\s]*['"][a-zA-Z0-9_\-]{16,}['"]/gi,
    name: 'Generic API Key',
    severity: 'High',
    cwe: 'CWE-798',
    description: 'Generic API key exposed'
  },
  generic_secret: {
    pattern: /(secret|password|passwd|pwd)['"\s]*[=:]['"\s]*['"][^'"\s]{8,}['"]/gi,
    name: 'Generic Secret',
    severity: 'Medium',
    cwe: 'CWE-798',
    description: 'Generic secret or password exposed'
  },
  twitter_oauth: {
    pattern: /[t|T][w|W][i|I][t|T][t|T][e|E][r|R].*['\"][0-9a-zA-Z]{35,44}['"]/g,
    name: 'Twitter OAuth Token',
    severity: 'High',
    cwe: 'CWE-798',
    description: 'Twitter OAuth token exposed'
  },
  facebook_token: {
    pattern: /EAACEdEose0cBA[0-9A-Za-z]+/g,
    name: 'Facebook Access Token',
    severity: 'High',
    cwe: 'CWE-798',
    description: 'Facebook access token exposed'
  },
  mailgun_api_key: {
    pattern: /key-[0-9a-zA-Z]{32}/g,
    name: 'Mailgun API Key',
    severity: 'High',
    cwe: 'CWE-798',
    description: 'Mailgun API key exposed'
  },
  twilio_api_key: {
    pattern: /SK[0-9a-fA-F]{32}/g,
    name: 'Twilio API Key',
    severity: 'High',
    cwe: 'CWE-798',
    description: 'Twilio API key exposed'
  },
  heroku_api_key: {
    pattern: /[h|H][e|E][r|R][o|O][k|K][u|U].*[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/gi,
    name: 'Heroku API Key',
    severity: 'High',
    cwe: 'CWE-798',
    description: 'Heroku API key exposed'
  },
  npm_token: {
    pattern: /npm_[a-zA-Z0-9]{36}/g,
    name: 'NPM Token',
    severity: 'High',
    cwe: 'CWE-798',
    description: 'NPM access token exposed'
  },
  docker_hub_token: {
    pattern: /dckr_pat_[a-zA-Z0-9_-]{32,}/g,
    name: 'Docker Hub Token',
    severity: 'High',
    cwe: 'CWE-798',
    description: 'Docker Hub access token exposed'
  }
};

// Files and directories to skip
const SKIP_PATTERNS = [
  /node_modules/,
  /\.git/,
  /dist/,
  /build/,
  /coverage/,
  /\.next/,
  /\.nuxt/,
  /\.cache/,
  /\.vscode/,
  /\.idea/,
  /package-lock\.json/,
  /yarn\.lock/,
  /\.png$/,
  /\.jpg$/,
  /\.jpeg$/,
  /\.gif$/,
  /\.svg$/,
  /\.ico$/,
  /\.pdf$/,
  /\.zip$/,
  /\.tar/,
  /\.gz$/,
  /\.min\.js$/,
  /\.min\.css$/,
  /\.map$/
];

/**
 * Scan directory recursively for files
 */
async function getAllFiles(dirPath, fileList = []) {
  try {
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      
      // Skip patterns
      if (SKIP_PATTERNS.some(pattern => pattern.test(filePath))) {
        continue;
      }

      try {
        const stat = await fs.stat(filePath);
        
        if (stat.isDirectory()) {
          await getAllFiles(filePath, fileList);
        } else if (stat.isFile()) {
          fileList.push(filePath);
        }
      } catch (err) {
        // Skip files that can't be accessed
        console.warn(`Could not access: ${filePath}`);
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dirPath}:`, err.message);
  }

  return fileList;
}

/**
 * Check if file should be skipped
 */
function shouldSkipFile(filePath) {
  return SKIP_PATTERNS.some(pattern => pattern.test(filePath));
}

/**
 * Mask secret for display
 */
function maskSecret(secret) {
  if (!secret || secret.length <= 8) return '***';
  return secret.substring(0, 4) + '...' + secret.substring(secret.length - 4);
}

/**
 * Get remediation advice for secret type
 */
function getRemediation(type) {
  const recommendations = {
    aws_access_key: 'Use AWS IAM roles or AWS Systems Manager Parameter Store. Never commit credentials.',
    aws_secret_key: 'Use AWS IAM roles or AWS Secrets Manager. Rotate the exposed key immediately.',
    github_token: 'Revoke the token immediately and create a new one. Use GitHub Secrets for CI/CD.',
    google_api_key: 'Regenerate the API key and restrict it by IP address and API.',
    slack_token: 'Revoke the token in Slack app settings and create a new one.',
    stripe_key: 'Rotate the key immediately in Stripe dashboard. Use environment variables.',
    private_key: 'Remove from repository and generate new key pair. Use secure key management.',
    jwt_secret: 'Rotate the secret immediately. Use environment variables and secrets management.',
    database_url: 'Use environment variables. Rotate database credentials immediately.',
    generic_api_key: 'Rotate the API key and use environment variables or secrets management.',
    generic_secret: 'Move to environment variables or use a secret management service.'
  };

  return recommendations[type] || 'Move to environment variables and use a secret management service (AWS Secrets Manager, HashiCorp Vault, Azure Key Vault).';
}

/**
 * Get security impact description
 */
function getSecurityImpact(type) {
  const impacts = {
    aws_access_key: 'Attackers can access your AWS resources, potentially incurring costs or stealing data.',
    github_token: 'Unauthorized access to your repositories, ability to push malicious code.',
    stripe_key: 'Financial fraud, unauthorized transactions, customer data exposure.',
    database_url: 'Complete database access, data theft, data modification or deletion.',
    private_key: 'Unauthorized authentication, encrypted data exposure, man-in-the-middle attacks.'
  };

  return impacts[type] || 'Unauthorized access to services and potential data breaches.';
}

/**
 * Main secret scanning function
 */
export async function scanForSecrets(repoPath) {
  console.log('🔍 Starting secret scanning...');
  
  const secrets = [];
  const files = await getAllFiles(repoPath);
  
  console.log(`📁 Scanning ${files.length} files...`);

  for (const file of files) {
    if (shouldSkipFile(file)) continue;

    try {
      const content = await fs.readFile(file, 'utf-8');
      const lines = content.split('\n');
      
      for (const [type, config] of Object.entries(SECRET_PATTERNS)) {
        let lineNumber = 0;
        
        for (const line of lines) {
          lineNumber++;
          
          // Skip comments and example/dummy values
          if (line.trim().startsWith('//') || 
              line.trim().startsWith('#') ||
              line.trim().startsWith('*') ||
              line.includes('example') ||
              line.includes('REPLACE') ||
              line.includes('YOUR_') ||
              line.includes('xxx') ||
              line.includes('***')) {
            continue;
          }

          config.pattern.lastIndex = 0; // Reset regex
          let match;
          
          while ((match = config.pattern.exec(line)) !== null) {
            secrets.push({
              type: config.name,
              severity: config.severity,
              file: file.replace(repoPath, '').replace(/^\//, ''),
              line: lineNumber,
              column: match.index,
              match: maskSecret(match[0]),
              fullMatch: match[0].substring(0, 50), // For internal use only
              description: config.description,
              cwe: config.cwe,
              recommendation: getRemediation(type),
              securityImpact: getSecurityImpact(type),
              lineContent: line.trim().substring(0, 100) + (line.length > 100 ? '...' : '')
            });
          }
        }
      }
    } catch (err) {
      // Skip binary files or files that can't be read
      if (err.code !== 'ENOENT') {
        console.warn(`Could not read file: ${file}`);
      }
    }
  }

  console.log(`✅ Secret scanning complete. Found ${secrets.length} potential secrets.`);

  return {
    found: secrets.length,
    items: secrets,
    summary: {
      critical: secrets.filter(s => s.severity === 'Critical').length,
      high: secrets.filter(s => s.severity === 'High').length,
      medium: secrets.filter(s => s.severity === 'Medium').length,
      low: secrets.filter(s => s.severity === 'Low').length
    },
    byType: secrets.reduce((acc, secret) => {
      acc[secret.type] = (acc[secret.type] || 0) + 1;
      return acc;
    }, {})
  };
}

export default scanForSecrets;
