import * as vscode from 'vscode';

interface CompletionResponse {
  choices: Array<{
    message: { content: string };
  }>;
}

/**
 * Extract changed file info from diff for richer context.
 */
function extractFileInfo(diff: string): string {
  const fileHeaders = diff.match(/^diff --git .+$/gm) || [];
  const files = fileHeaders.map(h => {
    const match = h.match(/^diff --git a\/(.+?) b\/(.+)$/);
    return match ? match[2] : '';
  }).filter(Boolean);

  if (files.length === 0) return '';

  const lines = diff.split('\n');
  let added = 0, removed = 0;
  for (const line of lines) {
    if (line.startsWith('+') && !line.startsWith('+++')) added++;
    if (line.startsWith('-') && !line.startsWith('---')) removed++;
  }

  const fileSummary = files.map(f => {
    // Extract per-file stats
    const fileDiff = extractFileDiff(diff, f);
    const fileAdded = (fileDiff.match(/^\+[^+]/gm) || []).length;
    const fileRemoved = (fileDiff.match(/^-[^-]/gm) || []).length;
    const isNew = fileDiff.includes('new file mode');
    const isDeleted = fileDiff.includes('deleted file mode');
    let status = 'modified';
    if (isNew) status = 'new file';
    if (isDeleted) status = 'deleted';
    return `  ${f} (${status}, +${fileAdded}/-${fileRemoved})`;
  }).join('\n');

  return `Changed files (${files.length} files, +${added}/-${removed} lines):
${fileSummary}`;
}

function extractFileDiff(diff: string, filePath: string): string {
  const pattern = new RegExp(`^diff --git a/.+? b/${escapeRegex(filePath)}$`, 'm');
  const start = diff.search(pattern);
  if (start === -1) return '';

  const afterStart = diff.substring(start);
  // Find the next diff --git or end of string
  const nextDiff = afterStart.indexOf('\ndiff --git ', 1);
  return nextDiff === -1 ? afterStart : afterStart.substring(0, nextDiff);
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Call an OpenAI-compatible chat completions endpoint.
 */
export async function generateCommitMessage(
  diff: string,
  config: {
    apiBaseUrl: string;
    apiKey: string;
    model: string;
    language: string;
    style: string;
    detail: string;
    maxDiffLength: number;
  }
): Promise<string> {
  // Extract file info before truncating
  const fileInfo = extractFileInfo(diff);

  // Truncate diff if too long
  let diffToSend = diff;
  if (diff.length > config.maxDiffLength) {
    diffToSend =
      diff.substring(0, config.maxDiffLength) +
      '\n\n... [diff truncated for length] ...';
  }

  const systemPrompt = buildSystemPrompt(config);
  const userPrompt = buildUserPrompt(diffToSend, fileInfo);

  // Normalize base URL
  let baseUrl = config.apiBaseUrl.replace(/\/+$/, '');
  baseUrl = baseUrl.replace(/\/chat\/completions$/, '');

  const url = `${baseUrl}/chat/completions`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (config.apiKey) {
    headers['Authorization'] = `Bearer ${config.apiKey}`;
  }

  const body = JSON.stringify({
    model: config.model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 512,
  });

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });
  } catch (err: any) {
    throw new Error(
      `Network error connecting to ${url}: ${err.message || err}. ` +
      `Check your API Base URL setting.`
    );
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(
      `API error ${response.status}: ${text || response.statusText}`
    );
  }

  const data = (await response.json()) as CompletionResponse;

  if (!data.choices || data.choices.length === 0) {
    throw new Error('API returned no choices. Check your model name.');
  }

  let message = data.choices[0].message.content?.trim() || '';

  // Clean up common model output artifacts
  message = message.replace(/^["']|["']$/g, '');
  message = message.replace(/^```(?:\w*\n)?([\s\S]*?)```$/, '$1').trim();

  // Post-process to enforce format
  message = enforceFormat(message, config.style);

  return message;
}

function buildUserPrompt(diff: string, fileInfo: string): string {
  let prompt = '';
  if (fileInfo) {
    prompt += `${fileInfo}\n\n`;
  }
  prompt += `Git diff:\n\n\`\`\`diff\n${diff}\n\`\`\``;
  return prompt;
}

/**
 * Post-process commit message to enforce the selected style.
 */
function enforceFormat(message: string, style: string): string {
  if (!message) return message;

  const firstLine = message.split('\n')[0];

  switch (style) {
    case 'conventional': {
      if (/^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?:\s/.test(firstLine)) {
        return message;
      }
      const type = detectConventionalType(message);
      return `${type}: ${message}`;
    }
    case 'emoji': {
      if (/^[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u.test(firstLine)) {
        return message;
      }
      const emoji = detectEmoji(message);
      return `${emoji} ${message}`;
    }
    case 'simple': {
      let clean = message.replace(/^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?:\s*/i, '');
      clean = clean.replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}]\s*/u, '');
      return clean;
    }
    default:
      return message;
  }
}

