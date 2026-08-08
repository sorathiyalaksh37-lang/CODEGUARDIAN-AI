# 🚀 Quick Implementation Guide - Top 5 Features

## Feature #1: CI/CD Integration (GitHub Actions)

### Time: 1-2 weeks | Impact: ⭐⭐⭐⭐⭐

### Implementation Steps:

#### 1. Create Webhook Endpoint
```javascript
// backend/src/routes/webhookRoutes.js
import express from 'express';
const router = express.Router();

router.post('/github', async (req, res) => {
  const { action, pull_request, repository } = req.body;
  
  if (action === 'opened' || action === 'synchronize') {
    // Trigger scan
    const scan = await scanRepository(pull_request.head.repo.clone_url);
    
    // Post comment on PR
    await postCommentToPR(pull_request.number, scan);
    
    // Update PR status
    await updatePRStatus(pull_request.number, scan.overallScore);
  }
  
  res.status(200).send('OK');
});

export default router;
```

#### 2. GitHub Action Workflow
```yaml
# .github/workflows/codeguardian.yml
name: CodeGuardian Security Scan

on:
  pull_request:
    types: [opened, synchronize]
  push:
    branches: [main, develop]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run CodeGuardian Scan
        uses: codeguardian/scan-action@v1
        with:
          api-key: ${{ secrets.CODEGUARDIAN_API_KEY }}
          fail-on: critical
          
      - name: Upload Results
        uses: actions/upload-artifact@v3
        with:
          name: security-report
          path: codeguardian-report.json
```

#### 3. PR Comment Template
```javascript
const generatePRComment = (scan) => `
## 🛡️ CodeGuardian Security Report

**Security Score:** ${scan.overallScore}/100 ${getScoreEmoji(scan.overallScore)}

### Vulnerability Summary
- 🔴 Critical: ${scan.severityBreakdown.Critical}
- 🟠 High: ${scan.severityBreakdown.High}
- 🟡 Medium: ${scan.severityBreakdown.Medium}
- 🟢 Low: ${scan.severityBreakdown.Low}

### Top Issues
${scan.reports.slice(0, 3).map(r => `
#### ${r.fileName}
**Severity:** ${r.severity}
**Issue:** ${r.review}
`).join('\n')}

[View Full Report →](${process.env.FRONTEND_URL}/scan-report/${scan.scanId})
`;
```

---

## Feature #2: VS Code Extension

### Time: 2-3 weeks | Impact: ⭐⭐⭐⭐⭐

### Project Structure:
```
codeguardian-vscode/
├── package.json
├── src/
│   ├── extension.ts
│   ├── scanner.ts
│   ├── decorations.ts
│   └── commands.ts
├── media/
│   └── icons/
└── README.md
```

### Key Files:

#### package.json
```json
{
  "name": "codeguardian",
  "displayName": "CodeGuardian AI",
  "description": "Real-time security scanning",
  "version": "1.0.0",
  "engines": {
    "vscode": "^1.75.0"
  },
  "activationEvents": [
    "onLanguage:javascript",
    "onLanguage:typescript",
    "onCommand:codeguardian.scanFile"
  ],
  "main": "./dist/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "codeguardian.scanFile",
        "title": "CodeGuardian: Scan Current File"
      },
      {
        "command": "codeguardian.scanWorkspace",
        "title": "CodeGuardian: Scan Entire Workspace"
      }
    ],
    "configuration": {
      "title": "CodeGuardian",
      "properties": {
        "codeguardian.apiKey": {
          "type": "string",
          "description": "Your CodeGuardian API key"
        }
      }
    }
  }
}
```

#### extension.ts
```typescript
import * as vscode from 'vscode';
import { scanFile, scanWorkspace } from './scanner';
import { showDiagnostics } from './decorations';

export function activate(context: vscode.ExtensionContext) {
  // Scan on save
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(async (document) => {
      const results = await scanFile(document.fileName);
      showDiagnostics(document, results);
    })
  );

  // Scan command
  context.subscriptions.push(
    vscode.commands.registerCommand('codeguardian.scanFile', async () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const results = await scanFile(editor.document.fileName);
        showDiagnostics(editor.document, results);
        vscode.window.showInformationMessage(
          `CodeGuardian: Found ${results.length} issues`
        );
      }
    })
  );
}
```

