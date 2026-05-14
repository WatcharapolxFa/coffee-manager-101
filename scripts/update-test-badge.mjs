#!/usr/bin/env node
// PostToolUse hook: runs after Write|Edit on tests/**/*.test.js
// Updates the <!-- test-badge --> line in CLAUDE.md with current test results.
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = '/Users/Watcharapol.Y/Desktop/Coffee';

let payload = '';
process.stdin.setEncoding('utf8');
for await (const chunk of process.stdin) payload += chunk;

let filePath = '';
try { filePath = JSON.parse(payload)?.tool_input?.file_path ?? ''; } catch { /* no-op */ }

if (!/tests\/.*\.test\.js$/.test(filePath)) process.exit(0);

let passed = '?', failed = '0';
try {
  const out = execSync('npm test 2>&1', { cwd: ROOT, encoding: 'utf8' });
  const m = out.match(/Tests\s+(\d+) passed(?:[^,]*,\s*(\d+) failed)?/);
  if (m) { passed = m[1]; failed = m[2] ?? '0'; }
} catch (e) {
  const m = (e.stdout ?? '').match(/Tests\s+(\d+) passed(?:[^,]*,\s*(\d+) failed)?/);
  if (m) { passed = m[1]; failed = m[2] ?? '0'; }
  else { failed = '?'; }
}

const badge = `<!-- test-badge: ${passed} passed, ${failed} failed -->`;
const mdPath = join(ROOT, 'CLAUDE.md');
let md = readFileSync(mdPath, 'utf8');
md = md.replace(/<!-- test-badge:.*-->\n?/, '');
if (!md.startsWith('<!-- test-badge:')) {
  md = badge + '\n' + md;
}
writeFileSync(mdPath, md);
