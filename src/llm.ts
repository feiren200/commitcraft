import * as vscode from 'vscode';

interface CompletionResponse {
  choices: Array<{
    message: { content: string };
  }>;
}

/**
 * Call an OpenAI-compatible chat completions endpoint.
 * Works with: OpenAI, DeepSeek, Azure (with correct base URL),
 * any proxy that follows the /chat/completions convention.
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
  // Truncate diff if too long
  let diffToSend = diff;
  if (diff.length > config.maxDiffLength) {
    diffToSend =
      diff.substring(0, config.maxDiffLength) +
      '\n\n... [diff truncated for length] ...';
  }

  const systemPrompt = buildSystemPrompt(config);
  const userPrompt = `Here is the git diff:\n\n\`\`\`diff\n${diffToSend}\n\`\`\``;

  // Normalize base URL: strip trailing slash and /chat/completions if present
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

  // Remove surrounding quotes if the model added them
  message = message.replace(/^["']|["']$/g, '');

  // Remove markdown code block wrapper if present
  message = message.replace(/^```(?:\w*\n)?([\s\S]*?)```$/, '$1').trim();

  return message;
}

function buildSystemPrompt(config: {
  language: string;
  style: string;
  detail: string;
}): string {
  const lang = config.language;
  const detail =
    config.detail === 'detailed'
      ? 'Write a detailed commit message with a short summary line followed by a body that explains WHY and WHAT changed.'
      : 'Write a concise one-line commit message.';

  let styleGuide = '';
  switch (config.style) {
    case 'conventional':
      styleGuide = `Follow the Conventional Commits format:
- Prefix with a type: feat, fix, refactor, docs, style, test, chore, perf, ci, build
- Use scope in parentheses when relevant: feat(auth): ...
- Format: <type>(<optional scope>): <description>
Examples: "fix: resolve null pointer in auth flow", "feat(api): add user search endpoint"`;
      break;
    case 'simple':
      styleGuide = `Write in plain natural language. No prefix required.
Examples: "Add user search endpoint", "Fix null pointer in authentication"`;
      break;
    case 'emoji':
      styleGuide = `Start with an emoji that matches the change type:
🔧 for fixes, ✨ for features, ♻️ for refactors, 📝 for docs, 🎨 for style, 🧪 for tests, ⚡ for perf, 🔨 for build, 👷 for CI
Format: <emoji> <description>
Examples: "✨ Add user search endpoint", "🔧 Fix null pointer in authentication"`;
      break;
  }

  return `You are a git commit message generator. Output ONLY the commit message, nothing else. No explanations, no quotes.

Language: ${lang}

${styleGuide}

${detail}

Rules:
- Output ONLY the commit message text
- Do NOT wrap in quotes or code blocks
- Do NOT add "Here is the commit message:" or similar prefixes
- Keep it actionable and descriptive`;
}
