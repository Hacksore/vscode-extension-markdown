# exdump

A CLI to create a nice markdown table of your VS Code extensions. Handy for dotfiles repos.

[![build](https://img.shields.io/github/actions/workflow/status/Hacksore/vscode-extension-markdown/ci.yaml?branch=master)](https://github.com/Hacksore/vscode-extension-markdown/actions)
[![npm](https://img.shields.io/npm/v/exdump)](https://www.npmjs.com/package/exdump)

### Usage
```sh
# will copy the markdown to your clipboard
npx exdump

# will create a file with that data instead
npx exdump --file out.md
```

## Development
```sh
# install deps
yarn

# run the code
yarn dev -f EXAMPLE.md
```

### Example
See the [example](./EXAMPLE.md) for to see what this CLI will generate.