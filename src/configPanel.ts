import * as vscode from 'vscode';

export function registerConfigPanel(context: vscode.ExtensionContext): vscode.Disposable {
  return vscode.commands.registerCommand('commitCraft.configure', () => {
    const panel = vscode.window.createWebviewPanel(
      'commitCraftConfig',
      'CommitCraft Settings',
      vscode.ViewColumn.One,
      { enableScripts: true, retainContextWhenHidden: true }
    );

    const config = vscode.workspace.getConfiguration('commitCraft');
    panel.webview.html = getWebviewContent(config);

    panel.webview.onDidReceiveMessage(async (msg) => {
      if (msg.type === 'save') {
        const cfg = vscode.workspace.getConfiguration('commitCraft');
        for (const [key, value] of Object.entries(msg.data)) {
          await cfg.update(key, value, vscode.ConfigurationTarget.Global);
        }
        vscode.window.showInformationMessage('CommitCraft: Settings saved ✅');
      }
    });
  });
}

function getWebviewContent(config: vscode.WorkspaceConfiguration): string {
  const apiBaseUrl = config.get<string>('apiBaseUrl', '');
  const apiKey = config.get<string>('apiKey', '');
  const presetModel = config.get<string>('presetModel', 'gpt-4o-mini');
  const customModel = config.get<string>('customModel', '');
  const language = config.get<string>('language', 'English');
  const style = config.get<string>('style', 'conventional');
  const detail = config.get<string>('detail', 'concise');
  const maxDiffLength = config.get<number>('maxDiffLength', 8000);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  :root {
    --bg: var(--vscode-editor-background);
    --fg: var(--vscode-editor-foreground);
    --input-bg: var(--vscode-input-background);
    --input-fg: var(--vscode-input-foreground);
    --input-border: var(--vscode-input-border);
    --btn-bg: var(--vscode-button-background);
    --btn-fg: var(--vscode-button-foreground);
    --btn-hover: var(--vscode-button-hoverBackground);
    --label: var(--vscode-foreground);
    --hint: var(--vscode-descriptionForeground);
  }
  body {
    font-family: var(--vscode-font-family);
    color: var(--fg);
    background: var(--bg);
    padding: 24px;
    max-width: 640px;
    margin: 0 auto;
  }
  h1 { font-size: 1.4em; margin-bottom: 4px; }
  .subtitle { color: var(--hint); font-size: 0.85em; margin-bottom: 24px; }
  .field { margin-bottom: 16px; }
  label {
    display: block;
    font-size: 0.9em;
    font-weight: 600;
    margin-bottom: 4px;
    color: var(--label);
  }
  .hint { color: var(--hint); font-size: 0.8em; margin-top: 2px; }
  input, select {
    width: 100%;
    padding: 6px 8px;
    background: var(--input-bg);
    color: var(--input-fg);
    border: 1px solid var(--input-border);
    border-radius: 4px;
    font-size: 0.9em;
    font-family: var(--vscode-font-family);
    box-sizing: border-box;
  }
  input:focus, select:focus {
    outline: 1px solid var(--btn-bg);
    border-color: var(--btn-bg);
  }
  .row { display: flex; gap: 12px; }
  .row > .field { flex: 1; }
  button {
    background: var(--btn-bg);
    color: var(--btn-fg);
    border: none;
    padding: 8px 24px;
    border-radius: 4px;
    font-size: 0.9em;
    cursor: pointer;
    font-family: var(--vscode-font-family);
    margin-top: 8px;
  }
  button:hover { background: var(--btn-hover); }
  .divider {
    border: none;
    border-top: 1px solid var(--vscode-panel-border);
    margin: 20px 0;
  }
  .section-title {
    font-size: 1em;
    font-weight: 600;
    margin-bottom: 12px;
  }
  .test-btn {
    background: transparent;
    border: 1px solid var(--btn-bg);
    color: var(--btn-bg);
    padding: 4px 12px;
    font-size: 0.8em;
    margin-left: 8px;
  }
  .test-btn:hover {
    background: var(--btn-bg);
    color: var(--btn-fg);
  }
</style>
</head>
<body>
<h1>⚙️ CommitCraft Settings</h1>
<p class="subtitle">Configure your AI commit message generator</p>

<div class="section-title">API Connection</div>

<div class="field">
  <label>API Base URL</label>
  <input id="apiBaseUrl" type="text" value="${esc(apiBaseUrl)}" placeholder="https://api.openai.com/v1" />
  <div class="hint">OpenAI-compatible endpoint. Works with proxies.</div>
</div>

<div class="field">
  <label>API Key</label>
  <input id="apiKey" type="password" value="${esc(apiKey)}" placeholder="sk-..." />
</div>

<hr class="divider" />
<div class="section-title">Model</div>

<div class="row">
  <div class="field">
    <label>Preset Model</label>
    <select id="presetModel">
      ${modelOption('gpt-4o', 'OpenAI GPT-4o', presetModel)}
      ${modelOption('gpt-4o-mini', 'OpenAI GPT-4o Mini', presetModel)}
      ${modelOption('o3-mini', 'OpenAI o3-mini', presetModel)}
      ${modelOption('claude-sonnet-4-20250514', 'Claude Sonnet 4 (proxy)', presetModel)}
      ${modelOption('claude-opus-4-20250514', 'Claude Opus 4 (proxy)', presetModel)}
      ${modelOption('claude-3-5-haiku-20241022', 'Claude 3.5 Haiku (proxy)', presetModel)}
      ${modelOption('gemini-2.5-flash', 'Gemini 2.5 Flash', presetModel)}
      ${modelOption('gemini-2.5-pro', 'Gemini 2.5 Pro', presetModel)}
      ${modelOption('deepseek-chat', 'DeepSeek V3', presetModel)}
      ${modelOption('deepseek-reasoner', 'DeepSeek R1', presetModel)}
      ${modelOption('moonshot-v1-8k', 'Moonshot Kimi', presetModel)}
      ${modelOption('glm-4-plus', 'Zhipu GLM-4', presetModel)}
      ${modelOption('qwen-plus', 'Tongyi Qwen', presetModel)}
    </select>
  </div>
  <div class="field">
    <label>Custom Model (overrides preset)</label>
    <input id="customModel" type="text" value="${esc(customModel)}" placeholder="e.g. anthropic/claude-sonnet-4" />
    <div class="hint">For OpenRouter or unsupported models</div>
  </div>
</div>

<hr class="divider" />
<div class="section-title">Commit Style</div>

<div class="row">
  <div class="field">
    <label>Language</label>
    <select id="language">
      ${opt('English', language)}
      ${opt('中文', language)}
      ${opt('日本語', language)}
      ${opt('한국어', language)}
      ${opt('Français', language)}
      ${opt('Deutsch', language)}
      ${opt('Español', language)}
    </select>
  </div>
  <div class="field">
    <label>Style</label>
    <select id="style">
      ${opt('conventional', style)}
      ${opt('simple', style)}
      ${opt('emoji', style)}
    </select>
  </div>
  <div class="field">
    <label>Detail</label>
    <select id="detail">
      ${opt('concise', detail)}
      ${opt('detailed', detail)}
    </select>
  </div>
</div>

<div class="field">
  <label>Max Diff Length</label>
  <input id="maxDiffLength" type="number" value="${maxDiffLength}" min="1000" max="50000" step="1000" />
  <div class="hint">Characters sent to the model (truncated if exceeded)</div>
</div>

<button onclick="save()">💾 Save Settings</button>

<script>
  const vscode = acquireVsCodeApi();
  function save() {
    vscode.postMessage({
      type: 'save',
      data: {
        apiBaseUrl: document.getElementById('apiBaseUrl').value,
        apiKey: document.getElementById('apiKey').value,
        presetModel: document.getElementById('presetModel').value,
        customModel: document.getElementById('customModel').value,
        language: document.getElementById('language').value,
        style: document.getElementById('style').value,
        detail: document.getElementById('detail').value,
        maxDiffLength: parseInt(document.getElementById('maxDiffLength').value) || 8000,
      }
    });
  }
</script>
</body>
</html>`;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function modelOption(value: string, label: string, current: string): string {
  const selected = value === current ? ' selected' : '';
  return `<option value="${esc(value)}"${selected}>${esc(label)} (${esc(value)})</option>`;
}

function opt(value: string, current: string): string {
  const selected = value === current ? ' selected' : '';
  return `<option value="${esc(value)}"${selected}>${esc(value)}</option>`;
}
