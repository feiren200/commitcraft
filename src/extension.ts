import * as vscode from 'vscode';
import { getGitDiff, setCommitMessage } from './git';
import { generateCommitMessage } from './llm';
import { registerConfigPanel } from './configPanel';

export function activate(context: vscode.ExtensionContext) {
  // Generate command
  const generateCmd = vscode.commands.registerCommand(
    'commitCraft.generate',
    async () => {
      await handleGenerate();
    }
  );

  // Configuration panel command
  const configCmd = registerConfigPanel(context);

  context.subscriptions.push(generateCmd, configCmd);
}

function resolveModel(config: vscode.WorkspaceConfiguration): string {
  const customModel = config.get<string>('customModel', '').trim();
  if (customModel) {
    return customModel;
  }
  return config.get<string>('presetModel', 'gpt-4o-mini');
}

async function handleGenerate(): Promise<void> {
  const config = vscode.workspace.getConfiguration('commitCraft');
  const apiBaseUrl = config.get<string>('apiBaseUrl', '');
  const apiKey = config.get<string>('apiKey', '');
  const model = resolveModel(config);

  if (!apiBaseUrl) {
    const action = await vscode.window.showErrorMessage(
      'CommitCraft: API Base URL not configured.',
      'Open Settings'
    );
    if (action === 'Open Settings') {
      await vscode.commands.executeCommand('commitCraft.configure');
    }
    return;
  }

  const diff = await getGitDiff();
  if (!diff) {
    vscode.window.showWarningMessage(
      'CommitCraft: No changes detected. Stage or modify files first.'
    );
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.SourceControl,
      title: `✨ CommitCraft (${model}) generating...`,
      cancellable: false,
    },
    async () => {
      try {
        const message = await generateCommitMessage(diff, {
          apiBaseUrl,
          apiKey,
          model,
          language: config.get<string>('language', 'English'),
          style: config.get<string>('style', 'conventional'),
          detail: config.get<string>('detail', 'concise'),
          maxDiffLength: config.get<number>('maxDiffLength', 8000),
        });

        await setCommitMessage(message);
        vscode.window.setStatusBarMessage('✅ Commit message generated', 3000);
      } catch (err: any) {
        vscode.window.showErrorMessage(
          `CommitCraft: ${err.message || err}`
        );
      }
    }
  );
}

export function deactivate() {}
