const vscode = require('vscode');

/**
 * VS Code Pasto Extension
 *
 * Commands:
 * 1. pasto.pasteNewLines: Paste text, stripping blank lines, ensuring each line is on a new line.
 * 2. pasto.pastePivot: Paste "opposite" way. Lines -> Words (at cursor). Words -> Lines (on new lines).
 */
async function activate(context) {
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
                const doc = editor.document;
                const lineIndex = selection.end.line;

                // If last line, append \n then text. Else insert text\n at next line start.
                if (lineIndex >= doc.lineCount - 1) {
                    const pos = doc.lineAt(lineIndex).range.end;
                    editBuilder.insert(pos, '\n' + newText);
                } else {
                    const pos = new vscode.Position(lineIndex + 1, 0);
                    editBuilder.insert(pos, newText + '\n');
                }
            }
        });
    }));

    // Command 2: Paste pivot (lines to words, words to lines)
    context.subscriptions.push(vscode.commands.registerCommand('pasto.pastePivot', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const text = await vscode.env.clipboard.readText();
        if (!text) return;

        const trimmed = text.trim();
        const isLines = trimmed.includes('\n');

        if (isLines) {
            // Case A: Clipboard has lines -> Paste as Words (at cursor)
            // Join lines with spaces
            const words = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0).join(' ');
            await editor.edit(editBuilder => {
                for (const selection of editor.selections) {
                    editBuilder.replace(selection, words);
                }
            });
        } else {
            // Case B: Clipboard has words -> Paste as Lines (on new line)
            // Split by whitespace
            const lines = trimmed.split(/\s+/).join('\n');
            await editor.edit(editBuilder => {
                for (const selection of editor.selections) {
                    const doc = editor.document;
                    const lineIndex = selection.end.line;

                    if (lineIndex >= doc.lineCount - 1) {
                        const pos = doc.lineAt(lineIndex).range.end;
                        editBuilder.insert(pos, '\n' + lines);
                    } else {
                        const pos = new vscode.Position(lineIndex + 1, 0);
                        editBuilder.insert(pos, lines + '\n');
                    }
                }
            });
        }
    }));
}

function deactivate() {}

module.exports = { activate, deactivate }
