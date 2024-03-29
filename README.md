# Hardhat Extended Tasks

## Package name

**`hardhat-extended-tasks`**

## Introduction

[![npm version](https://badge.fury.io/js/hardhat-extended-tasks.svg)](https://badge.fury.io/js/hardhat-extended-tasks)

The **`hardhat-extended-tasks`** npm package is a plugin for the Hardhat development environment that provides additional features and enhancements to streamline your Ethereum smart contract development process. This plugin expands the capabilities of Hardhat by introducing a new optional parameter for contract compilation, a custom task for exporting contract ABIs, and a task for exporting the Standard JSON input from contracts `build-info` JSON files.

## Features

- **Selective Contract Compilation**: With the hardhat-extended-tasks plugin, you can instruct Hardhat to compile only the selected contracts, saving time and resources during development and testing.
- **Contract ABI Export**: This plugin introduces a new task that allows you to export the ABIs (Application Binary Interfaces) of your contracts. You can choose to export all contract ABIs or selectively export specific contract ABIs based on your requirements.
- **Contract Standard JSON Input Export**: The plugin now includes functionality to export the Standard JSON input from `build-info` JSON files, which is needed for contract verification on Blockscout or other Block explorer.

## Installation

To install the hardhat-extended-tasks plugin, simply run the following command:

```shell
npm install --save-dev hardhat-extended-tasks
```

or

```shell
yarn add -D hardhat-extended-tasks
```

## Usage

Once installed, you can enable the **`hardhat-extended-tasks`** plugin by adding it to your `hardhat.config.js` file.

```Javascript
// hardhat.config.js
require('hardhat-extended-tasks');
```

After enabling the plugin, you can take advantage of the additional features it provides within your Hardhat development environment.

## Selective Contract Compilation

The **`hardhat-extended-tasks`** plugin introduces a new optional parameter that allows you to specify the contracts you want to compile during the compilation process. This feature helps to optimize the compilation time, especially when working with large codebases.

To compile only selected contracts, use the `--only` flag followed by a comma-separated list of contract names.

```shell
npx hardhat compile --only Contract1,Contract2
```

## Contract ABI Export

The plugin also adds a custom task that enables you to export the ABIs of your contracts. This can be useful when interacting with contracts in external applications or when sharing contract ABIs with other developers.

To export the ABIs of all contracts, run the following command:

```shell
npx hardhat export-ABIs
```

If you only want to export the ABIs of specific contracts, use the `--only` flag followed by a comma-separated list of contract names.

```shell
npx hardhat export-ABIs --only Contract1,Contract2
```

The task also accepts a `JSON` file containing a list of contracts to be processed. You can use the `--contract-list` parameter followed by the path to the JSON file.

```shell
npx hardhat export-ABIs --contract-list contractList.json
```

The `contractList.json` file should contain an array of contract names.

```json
[
  "Contract1",
  "Contract2",
  "Contract3",
  "Contract4",
  "Contract5",
]
```

## Export Standard JSON Input

To export the Standard JSON input from build info JSON files, use the **`export-json-input`** command. By default, it will process all build info files in the `build-info` folder and write the output to the `json-inputs` folder.

```shell
npx hardhat export-json-input
```

If you only want to process a specific file, you can provide the `export-file` parameter followed by the path to the file being processed.

```shell
npx hardhat export-json-input --export-file ./artifacts/build-info/...fbf5031228457aa...e21578.json
```

Please note that the build info JSON file should be located in the `build-info` folder.

## License

This plugin is released under the MIT License.
