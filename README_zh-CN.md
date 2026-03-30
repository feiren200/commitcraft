# CommitCraft

使用 AI 生成 git commit 信息。支持任意 OpenAI 兼容 API，包括各种中转服务。

[English](./README.md) | 简体中文

## 功能

- 🤖 根据 git diff 调用 AI 自动生成 commit 信息
- 🌐 兼容所有 OpenAI 格式 API：OpenAI、DeepSeek、Moonshot、智谱、通义千问、各种中转
- 🎨 三种风格：Conventional Commits / 简洁自然语言 / Emoji 前缀
- 📝 两种详细程度：简洁 / 详细
- 🌍 支持 7 种语言
- 📌 按钮直接嵌入源代码管理侧边栏标题栏

## 环境要求

- VSCode 1.85+
- 任意 OpenAI 兼容服务的 API Key

## 快速开始

### 1. 配置 API

打开配置面板：

- **命令面板**：`Ctrl+Shift+P` → 搜索 `CommitCraft: Open Settings`
- 或者点击源代码管理标题栏的 ⚙️ 按钮

选择**提供商**（OpenAI、DeepSeek、OpenRouter 等），输入 **API Key**，选择**模型**。API 地址会根据提供商自动填充。

### 2. 生成 Commit 信息

1. 在 Git 中暂存（Stage）你的更改
2. 点击源代码管理标题栏的 🪄 按钮
3. 生成的 commit 信息自动填入输入框

### 常用配置示例

| 提供商     | API 地址                       | 说明                |
| ---------- | ------------------------------ | ------------------- |
| OpenAI     | `https://api.openai.com/v1`    | 默认，填 Key 即可   |
| DeepSeek   | `https://api.deepseek.com/v1`  | 提供商选 "DeepSeek" |
| OpenRouter | `https://openrouter.ai/api/v1` | 一个 Key 用所有模型 |
| 任意中转   | 你的代理地址                   | 提供商选 "Custom"   |

## 配置项

| 设置                        | 说明                                      | 默认值                      |
| --------------------------- | ----------------------------------------- | --------------------------- |
| `commitCraft.apiBaseUrl`    | API 地址（OpenAI 兼容）                   | `https://api.openai.com/v1` |
| `commitCraft.apiKey`        | API 密钥                                  | （空）                      |
| `commitCraft.presetModel`   | 预设模型选择（下拉框）                    | `gpt-4o-mini`               |
| `commitCraft.customModel`   | 自定义模型名（覆盖预设）                  | （空）                      |
| `commitCraft.language`      | 提交信息语言                              | `English`                   |
| `commitCraft.style`         | 风格：`conventional` / `simple` / `emoji` | `conventional`              |
| `commitCraft.detail`        | 详细程度：`concise` / `detailed`          | `concise`                   |
| `commitCraft.maxDiffLength` | 发送给模型的最大 diff 字符数              | `8000`                      |

### 预设模型

| 厂商      | 模型                                                          |
| --------- | ------------------------------------------------------------- |
| OpenAI    | gpt-4o, gpt-4o-mini, o3-mini                                  |
| Anthropic | claude-sonnet-4, claude-opus-4, claude-3-5-haiku _（需中转）_ |
| Google    | gemini-2.5-flash, gemini-2.5-pro                              |
| DeepSeek  | deepseek-chat, deepseek-reasoner                              |
| Moonshot  | moonshot-v1-8k                                                |
| 智谱      | glm-4-plus                                                    |
| 阿里      | qwen-plus                                                     |

使用 `customModel` 可填入预设列表之外的任意模型，例如通过 OpenRouter 使用 `anthropic/claude-sonnet-4`。

## 支持的 API 服务

任何实现 OpenAI Chat Completions 格式的服务均可使用：

| 服务             | Base URL 示例                                       |
| ---------------- | --------------------------------------------------- |
| OpenAI           | `https://api.openai.com/v1`                         |
| DeepSeek         | `https://api.deepseek.com/v1`                       |
| Moonshot（Kimi） | `https://api.moonshot.cn/v1`                        |
| 智谱（GLM）      | `https://open.bigmodel.cn/api/paas/v4`              |
| 通义千问         | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| 任意中转         | `https://your-proxy.com/v1`                         |

## 工作原理

1. 读取暂存区 diff（如果没有暂存则读取工作区 diff）
2. 将 diff 连同结构化 prompt 发送到配置的 API
3. 将生成的信息写入 SCM 输入框

diff 超过 `maxDiffLength` 时会自动截断。

## 开发

```bash
git clone https://github.com/feiren200/commitcraft.git
cd commitcraft
npm install
npm run compile
```

在 VSCode 中按 `F5` 启动调试。

## 打包

```bash
npm install -g @vscode/vsce
vsce package
```

生成 `.vsix` 文件后可通过「扩展 → 从 VSIX 安装」进行安装。

## 参与贡献

请参阅 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 许可证

[MIT](./LICENSE)
