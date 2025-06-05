import * as vscode from "vscode";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("extension.copyPathAndCode", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const document = editor.document;
      const relativePath = path.relative(vscode.workspace.rootPath || "", document.uri.fsPath);

      // Get file extension for language guessing
      const ext = path.extname(document.fileName).replace(".", "").toLowerCase();

      // Check for selected text
      const selectedText = editor.selection.isEmpty
        ? null
        : editor.document.getText(editor.selection);
      const textToCopy = selectedText || document.getText();

      // Format combined text for LLM-friendly output with separators
      const combinedText =
        `\n=============================\n**File:** ${relativePath}\n=============================\n\n` +
        `\`\`\`${textToCopy}\n\`\`\`\n` +
        `=============================\nEnd of ${relativePath}\n=============================\n`;

      // Copy to clipboard
      await vscode.env.clipboard.writeText(combinedText);
      vscode.window.showInformationMessage("LLM-ready code snippet copied to clipboard!");
    } else {
      vscode.window.showWarningMessage("No active editor found.");
    }
  });

  let copyAllTabsDisposable = vscode.commands.registerCommand("extension.copyAllTabs", async () => {
    let combinedText = "";

    for (const tabGroup of vscode.window.tabGroups.all) {
      for (const tab of tabGroup.tabs) {
        if (tab.input instanceof vscode.TabInputText) {
          const document = await vscode.workspace.openTextDocument(tab.input.uri);
          const relativePath = path.relative(vscode.workspace.rootPath || "", document.uri.fsPath);
          const textToCopy = document.getText();
          const ext = path.extname(document.fileName).replace(".", "").toLowerCase();

          // Format combined text for LLM-friendly output with separators
          const fileBlock =
            `\n=============================\n**File:** ${relativePath}\n=============================\n\n` +
            `\`\`\`${ext}\n${textToCopy}\n\`\`\`\n` +
            `=============================\nEnd of ${relativePath}\n=============================\n`;

          combinedText += fileBlock;
        }
      }
    }

    if (combinedText) {
      // Copy to clipboard
      await vscode.env.clipboard.writeText(combinedText);
      vscode.window.showInformationMessage("LLM-ready code from all tabs copied to clipboard!");
    } else {
      vscode.window.showWarningMessage("No open text tabs found.");
    }
  });
  context.subscriptions.push(disposable, copyAllTabsDisposable);
}