#### scanner.ts
```typescript
import axios from 'axios';
import * as vscode from 'vscode';

export async function scanFile(filePath: string) {
  const config = vscode.workspace.getConfiguration('codeguardian');
  const apiKey = config.get<string>('apiKey');
  
  const code = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath));
  
  const response = await axios.post('http://localhost:8000/api/aifix/fix', {
    code: code.toString(),
  }, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  
  return response.data.vulnerabilities || [];
}
```

#### decorations.ts
```typescript
import * as vscode from 'vscode';

const diagnosticCollection = vscode.languages.createDiagnosticCollection('codeguardian');

export function showDiagnostics(document: vscode.TextDocument, results: any[]) {
  const diagnostics: vscode.Diagnostic[] = results.map(issue => {
    const range = new vscode.Range(
      new vscode.Position(issue.line - 1, 0),
      new vscode.Position(issue.line - 1, 100)
    );
    
    const diagnostic = new vscode.Diagnostic(
      range,
      issue.message,
      getSeverity(issue.severity)
    );
    
    diagnostic.source = 'CodeGuardian';
    diagnostic.code = issue.cwe;
    
    return diagnostic;
  });
  
  diagnosticCollection.set(document.uri, diagnostics);
}

function getSeverity(severity: string): vscode.DiagnosticSeverity {
  switch (severity.toLowerCase()) {
    case 'critical':
    case 'high':
      return vscode.DiagnosticSeverity.Error;
    case 'medium':
      return vscode.DiagnosticSeverity.Warning;
    default:
      return vscode.DiagnosticSeverity.Information;
  }
}
```

---

## Feature #3: Dependency Vulnerability Scanning

### Time: 1 week | Impact: ⭐⭐⭐⭐⭐

### Implementation:

```javascript
// backend/src/services/dependencyScanner.js
import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const scanDependencies = async (repoPath) => {
  const vulnerabilities = [];
  
  // 1. NPM Audit
  try {
    const { stdout } = await execAsync('npm audit --json', { cwd: repoPath });
    const audit = JSON.parse(stdout);
    
    Object.values(audit.vulnerabilities).forEach(vuln => {
      vulnerabilities.push({
        package: vuln.name,
        severity: vuln.severity,
        version: vuln.range,
        vulnerability: vuln.via[0].title,
        cve: vuln.via[0].cve,
        fixVersion: vuln.fixAvailable?.version,
        url: vuln.via[0].url
      });
    });
  } catch (error) {
    console.error('NPM Audit failed:', error);
  }
  
  // 2. Check against Snyk API
  const snykVulns = await checkSnykAPI(repoPath);
  vulnerabilities.push(...snykVulns);
  
  // 3. Check outdated packages
  const outdated = await checkOutdatedPackages(repoPath);
  
  return {
    vulnerabilities,
    outdated,
    summary: {
      total: vulnerabilities.length,
      critical: vulnerabilities.filter(v => v.severity === 'critical').length,
      high: vulnerabilities.filter(v => v.severity === 'high').length,
      medium: vulnerabilities.filter(v => v.severity === 'moderate').length,
      low: vulnerabilities.filter(v => v.severity === 'low').length
    }
  };
};

const checkSnykAPI = async (repoPath) => {
  // Read package.json
  const packageJson = require(`${repoPath}/package.json`);
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };
  
  const vulns = [];
  
  for (const [pkg, version] of Object.entries(dependencies)) {
    try {
      const response = await axios.post('https://snyk.io/api/v1/test/npm', {
        package: pkg,
        version: version.replace(/^[\^~]/, '')
      }, {
        headers: { Authorization: `token ${process.env.SNYK_API_KEY}` }
      });
      
      if (response.data.issues.vulnerabilities.length > 0) {
        vulns.push(...response.data.issues.vulnerabilities);
      }
    } catch (error) {
      console.error(`Snyk check failed for ${pkg}:`, error);
    }
  }
  
  return vulns;
};

const checkOutdatedPackages = async (repoPath) => {
  try {
    const { stdout } = await execAsync('npm outdated --json', { cwd: repoPath });
    return JSON.parse(stdout);
  } catch (error) {
    // npm outdated returns exit code 1 when packages are outdated
    if (error.stdout) {
      return JSON.parse(error.stdout);
    }
    return {};
  }
};
```

### Add to Scanner:
```javascript
// In scanService.js
import { scanDependencies } from './dependencyScanner.js';

// Add this to your scan flow
const dependencyVulns = await scanDependencies(repoPath);

// Include in scan results
return {
  ...existingScanResults,
  dependencies: dependencyVulns
};
```

