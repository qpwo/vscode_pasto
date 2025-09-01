## How to use this template

```
# find all todo:
cat extension.js package.json README.md rebuild_reinstall.sh | grep -i todo
# download vscode declarations -- optional
curl -L 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.d.ts' -o vscode.d.ts
# rebuild/package extension
bash rebuild_reinstall.sh
# publish extension:
https://marketplace.visualstudio.com/manage/
```

1.  Globally replace all `todo` placeholders in `package.json`, `README.md`, and `extension.js`.
2.  Replace `icon_orig.png` with your own icon (128x128 minimum).
3.  Create a `screencap.mp4` to demo your extension.
4.  Write your extension logic in `extension.js`.
5.  Run `npm install`.
6.  Run `./rebuild_reinstall.sh` to build, generate assets, and install locally.

---

# TODO_extension_display_name

TODO_description

![screencap](https://raw.githubusercontent.com/TODO_username/TODO_repo_name/main/screencap.gif)

## Usage

1. ctrl-shift-p
2. "TODO_command_title"
3. enter regex (last input is preserved)
4. search results open up in new tab, looks like this:

```
term1_term1name: the result
term1_term1name: the result here
term2_term2name: the result again
term2_term2name: the result is here
...
```

[extension](https://marketplace.visualstudio.com/items?itemName=TODO_username.TODO_extension_id)

[repo](https://github.com/TODO_username/TODO_repo_name)
