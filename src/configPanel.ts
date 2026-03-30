import * as vscode from 'vscode';
import { PROVIDERS } from './providers';

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

  // Detect current provider from baseUrl
  const currentProvider = detectProvider(apiBaseUrl);

  const providersJson = JSON.stringify(PROVIDERS);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
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
    --hint: var(--vscode-descriptionForeground);
    --border: var(--vscode-panel-border);
  }
  body {
    font-family: var(--vscode-font-family);
    color: var(--fg);
    background: var(--bg);
    padding: 24px;
    max-width: 600px;
    margin: 0 auto;
  }
  h1 { font-size: 1.4em; margin-bottom: 4px; }
  .subtitle { color: var(--hint); font-size: 0.85em; margin-bottom: 20px; }
  .field { margin-bottom: 14px; }
  label { display: block; font-size: 0.88em; font-weight: 600; margin-bottom: 4px; }
  .hint { color: var(--hint); font-size: 0.78em; margin-top: 2px; }
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
  input:focus, select:focus { outline: 1px solid var(--btn-bg); border-color: var(--btn-bg); }
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
    margin-top: 4px;
  }
  button:hover { background: var(--btn-hover); }
  hr { border: none; border-top: 1px solid var(--border); margin: 18px 0; }
  .section { font-size: 0.95em; font-weight: 600; margin-bottom: 10px; }
  .url-override { margin-top: 6px; }
</style>
</head>
<body>

<h1>⚙️ CommitCraft Settings</h1>
<p class="subtitle">Select a provider, then choose your model</p>

<div class="section">🔌 Provider</div>

<div class="field">
  <label>Provider</label>
  <select id="provider" onchange="onProviderChange()">
  </select>
</div>

<div class="field" id="urlField">
  <label>API Base URL</label>
  <input id="apiBaseUrl" type="text" value="${esc(apiBaseUrl)}" placeholder="https://..." />
  <div class="hint">Auto-filled by provider. Edit to use a proxy or custom endpoint.</div>
</div>

<div class="field" id="apiKeyField">
  <label>API Key</label>
  <input id="apiKey" type="password" value="${esc(apiKey)}" placeholder="sk-..." />
</div>

<hr />

<div class="section">🤖 Model</div>

<div class="field" id="modelField">
  <label>Model</label>
  <select id="presetModel">
  </select>
  <div class="hint" id="modelHint"></div>
</div>

<div class="field" id="customModelField">
  <label>Custom Model (optional)</label>
  <input id="customModel" type="text" value="${esc(customModel)}" placeholder="e.g. anthropic/claude-sonnet-4" />
  <div class="hint">Overrides the preset model above</div>
</div>

<hr />

<div class="section">📝 Commit Style</div>

<div class="row">
  <div class="field">
    <label>Language</label>
    <select id="language">
      ${langOptions(language)}
    </select>
  </div>
  <div class="field">
    <label>Style</label>
    <select id="style">
      ${selOpt('conventional', style)}
      ${selOpt('simple', style)}
      ${selOpt('emoji', style)}
    </select>
  </div>
  <div class="field">
    <label>Detail</label>
    <select id="detail">
      ${selOpt('concise', detail)}
      ${selOpt('detailed', detail)}
    </select>
  </div>
</div>

<div class="field">
  <label>Max Diff Length</label>
  <input id="maxDiffLength" type="number" value="${maxDiffLength}" min="1000" max="50000" step="1000" />
</div>

<button onclick="save()">💾 Save Settings</button>

<script>
const providers = ${providersJson};
const currentProvider = "${esc(currentProvider)}";
const currentPresetModel = "${esc(presetModel)}";
const currentCustomModel = "${esc(customModel)}";

// Build provider dropdown
const providerSel = document.getElementById('provider');
providers.forEach((p, i) => {
  const opt = document.createElement('option');
  opt.value = i;
  opt.textContent = p.name;
  if (p.name === currentProvider) opt.selected = true;
  providerSel.appendChild(opt);
});

function onProviderChange() {
  const p = providers[providerSel.value];
  const urlInput = document.getElementById('apiBaseUrl');
  const urlHint = urlInput.nextElementSibling;

  if (p.name.startsWith('Anthropic')) {
    urlInput.value = '';
    urlInput.placeholder = 'Enter your proxy URL (Anthropic native API is not OpenAI-compatible)';
    urlHint.textContent = '⚠️ Anthropic native API does NOT support OpenAI format. Use OpenRouter, or a proxy like one-api.';
  } else if (p.name === 'Custom') {
    urlInput.value = '';
    urlInput.placeholder = 'https://your-proxy.com/v1';
    urlHint.textContent = 'Enter your OpenAI-compatible endpoint URL';
  } else {
    urlInput.value = p.baseUrl;
    urlHint.textContent = 'Auto-filled by provider. Edit to use a proxy or custom endpoint.';
  }
  // Build model list
  const modelSel = document.getElementById('presetModel');
  modelSel.innerHTML = '';
  if (p.models.length === 0) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = '(use custom model)';
    modelSel.appendChild(opt);
    document.getElementById('modelHint').textContent = 'Enter model name in the Custom Model field below';
  } else {
    document.getElementById('modelHint').textContent = '';
    p.models.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.value;
      opt.textContent = m.label + ' (' + m.value + ')';
      if (m.value === currentPresetModel) opt.selected = true;
      modelSel.appendChild(opt);
    });
  }
}

// Initialize
onProviderChange();

// If we have a custom model, try to select it or show it
if (currentCustomModel) {
  document.getElementById('customModel').value = currentCustomModel;
}

const vscode = acquireVsCodeApi();
function save() {
  const urlVal = document.getElementById('apiBaseUrl').value;
  vscode.postMessage({
    type: 'save',
    data: {
      apiBaseUrl: urlVal,
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

function detectProvider(baseUrl: string): string {
  for (const p of PROVIDERS) {
    if (p.baseUrl && baseUrl.startsWith(p.baseUrl)) {
      return p.name;
    }
  }
  return 'Custom';
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function selOpt(value: string, current: string): string {
  const selected = value === current ? ' selected' : '';
  return `<option value="${esc(value)}"${selected}>${esc(value)}</option>`;
}

function langOptions(current: string): string {
  const langs = ['English', '中文', '日本語', '한국어', 'Français', 'Deutsch', 'Español'];
  return langs.map(l => selOpt(l, current)).join('\n');
}
