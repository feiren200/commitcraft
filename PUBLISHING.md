# Publishing Guide

## Prerequisites

1. Create a [Visual Studio Marketplace publisher](https://marketplace.visualstudio.com/manage)
2. Get a Personal Access Token (PAT) from Azure DevOps
3. Install vsce: `npm install -g @vscode/vsce`

## Steps

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Commit everything
4. Login: `vsce login YOUR_PUBLISHER_NAME`
5. Publish: `vsce publish`

Or package first to test:
```bash
vsce package
# Install the .vsix locally to test
code --install-extension commitcraft-0.1.0.vsix
```

## GitHub Release

1. Create a tag: `git tag v0.1.0 && git push origin v0.1.0`
2. Create a GitHub Release from the tag
3. Attach the `.vsix` file to the release
4. Copy release notes from CHANGELOG.md

## Pre-publish Checklist

- [ ] Version bumped in package.json
- [ ] CHANGELOG.md updated
- [ ] README links point to correct repo URL
- [ ] `npm run compile` passes
- [ ] Tested in Extension Development Host
- [ ] icon.png is 128x128 PNG
