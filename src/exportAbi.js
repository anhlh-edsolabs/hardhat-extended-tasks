const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { log, error } = require("console");
const { task, types } = require("hardhat/config");
const {
    parseName,
    isFullyQualifiedName,
    parseFullyQualifiedName,
} = require("hardhat/utils/contract-names");
const { Utils } = require("./utils");

const { TASK_EXPORT_ABIS } = require("./tasks");

task(TASK_EXPORT_ABIS, "Exports the ABIs of the contracts")
    .addOptionalParam(
        "only",
        "A list of contract names, separated by comma. For example: --only ContractA,ContractB",
        undefined,
        types.string,
    )
    .addOptionalParam(
        "contractList",
        "A JSON file that contains a list of contract names to be processed",
        undefined,
        types.inputFile,
    )
    .setAction(async (taskArgs, { config }) => {
        const allContractFiles = fs
            .readdirSync(config.paths.sources, {
                withFileTypes: true,
                recursive: true,
            })
            .filter((x) => x.isFile() && path.extname(x.name) === ".sol")
            .map((x) => path.join(x.path, x.name));

        let onlyContracts =
            taskArgs.only !== undefined && taskArgs.only.length > 0
                ? taskArgs.only.split(",")
                : [];

        // If a JSON file is provided, read the contract names from the file
        if (taskArgs.contractList) {
            try {
                const contractsFromFile = JSON.parse(
                    fs.readFileSync(taskArgs.contractList, "utf8"),
                );
                onlyContracts = [...onlyContracts, ...contractsFromFile];
            } catch (err) {
                error(
                    chalk.bold.red(
                        `Error reading contracts from JSON file: ${err.message}`,
                    ),
                );
                return;
            }
        }

        // extract contract name from the allContractFiles array
        const allContractNames = allContractFiles.map((file) => {
            return path.basename(file, ".sol");
        })

        const filteredContractNames = onlyContracts.length > 0 ? onlyContracts : allContractNames

        if (filteredContractNames.length === 0) {
            error(chalk.bold.red("No contracts found to export ABIs"));
            return;
        }

        await Utils.writeDataConcurrently(filteredContractNames);
    });
