import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Command 1: Switch Active Terminal by Name
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.switchTerminalByName', (args) => {
            try {
                // Parse the JSON input from the arguments
                const jsonInput = args || {};
                const terminalName = jsonInput.terminalName;

                if (!terminalName) {
                    vscode.window.showErrorMessage('Invalid JSON: "terminalName" is required.');
                    return;
                }

                // Find the terminal by name
                const terminal = vscode.window.terminals.find((t) => t.name === terminalName);

                if (terminal) {
                    terminal.show();
                } else {
                    vscode.window.showErrorMessage(`No terminal found with name "${terminalName}".`);
                }
            } catch (error) {
                vscode.window.showErrorMessage('Invalid JSON input.');
            }
        })
    );

    // Command 2: Create and Split Terminals from JSON
	context.subscriptions.push(
        vscode.commands.registerCommand('extension.createAndSplitTerminals', async (args) => {
            try {
                const terminalNames = args;

                if (!Array.isArray(terminalNames) || terminalNames.some((name) => typeof name !== 'string')) {
                    vscode.window.showErrorMessage('Invalid JSON input. Provide an array of terminal names.');
                    return;
                }

                let activeTerminal: vscode.Terminal | undefined = vscode.window.createTerminal({ name: terminalNames[0] });
				activeTerminal.show();
				terminalNames.shift();

                // Create the first terminal
                for(const name of terminalNames) {
					// Split the current terminal
					await vscode.commands.executeCommand('workbench.action.terminal.split');

					// Rename the split terminal
					activeTerminal = vscode.window.activeTerminal;
					if (activeTerminal) {
						await vscode.commands.executeCommand('workbench.action.terminal.renameWithArg', { name });
					}
                }

                vscode.window.showInformationMessage('Terminals created and split successfully.');
            } catch (error) {
                vscode.window.showErrorMessage('Error creating and splitting terminals.');
            }
        })
    );
}

export function deactivate() {}