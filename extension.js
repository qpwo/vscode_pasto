const vscode = require('vscode')

async function activate(context) {
    // This is the original command, now templated.
    // Replace with your command's logic.
    let disposableSearch = vscode.commands.registerCommand('TODO_extension_id.TODO_command_name', async () => {
        vscode.window.showInformationMessage('Hello from TODO_command_title!');
    });
    context.subscriptions.push(disposableSearch);

    // This is the new command to insert 'hello'.
    let disposableInsert = vscode.commands.registerCommand('TODO_extension_id.insert_hello', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            editor.edit(editBuilder => {
                editBuilder.insert(editor.selection.active, 'hello');
            });
        }
    });
    context.subscriptions.push(disposableInsert);
}

function deactivate() { }

module.exports = { activate, deactivate }
