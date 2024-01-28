# Adobe Project Franklin Demo

Adobe Project Franklin demo showcase

## Environments

- Preview: https://main--{repo}--{owner}.hlx.page/
- Live: https://main--{repo}--{owner}.hlx.live/

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

- Start AEM Proxy (standalone): `aem up` or `npm run aem:up` (opens your browser at `http://localhost:3000`)
- Start AEM Proxy (with Tailwind styles livereload): `npm run aem` (opens your browser at `http://localhost:3000`)
- Compile Tailwind styles: `npm run tw:compile`

## Add dependencies

1. Node modules: add items for the dependencies to the `copyDependencies` array in the `package.json` file
1. External dependencies (from URLs): add items to the `externalDependencies` array in the `package.json` file
1. Run the update dependencies command

## Dependencies update

### Windows

```sh
npm run win:deps:update
```

### Linux

```sh
npm run linux:deps:update
```

## Preact bundle update

1. Rebuild the [Standalone Preact](https://standalonepreact.satge.net/) including all the imports.
1. Copy or download the new bundle and replace the content of the `preact.js` file in the `scripts` folder.
