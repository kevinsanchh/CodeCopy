// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("extension.copyPathAndCode", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const document = editor.document;
      const relativePath = path.relative(vscode.workspace.rootPath || "", document.uri.fsPath);
      const fileCode = document.getText();

      // Combine the path and code
      const combinedText = `Path: ${relativePath}\nCode:\n${fileCode}`;

      // Copy to clipboard
      await vscode.env.clipboard.writeText(combinedText);
      vscode.window.showInformationMessage("File path and code copied to clipboard!");
    } else {
      vscode.window.showWarningMessage("No active editor found.");
    }
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
