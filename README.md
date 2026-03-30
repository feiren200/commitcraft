# CommitCraft

Generate git commit messages with AI. Supports any OpenAI-compatible API including proxies.

[简体中文](./README_zh-CN.md) | English

## Features

- 🤖 Generate commit messages from your git diff using AI
- 🌐 Works with any OpenAI-compatible API — OpenAI, DeepSeek, Moonshot, Zhipu, Tongyi Qianwen, or any proxy
- 🎨 Three styles: Conventional Commits, Simple, Emoji
- 📝 Two detail levels: Concise / Detailed
- 🌍 7 languages supported
- 📌 Button in the Source Control sidebar title bar

## Requirements

- VSCode 1.85+
- An API key for any OpenAI-compatible service

## Getting Started

### 1. Configure API

Open the configuration panel:

- **Command Palette**: `Ctrl+Shift+P` → search `CommitCraft: Open Settings`
- Or click the ⚙️ button in the Source Control title bar

Select a **Provider** (OpenAI, DeepSeek, OpenRouter, etc.), enter your **API Key**, and choose a **Model**. The API Base URL is auto-filled based on your provider choice.

### 2. Generate Commit Message

1. Stage your changes in Git
2. Click the 🪄 button in the Source Control title bar
3. The generated commit message appears in the input box

### Quick Configuration Examples

| Provider | API Base URL | Notes |
|---|---|---|
| OpenAI | `https://api.openai.com/v1` | Default, just add your key |
| DeepSeek | `https://api.deepseek.com/v1` | Select "DeepSeek" in provider dropdown |
| OpenRouter | `https://openrouter.ai/api/v1` | Access all models with one key |
| Any proxy | Your proxy URL | Select "Custom" provider |

## Configuration

| Setting                     | Description                                | Default                     |
| --------------------------- | ------------------------------------------ | --------------------------- |
| `commitCraft.apiBaseUrl`    | API base URL (OpenAI-compatible)           | `https://api.openai.com/v1` |
| `commitCraft.apiKey`        | API key                                    | (empty)                     |
| `commitCraft.presetModel`   | Preset model selection (dropdown)          | `gpt-4o-mini`               |
| `commitCraft.customModel`   | Custom model name (overrides preset)       | (empty)                     |
| `commitCraft.language`      | Commit message language                    | `English`                   |
| `commitCraft.style`         | Style: `conventional` / `simple` / `emoji` | `conventional`              |
| `commitCraft.detail`        | Detail level: `concise` / `detailed`       | `concise`                   |
| `commitCraft.maxDiffLength` | Max diff characters sent to the model      | `8000`                      |

### Preset Models

| Provider  | Models                                                         |
| --------- | -------------------------------------------------------------- |
| OpenAI    | gpt-4o, gpt-4o-mini, o3-mini                                   |
| Anthropic | claude-sonnet-4, claude-opus-4, claude-3-5-haiku _(via proxy)_ |
| Google    | gemini-2.5-flash, gemini-2.5-pro                               |
| DeepSeek  | deepseek-chat, deepseek-reasoner                               |
| Moonshot  | moonshot-v1-8k                                                 |
| Zhipu     | glm-4-plus                                                     |
| Alibaba   | qwen-plus                                                      |

Use `customModel` for any model not in the preset list, e.g. `anthropic/claude-sonnet-4` via OpenRouter.

## Supported API Services

Any service that implements the OpenAI Chat Completions API format:

| Service         | Base URL Example                                    |
| --------------- | --------------------------------------------------- |
| OpenAI          | `https://api.openai.com/v1`                         |
| DeepSeek        | `https://api.deepseek.com/v1`                       |
| Moonshot (Kimi) | `https://api.moonshot.cn/v1`                        |
| Zhipu (GLM)     | `https://open.bigmodel.cn/api/paas/v4`              |
| Tongyi Qianwen  | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| Any proxy       | `https://your-proxy.com/v1`                         |

## How It Works

1. Reads staged diff (falls back to working tree diff if none staged)
2. Sends diff to the configured API endpoint with a structured prompt
3. Writes the generated message into the SCM input box

The diff is truncated to `maxDiffLength` characters if it exceeds the limit.

## Development

```bash
git clone https://github.com/feiren200/commitcraft.git
cd commitcraft
npm install
npm run compile
```

Press `F5` in VSCode to launch the Extension Development Host.

## Packaging

```bash
npm install -g @vscode/vsce
vsce package
```

This generates a `.vsix` file that can be installed via "Extensions → Install from VSIX".

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
