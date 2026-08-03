import * as vscode from 'vscode';

/**
 * Get the git diff from the VSCode git extension.
 * Returns staged diff if available, otherwise working tree diff.
 */
export async function getGitDiff(): Promise<string | null> {
  const gitExtension = vscode.extensions.getExtension('vscode.git');
  if (!gitExtension) {
    vscode.window.showErrorMessage('Git extension not found.');
    return null;
  }

  if (!gitExtension.isActive) {
    await gitExtension.activate();
  }

  const api = gitExtension.exports.getAPI(1);
  if (!api || !api.repositories || api.repositories.length === 0) {
    vscode.window.showWarningMessage('No git repository found.');
    return null;
  }

  const repo = api.repositories[0];

  // Try staged diff first
  let diff = await getStagedDiff(repo);
  if (diff) {
    return diff;
  }

  // Fallback to working tree diff
  diff = await getWorkingTreeDiff(repo);
  return diff;
}

/**
 * Get diff of staged changes.
 */
async function getStagedDiff(repo: any): Promise<string | null> {
  try {
    const diff = await repositoryDiff(repo, true);
    if (diff && diff.trim().length > 0) {
      return diff;
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Get diff of working tree changes (unstaged).
 */
async function getWorkingTreeDiff(repo: any): Promise<string | null> {
  try {
    const diff = await repositoryDiff(repo, false);
    if (diff && diff.trim().length > 0) {
      return diff;
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Call repository.diff() — compatible across VSCode git extension versions.
 */
async function repositoryDiff(repo: any, cached: boolean): Promise<string | null> {
  if (typeof repo.diff === 'function') {
    return await repo.diff(cached);
  }
  // Some versions expose it differently
  if (typeof repo.diffIndexWith === 'function') {
    return cached ? await repo.diffIndexWith('HEAD') : await repo.diffWith('HEAD');
  }
  return null;
}

/**
 * Set the commit message in the SCM input box.
 */
export async function setCommitMessage(message: string): Promise<void> {
  const gitExtension = vscode.extensions.getExtension('vscode.git');
  if (!gitExtension) {
    throw new Error('Git extension not found.');
  }

  if (!gitExtension.isActive) {
    try {
      await gitExtension.activate();
    } catch (err: any) {
      throw new Error(
        `Failed to activate Git extension: ${err.message || err}`
      );
    }
  }

  if (!gitExtension.isActive) {
    throw new Error('Git extension is not active.');
  }

  const api = gitExtension.exports.getAPI(1);
  const repo = api?.repositories?.[0];
  if (!repo) {
    throw new Error('No Git repository found.');
  }

  if (!repo.inputBox) {
    throw new Error('Git commit input box is unavailable.');
  }

  repo.inputBox.value = message;
  if (repo.inputBox.value !== message) {
    throw new Error(
      'Failed to write the generated commit message to the Git input box.'
    );
  }
}