function detectConventionalType(message: string): string {
  const lower = message.toLowerCase();
  if (/\b(add|implement|create|new|feature|introduce)\b/.test(lower)) return 'feat';
  if (/\b(fix|bug|resolve|patch|crash|error|issue)\b/.test(lower)) return 'fix';
  if (/\b(refactor|restructure|reorganize|rewrite|clean.?up)\b/.test(lower)) return 'refactor';
  if (/\b(doc|readme|comment|changelog)\b/.test(lower)) return 'docs';
  if (/\b(test|spec|coverage|unit|e2e)\b/.test(lower)) return 'test';
  if (/\b(style|format|lint|prettier|whitespace)\b/.test(lower)) return 'style';
  if (/\b(perf|performance|optimize|speed|fast)\b/.test(lower)) return 'perf';
  if (/\b(ci|pipeline|workflow|action|github)\b/.test(lower)) return 'ci';
  if (/\b(build|webpack|vite|rollup|compile|bundle)\b/.test(lower)) return 'build';
  return 'chore';
}

function detectEmoji(message: string): string {
  const lower = message.toLowerCase();
  if (/\b(add|implement|create|new|feature|introduce)\b/.test(lower)) return '✨';
  if (/\b(fix|bug|resolve|patch|crash|error)\b/.test(lower)) return '🔧';
  if (/\b(refactor|restructure|rewrite|clean.?up)\b/.test(lower)) return '♻️';
  if (/\b(doc|readme|comment)\b/.test(lower)) return '📝';
  if (/\b(test|spec|coverage)\b/.test(lower)) return '🧪';
  if (/\b(style|format|lint)\b/.test(lower)) return '🎨';
  if (/\b(perf|optimize|speed)\b/.test(lower)) return '⚡';
  if (/\b(ci|pipeline|workflow)\b/.test(lower)) return '👷';
  if (/\b(build|webpack|compile|bundle)\b/.test(lower)) return '🔨';
  return '📝';
}

function buildSystemPrompt(config: {
  language: string;
  style: string;
  detail: string;
}): string {
  const lang = config.language;

  let detailGuide: string;
  if (config.detail === 'detailed') {
    detailGuide = `Write a detailed commit message:
- First line: a concise summary of WHAT changed (max 72 chars)
- Blank line
- Body: explain WHY this change was made and WHAT the impact is
- Focus on the motivation and context, not just restating the diff`;
  } else {
    detailGuide = `Write a concise one-line commit message (max 72 chars).
Focus on WHAT changed and WHY, not just the file names.`;
  }

  let styleGuide: string;
  switch (config.style) {
    case 'conventional':
      styleGuide = `Follow the Conventional Commits format:
- Prefix with a type based on the nature of the change:
  • feat: new feature or capability for the user
  • fix: bug fix
  • refactor: code restructuring without changing behavior
  • docs: documentation only
  • style: formatting, whitespace, missing semicolons
  • test: adding or updating tests
  • perf: performance improvement
  • ci: CI/CD configuration
  • build: build system or dependencies
  • chore: maintenance tasks
- Add scope in parentheses when it clarifies: feat(auth): ...
- Format: <type>(<scope>): <description>

Good examples:
  feat(auth): add Google OAuth login support
  fix: resolve race condition in WebSocket reconnection
  refactor(api): extract validation logic into middleware
  perf(db): add index on users.email column`;
      break;
    case 'simple':
      styleGuide = `Write in plain natural language. Start with an action verb.
No type prefix. No emoji prefix.

Good examples:
  Add Google OAuth login support
  Fix race condition in WebSocket reconnection
  Extract validation logic into API middleware
  Add database index on users.email for faster lookups`;
      break;
    case 'emoji':
      styleGuide = `Start with an emoji that matches the change type:
  ✨ new feature: "✨ Add Google OAuth login"
  🐛 bug fix: "🐛 Fix WebSocket reconnection race condition"
  ♻️ refactor: "♻️ Extract validation into middleware"
  📝 docs: "📝 Update API documentation"
  🎨 style: "🎨 Reformat with prettier"
  🧪 test: "🧪 Add unit tests for auth service"
  ⚡ perf: "⚡ Add index on users.email column"
  🔨 build: "🔨 Update webpack to v5"
  👷 ci: "👷 Add GitHub Actions workflow"

Choose the emoji that BEST matches the primary change.`;
      break;
    default:
      styleGuide = '';
  }

  return `You are an expert software developer writing a git commit message.

Analyze the diff carefully. Think about:
1. WHAT files/components were changed
2. WHY the developer made these changes (intent, motivation)
3. WHAT the impact or effect of the change is

Then write a commit message that captures the ESSENCE of the change.
Do NOT just describe file-level changes like "modify auth.ts". Instead,
describe the meaningful change: "Add login timeout to prevent session hijacking".

IMPORTANT: Write the ENTIRE commit message in ${lang}.
Do not use any other language unless ${lang} is English.

${styleGuide}

${detailGuide}

Output ONLY the commit message. No explanations, no quotes, no code blocks.`;
}