---

## Feature #4: Secret Detection

### Time: 3-5 days | Impact: ⭐⭐⭐⭐⭐

### Implementation:

```javascript
// backend/src/services/secretScanner.js
const SECRET_PATTERNS = {
  aws_access_key: {
    pattern: /(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/g,
    name: 'AWS Access Key',
    severity: 'critical'
  },
  aws_secret_key: {
    pattern: /aws(.{0,20})?['\"][0-9a-zA-Z\/+]{40}['\"]]/gi,
    name: 'AWS Secret Key',
    severity: 'critical'
  },
  github_token: {
    pattern: /ghp_[0-9a-zA-Z]{36}|gho_[0-9a-zA-Z]{36}|ghu_[0-9a-zA-Z]{36}/g,
    name: 'GitHub Token',
    severity: 'critical'
  },
  google_api_key: {
    pattern: /AIza[0-9A-Za-z\\-_]{35}/g,
    name: 'Google API Key',
    severity: 'high'
  },
  slack_token: {
    pattern: /xox[baprs]-([0-9a-zA-Z]{10,48})?/g,
    name: 'Slack Token',
    severity: 'high'
  },
  stripe_key: {
    pattern: /sk_live_[0-9a-zA-Z]{24}/g,
    name: 'Stripe Secret Key',
    severity: 'critical'
  },
  private_key: {
    pattern: /-----BEGIN (RSA |DSA |EC )?PRIVATE KEY-----/g,
    name: 'Private Key',
    severity: 'critical'
  },
  jwt_secret: {
    pattern: /(jwt|token).*[=:]\s*['\"][a-zA-Z0-9_\-]{20,}['\"]]/gi,
    name: 'JWT Secret',
    severity: 'high'
  },
  database_url: {
    pattern: /(mongodb|mysql|postgres):\/\/[^\s]+/gi,
    name: 'Database Connection String',
    severity: 'high'
  },
  generic_secret: {
    pattern: /(secret|password|passwd|pwd|api[_-]?key).*[=:]\s*['\"][^'\"]{8,}['\"]]/gi,
    name: 'Generic Secret',
    severity: 'medium'
  }
};

export const scanForSecrets = async (repoPath) => {
  const secrets = [];
  const files = await getAllFiles(repoPath);
  
  for (const file of files) {
    // Skip binary files, node_modules, etc.
    if (shouldSkipFile(file)) continue;
    
    const content = await fs.readFile(file, 'utf-8');
    const lines = content.split('\n');
    
    for (const [type, config] of Object.entries(SECRET_PATTERNS)) {
      let match;
      let lineNumber = 0;
      
      for (const line of lines) {
        lineNumber++;
        config.pattern.lastIndex = 0; // Reset regex
        
        while ((match = config.pattern.exec(line)) !== null) {
          secrets.push({
            type: config.name,
            severity: config.severity,
            file: file.replace(repoPath, ''),
            line: lineNumber,
            match: maskSecret(match[0]),
            recommendation: getRemediation(type)
          });
        }
      }
    }
  }
  
  return secrets;
};

const maskSecret = (secret) => {
  if (secret.length <= 8) return '***';
  return secret.substring(0, 4) + '...' + secret.substring(secret.length - 4);
};

const getRemediation = (type) => {
  const recommendations = {
    aws_access_key: 'Use AWS IAM roles or environment variables',
    github_token: 'Use GitHub Secrets or environment variables',
    jwt_secret: 'Move to environment variables (.env file)',
    database_url: 'Use environment variables and never commit',
    generic_secret: 'Use a secret management service (AWS Secrets Manager, HashiCorp Vault)'
  };
  
  return recommendations[type] || 'Move to environment variables';
};
```

### Add Secret Scanning to Main Scanner:
```javascript
// In scanService.js
import { scanForSecrets } from './secretScanner.js';

const secrets = await scanForSecrets(repoPath);

// Add to scan results
return {
  ...scanResults,
  secrets: {
    found: secrets.length,
    items: secrets
  }
};
```

---

## Feature #5: CLI Tool

### Time: 1 week | Impact: ⭐⭐⭐⭐

