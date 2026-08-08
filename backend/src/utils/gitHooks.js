import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Pre-commit hook script
 */
const PRE_COMMIT_HOOK = `#!/bin/sh
# CodeGuardian Pre-Commit Hook
# Scans staged files for security issues before commit

echo "🛡️  CodeGuardian: Scanning staged files..."

# Get list of staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\\.(js|jsx|ts|tsx|json|env)$' || true)

if [ -z "$STAGED_FILES" ]; then
  echo "✅ No files to scan"
  exit 0
fi

# Check if CodeGuardian CLI is installed
if ! command -v codeguardian &> /dev/null; then
  echo "⚠️  CodeGuardian CLI not found. Skipping scan."
  echo "Install with: npm install -g codeguardian-cli"
  exit 0
fi

# Run scan on staged files
codeguardian scan --staged --fail-on critical,high

SCAN_EXIT_CODE=$?

if [ $SCAN_EXIT_CODE -ne 0 ]; then
  echo ""
  echo "❌ CodeGuardian found security issues!"
  echo "Fix the issues or use 'git commit --no-verify' to skip (not recommended)"
  exit 1
fi

echo "✅ CodeGuardian scan passed!"
exit 0
`;

/**
 * Pre-push hook script
 */
const PRE_PUSH_HOOK = `#!/bin/sh
# CodeGuardian Pre-Push Hook
# Full repository scan before pushing to remote

echo "🛡️  CodeGuardian: Running full repository scan..."

# Check if CodeGuardian CLI is installed
if ! command -v codeguardian &> /dev/null; then
  echo "⚠️  CodeGuardian CLI not found. Skipping scan."
  exit 0
fi

# Run full scan
codeguardian scan --fail-on critical

SCAN_EXIT_CODE=$?

if [ $SCAN_EXIT_CODE -ne 0 ]; then
  echo ""
  echo "❌ CodeGuardian found critical security issues!"
  echo "Fix the issues or use 'git push --no-verify' to skip (not recommended)"
  exit 1
fi

echo "✅ CodeGuardian scan passed!"
exit 0
`;

/**
 * Commit-msg hook script
 */
const COMMIT_MSG_HOOK = `#!/bin/sh
# CodeGuardian Commit Message Hook
# Checks commit messages for security keywords

COMMIT_MSG_FILE=$1
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

# Check for security-related keywords
SECURITY_KEYWORDS="password|secret|api[_-]?key|token|credential|private[_-]?key"

if echo "$COMMIT_MSG" | grep -qiE "$SECURITY_KEYWORDS"; then
  echo ""
  echo "⚠️  WARNING: Your commit message contains security-related keywords!"
  echo "   Keywords detected: $(echo "$COMMIT_MSG" | grep -ioE "$SECURITY_KEYWORDS" | head -1)"
  echo ""
  echo "   Make sure you haven't committed sensitive data."
  echo "   Review your changes carefully before pushing."
  echo ""
fi

exit 0
`;

/**
 * Install git hooks in a repository
 */
export async function installGitHooks(repoPath) {
  const gitHooksDir = path.join(repoPath, '.git', 'hooks');
  
  try {
    // Check if .git directory exists
    await fs.access(path.join(repoPath, '.git'));
  } catch (error) {
    throw new Error('Not a git repository');
  }

  const hooks = {
    'pre-commit': PRE_COMMIT_HOOK,
    'pre-push': PRE_PUSH_HOOK,
    'commit-msg': COMMIT_MSG_HOOK
  };

  const installedHooks = [];
  const errors = [];

  for (const [hookName, hookContent] of Object.entries(hooks)) {
    const hookPath = path.join(gitHooksDir, hookName);
    
    try {
      // Check if hook already exists
      let shouldInstall = true;
      try {
        const existingHook = await fs.readFile(hookPath, 'utf-8');
        if (existingHook.includes('CodeGuardian')) {
          console.log(`⚠️  ${hookName} hook already exists, backing up...`);
          await fs.rename(hookPath, `${hookPath}.backup`);
        } else {
          console.log(`⚠️  ${hookName} hook exists, creating backup...`);
          await fs.rename(hookPath, `${hookPath}.backup`);
        }
      } catch (err) {
        // Hook doesn't exist, proceed with installation
      }

      // Write hook file
      await fs.writeFile(hookPath, hookContent, { mode: 0o755 });
      
      // Make executable (Unix-like systems)
      if (process.platform !== 'win32') {
        await fs.chmod(hookPath, 0o755);
      }

      installedHooks.push(hookName);
      console.log(`✅ Installed ${hookName} hook`);
    } catch (error) {
      errors.push({ hook: hookName, error: error.message });
      console.error(`❌ Failed to install ${hookName} hook:`, error.message);
    }
  }

  return {
    success: errors.length === 0,
    installed: installedHooks,
    errors: errors,
    message: errors.length === 0 
      ? `Successfully installed ${installedHooks.length} git hooks`
      : `Installed ${installedHooks.length} hooks with ${errors.length} errors`
  };
}

/**
 * Uninstall CodeGuardian git hooks
 */
export async function uninstallGitHooks(repoPath) {
  const gitHooksDir = path.join(repoPath, '.git', 'hooks');
  const hookNames = ['pre-commit', 'pre-push', 'commit-msg'];
  
  const uninstalled = [];
  const errors = [];

  for (const hookName of hookNames) {
    const hookPath = path.join(gitHooksDir, hookName);
    
    try {
      const hookContent = await fs.readFile(hookPath, 'utf-8');
      
      if (hookContent.includes('CodeGuardian')) {
        // Remove CodeGuardian hook
        await fs.unlink(hookPath);
        
        // Restore backup if exists
        const backupPath = `${hookPath}.backup`;
        try {
          await fs.access(backupPath);
          await fs.rename(backupPath, hookPath);
          uninstalled.push(`${hookName} (restored backup)`);
        } catch (err) {
          uninstalled.push(hookName);
        }
        
        console.log(`✅ Uninstalled ${hookName} hook`);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        errors.push({ hook: hookName, error: error.message });
      }
    }
  }

  return {
    success: true,
    uninstalled: uninstalled,
    errors: errors,
    message: `Uninstalled ${uninstalled.length} CodeGuardian hooks`
  };
}

/**
 * Check which hooks are installed
 */
export async function checkInstalledHooks(repoPath) {
  const gitHooksDir = path.join(repoPath, '.git', 'hooks');
  const hookNames = ['pre-commit', 'pre-push', 'commit-msg'];
  
  const hooks = {};

  for (const hookName of hookNames) {
    const hookPath = path.join(gitHooksDir, hookName);
    
    try {
      const hookContent = await fs.readFile(hookPath, 'utf-8');
      hooks[hookName] = {
        installed: true,
        isCodeGuardian: hookContent.includes('CodeGuardian'),
        executable: true
      };
    } catch (error) {
      hooks[hookName] = {
        installed: false,
        isCodeGuardian: false,
        executable: false
      };
    }
  }

  return hooks;
}

export default {
  installGitHooks,
  uninstallGitHooks,
  checkInstalledHooks
};
