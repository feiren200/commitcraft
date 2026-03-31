# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.2.0] - 2026-03-31

### Changed

- Rewrite system prompt to guide model through analysis flow: WHAT → WHY → IMPACT
- Add file context summary (changed files, status, line counts) alongside diff
- Better examples for each commit style (Conventional, Simple, Emoji)
- Warn model against describing file names instead of intent

### Added

- Interactive configuration panel (Webview) via `CommitCraft: Open Settings`
- Provider-based configuration: select provider → auto-fill API URL → pick model
- 17 providers with 70+ preset models (OpenAI, DeepSeek, Claude, Gemini, etc.)
- Live preview of commit message format in config panel
- Post-processing to enforce commit format regardless of model output
- Smart type detection for Conventional Commits (feat/fix/refactor/docs/test/etc.)
- Friendly warning when API is not configured (with "Open Settings" button)
- Save feedback in config panel (Saving... → Saved! / Failed)

### Fixed

- Config panel not responding to clicks (VSCode webview CSP issue)
- Language setting not being respected in prompt
- SCM title bar button not visible

## [0.1.0] - 2026-03-30

### Added

- Initial release
- Generate commit messages from git diff using OpenAI-compatible APIs
- Support for any OpenAI-compatible proxy/service
- Three commit styles: Conventional, Simple, Emoji
- Two detail levels: Concise, Detailed
- 7 languages: English, Chinese, Japanese, Korean, French, German, Spanish
- Button in Source Control sidebar title bar
- Configurable max diff length
- Auto-detect staged diff, fallback to working tree diff