### Project Structure:
```
codeguardian-cli/
├── package.json
├── bin/
│   └── codeguardian.js
├── src/
│   ├── commands/
│   │   ├── scan.js
│   │   ├── init.js
│   │   └── export.js
│   ├── utils/
│   │   └── api.js
│   └── index.js
└── README.md
```

### package.json
```json
{
  "name": "codeguardian-cli",
  "version": "1.0.0",
  "bin": {
    "codeguardian": "./bin/codeguardian.js"
  },
  "dependencies": {
    "commander": "^11.0.0",
    "chalk": "^5.3.0",
    "ora": "^7.0.0",
    "inquirer": "^9.2.0",
    "axios": "^1.6.0",
    "cli-table3": "^0.6.3"
  }
}
```

### bin/codeguardian.js
```javascript
#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { scanCommand } from '../src/commands/scan.js';
import { initCommand } from '../src/commands/init.js';
import { exportCommand } from '../src/commands/export.js';

const program = new Command();

program
  .name('codeguardian')
  .description('CLI tool for CodeGuardian AI security scanning')
  .version('1.0.0');

program
  .command('scan [path]')
  .description('Scan repository for vulnerabilities')
  .option('-f, --fail-on <severity>', 'Fail on severity level (critical|high|medium|low)')
  .option('--ci', 'CI mode (exit with code 1 on vulnerabilities)')
  .option('--watch', 'Watch mode (continuous scanning)')
  .action(scanCommand);

program
  .command('init')
  .description('Initialize CodeGuardian configuration')
  .action(initCommand);

program
  .command('export')
  .description('Export scan results')
  .option('-f, --format <format>', 'Output format (json|csv|pdf)', 'json')
  .option('-o, --output <file>', 'Output file')
  .action(exportCommand);

program.parse();
```

### src/commands/scan.js
```javascript
import ora from 'ora';
import chalk from 'chalk';
import Table from 'cli-table3';
import { scanRepository } from '../utils/api.js';

export async function scanCommand(path = '.', options) {
  const spinner = ora('Scanning repository...').start();
  
  try {
    const results = await scanRepository(path);
    spinner.succeed('Scan completed!');
    
    // Display results
    console.log('\n' + chalk.bold('Security Score:'), getScoreColor(results.overallScore));
    
    // Vulnerability table
    const table = new Table({
      head: ['Severity', 'Count', 'Files'],
      style: { head: ['cyan'] }
    });
    
    Object.entries(results.severityBreakdown).forEach(([severity, count]) => {
      table.push([
        getSeverityColor(severity),
        count,
        results.reports.filter(r => r.severity === severity).length
      ]);
    });
    
    console.log(table.toString());
    
    // Show top vulnerabilities
    console.log('\n' + chalk.bold('Top Vulnerabilities:\n'));
    results.reports.slice(0, 5).forEach((report, idx) => {
      console.log(`${idx + 1}. ${chalk.yellow(report.fileName)}`);
      console.log(`   ${getSeverityBadge(report.severity)} ${report.review}\n`);
    });
    
    // CI mode
    if (options.ci && shouldFail(results, options.failOn)) {
      console.error(chalk.red('\n✖ Build failed due to security vulnerabilities'));
      process.exit(1);
    }
    
  } catch (error) {
    spinner.fail('Scan failed');
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

function getSeverityColor(severity) {
  const colors = {
    Critical: chalk.red(severity),
    High: chalk.orange(severity),
    Medium: chalk.yellow(severity),
    Low: chalk.green(severity)
  };
  return colors[severity] || severity;
}
```

---

## 🎯 Implementation Priority

### Week 1: Secret Detection
- Easiest to implement
- Immediate value
- Low complexity

### Week 2: Dependency Scanning
- High impact
- Uses existing tools
- Clear value proposition

### Week 3: CLI Tool
- Developer adoption
- Enables CI/CD
- Foundation for automation

### Week 4: CI/CD Integration
- Builds on CLI tool
- Requires webhook setup
- High enterprise value

### Weeks 5-7: VS Code Extension
- Most complex
- Highest user impact
- Continuous value

---

## 📚 Resources Needed

### Tools & Services
- GitHub API token
- Snyk API key (optional)
- VS Code Extension development setup
- CI/CD platform accounts

### Skills Required
- Node.js backend development
- TypeScript (for VS Code extension)
- GitHub API knowledge
- CI/CD platform experience
- Security scanning tools familiarity

---

**Start with Feature #1 (Secret Detection) - it's the quickest win!** 🚀
