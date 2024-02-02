const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { log, error } = require("console");
const { task } = require("hardhat/config");
const { Utils } = require("./utils");

const { TASK_EXPORT_ABIS } = require("./tasks");

task(TASK_EXPORT_ABIS, "Exports the ABIs of the contracts")
    .addOptionalParam(
        "only",
        "A list of contract names, separated by comma. For example: --only ContractA,ContractB",
        undefined,
        types.string,
    )
    .setAction(async (taskArgs, { config }) => {
        const allContractFiles = fs
            .readdirSync(config.paths.sources, {
                withFileTypes: true,
                recursive: true,
            })
            .filter((x) => x.isFile() && path.extname(x.name) === ".sol")
            .map((x) => path.join(x.path, x.name));

        const onlyContracts =
            taskArgs.only !== undefined && taskArgs.only.length > 0
                ? taskArgs.only.split(",")
                : [];

        const filteredContractFiles =
            onlyContracts.length > 0
                ? allContractFiles.filter((file) =>
                      onlyContracts.includes(path.basename(file, ".sol")),
                  )
                : allContractFiles;

        if (filteredContractFiles.length === 0) {
            error(chalk.bold.red("No contracts found to export ABIs"));
            return;
        }

        await Utils.writeDataConcurrently(filteredContractFiles);
    });
