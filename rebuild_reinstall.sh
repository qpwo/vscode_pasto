#!/usr/bin/env bash
set -ex
npm install
rm -v *.vsix || true
# Skipping icon/gif generation as source files missing
convert pasto.png -resize 128x128 icon.png
./node_modules/.bin/vsce package
# Install if code is available (might fail in restricted envs)
code --install-extension *.vsix || echo "Install failed or code not found, manual install required."
