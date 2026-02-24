const vscode = require('vscode');

/**
 * VS Code Pasto Extension
 *
 * Commands:
 * 1. pasto.pasteNewLines: Paste text, stripping blank lines, ensuring each line is on a new line.
 * 2. pasto.pastePivot: Paste "opposite" way. Lines -> Words (at cursor). Words -> Lines (on new lines).
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

            const newSelections = [];
            let lineAdjustment = 0;
            let charAdjustment = 0;
            let lastLine = -1;

            await editor.edit(editBuilder => {
                for (const selection of getSortedSelections(editor)) {
                    const startLine = selection.start.line;

                    // Reset charAdjustment if we moved to a new line (in original document terms relative to processing order)
                    if (startLine > lastLine) {
                        charAdjustment = 0;
                    }

                    const newStartLine = startLine + lineAdjustment;
                    const newStartChar = selection.start.character + charAdjustment;

                    editBuilder.replace(selection, words);

                    const newEndLine = newStartLine;
                    const newEndChar = newStartChar + words.length;
                    newSelections.push(new vscode.Selection(newStartLine, newStartChar, newEndLine, newEndChar));

                    const removedLines = selection.end.line - selection.start.line;
                    lineAdjustment -= removedLines;

                    // Calculate char adjustment for the line we just ended on
                    charAdjustment = newEndChar - selection.end.character;
                    lastLine = selection.end.line;
                }
            });
            editor.selections = newSelections;
        } else {
            // Case B: Clipboard has words -> Paste as Lines (on new line)
            // Split by whitespace
            const linesArr = trimmed.split(/\s+/);
            const lines = linesArr.join('\n');

            const newSelections = [];
            let lineOffset = 0;
            const numLinesAdded = linesArr.length;

            await editor.edit(editBuilder => {
                for (const selection of getSortedSelections(editor)) {
                    const doc = editor.document;
                    const lineIndex = selection.end.line;

                    if (lineIndex >= doc.lineCount - 1) {
                        const pos = doc.lineAt(lineIndex).range.end;
                        editBuilder.insert(pos, '\n' + lines);

                        const startLine = lineIndex + 1 + lineOffset;
                        const endLine = startLine + numLinesAdded - 1;
                        const endChar = linesArr[linesArr.length - 1].length;
                        newSelections.push(new vscode.Selection(startLine, 0, endLine, endChar));
                    } else {
                        const pos = new vscode.Position(lineIndex + 1, 0);
                        editBuilder.insert(pos, lines + '\n');

                        const startLine = lineIndex + 1 + lineOffset;
                        const endLine = startLine + numLinesAdded;
                        newSelections.push(new vscode.Selection(startLine, 0, endLine, 0));
                    }
                    lineOffset += numLinesAdded;
                }
            });
            editor.selections = newSelections;
        }
    }));

    // Command 2b: Paste pivot (Terminal)
    context.subscriptions.push(vscode.commands.registerCommand('pasto.pastePivotTerminal', async () => {
        const text = await vscode.env.clipboard.readText();
        if (!text) return;

        const trimmed = text.trim();
        const isLines = trimmed.includes('\n');

        let newText;
        if (isLines) {
            newText = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0).join(' ');
        } else {
            newText = trimmed.split(/\s+/).join('\n');
        }

        if (vscode.window.activeTerminal) {
            vscode.window.activeTerminal.sendText(newText, false);
        }
    }));
}

function deactivate() {}

module.exports = { activate, deactivate }
