import * as vscode from "vscode";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("extension.copyPathAndCode", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const document = editor.document;
      const relativePath = path.relative(vscode.workspace.rootPath || "", document.uri.fsPath);

      // Check for selected text
      const selectedText = editor.selection.isEmpty
        ? null
        : editor.document.getText(editor.selection);
      const textToCopy = selectedText || document.getText(); // Use selected text or entire code if nothing is selected

      // Combine the path and text
      const combinedText = `Path: ${relativePath}\n\n${
        selectedText ? "Selected Code:" : "Code:"
      }\n${textToCopy}`;

      // Copy to clipboard
      await vscode.env.clipboard.writeText(combinedText);
      vscode.window.showInformationMessage("File path and selected code copied to clipboard!");
    } else {
      vscode.window.showWarningMessage("No active editor found.");
    }
  });

  context.subscriptions.push(disposable);
}
