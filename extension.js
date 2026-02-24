const vscode = require('vscode');

/**
 * VS Code Pasto Extension
 *
 * Commands:
 * 1. pasto.pasteNewLines: Paste text, stripping blank lines.
 * 2. pasto.pasteOneLine: Paste all text on one line.
 * 3. pasto.pasteWordsOnLines: Paste each space-separated word on its own line.
 */
async function activate(context) {
    // Helper to sort selections to ensure safe calculation of offsets
    const getSortedSelections = (editor) => {
        return editor.selections.slice().sort((a, b) => a.start.compareTo(b.start));
    };

    // Command 1: Paste on new lines without blank lines
    context.subscriptions.push(vscode.commands.registerCommand('pasto.pasteNewLines', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const text = await vscode.env.clipboard.readText();
        if (!text) return;

        // Filter out blank lines and join
        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length === 0) return;
        const newText = lines.join('\n');

        await editor.edit(editBuilder => {
            for (const selection of editor.selections) {
                editBuilder.replace(selection, newText);
            }
        });
    }));

    // Command 1b: Paste on new lines without blank lines (Terminal)
    context.subscriptions.push(vscode.commands.registerCommand('pasto.pasteNewLinesTerminal', async () => {
        const text = await vscode.env.clipboard.readText();
        if (!text) return;

        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length === 0) return;
        const newText = lines.join('\n');

        if (vscode.window.activeTerminal) {
            vscode.window.activeTerminal.sendText(newText, false);
        }
    }));

    // Command 2: Paste all on one line
    context.subscriptions.push(vscode.commands.registerCommand('pasto.pasteOneLine', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const text = await vscode.env.clipboard.readText();
        if (!text) return;

        const words = text.split(/\s+/).filter(l => l.length > 0).join(' ');

        await editor.edit(editBuilder => {
            for (const selection of editor.selections) {
                editBuilder.replace(selection, words);
            }
        });
    }));

    // Command 2b: Paste all on one line (Terminal)
    context.subscriptions.push(vscode.commands.registerCommand('pasto.pasteOneLineTerminal', async () => {
        const text = await vscode.env.clipboard.readText();
        if (!text) return;

        const newText = text.split(/\s+/).filter(l => l.length > 0).join(' ');

        if (vscode.window.activeTerminal) {
            vscode.window.activeTerminal.sendText(newText, false);
        }
    }));

    // Command 3: Paste words on lines
    context.subscriptions.push(vscode.commands.registerCommand('pasto.pasteWordsOnLines', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const text = await vscode.env.clipboard.readText();
        if (!text) return;

        const lines = text.split(/\s+/).filter(l => l.length > 0).join('\n');

        await editor.edit(editBuilder => {
            for (const selection of editor.selections) {
                editBuilder.replace(selection, lines);
            }
        });
    }));

    // Command 3b: Paste words on lines (Terminal)
    context.subscriptions.push(vscode.commands.registerCommand('pasto.pasteWordsOnLinesTerminal', async () => {
        const text = await vscode.env.clipboard.readText();
        if (!text) return;

        const newText = text.split(/\s+/).filter(l => l.length > 0).join('\n');

        if (vscode.window.activeTerminal) {
            vscode.window.activeTerminal.sendText(newText, false);
        }
    }));
}

function deactivate() {}

module.exports = { activate, deactivate }
