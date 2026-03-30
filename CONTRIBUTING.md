# Contributing

Contributions are welcome! Here's how you can help.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature`

## Development

```bash
npm install
npm run compile    # One-time build
npm run watch      # Watch mode for development
```

Press `F5` in VSCode to launch the Extension Development Host.

## Pull Requests

1. Make sure `npm run compile` passes without errors
2. Test your changes in the Extension Development Host
3. Keep PRs focused — one feature or fix per PR
4. Write a clear description of what you changed and why

## Adding a New Language

1. Add the language to `aiCommitGen.language.enum` in `package.json`
2. Add the language to `package.nls.json` if using NLS
3. Test commit message generation in that language

## Adding API Provider Support

The extension uses the OpenAI Chat Completions format. Most providers already work out of the box. If a provider needs special handling:

1. Check if the provider is truly OpenAI-compatible (some differ slightly)
2. If adaptation is needed, add it in `src/llm.ts`
3. Document the provider's base URL in the README

## Code Style

- TypeScript strict mode
- Keep it simple — this is a focused tool, not a framework

## Issues

- Use issue templates when available
- For bugs: include VSCode version, extension version, API provider, and error messages
- For features: describe the use case clearly

## License

By contributing, you agree your contributions will be licensed under MIT.
