# Pasto

Pasto provides smart pasting commands for VS Code.

![screencap](https://raw.githubusercontent.com/qpwo/vscode_pasto/main/pasto.gif)

## Features

### Paste Lines No Blanks (`Ctrl+Shift+V`)
Pastes content from clipboard, removing any blank lines, and replacing the selected text. Works in editors and terminals.

### Paste Pivot (`Ctrl+Cmd+V` on Mac, `Ctrl+Alt+V` on Win/Linux)
Pastes content in the "opposite" format. Works in editors and terminals:
- If clipboard contains multiple lines: Joins them into a single line (space-separated) and pastes at cursor.
- If clipboard contains words (single line): Splits them into multiple lines and pastes on the line *below* the cursor (or directly into the terminal).

## Usage

1. Copy text.
2. Use keybindings or Command Palette ("Pasto: ...").
