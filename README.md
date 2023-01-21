# exdump

A CLI to create a nice markdown table of your VS Code extensions. Handy for dotfiles repos.

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