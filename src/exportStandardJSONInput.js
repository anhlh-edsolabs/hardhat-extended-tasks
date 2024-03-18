const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { log, error } = require("console");
const { task, types } = require("hardhat/config");
const { Utils } = require("./utils");

const { TASK_EXPORT_JSON_INPUT } = require("./tasks");

task(
    TASK_EXPORT_JSON_INPUT,
    "Exports the built JSON input for contract verification..."
)
    .addOptionalParam(
        "exportFile",
        "A JSON file that contains a list of contract names to be processed",
        undefined,
        types.inputFile
    )
    .setAction(async (taskArgs, { config }) => {
        if (taskArgs.exportFile === undefined) {
            const allBuildInfoFiles = fs
                .readdirSync(`${config.paths.artifacts}/build-info`, {
                    withFileTypes: true,
                    recursive: true,
                })
                .filter((x) => x.isFile() && path.extname(x.name) === ".json")
                .map((x) => path.join(x.path, x.name));

            if (allBuildInfoFiles.length === 0) {
                error(
                    chalk.bold.red("No build info found to export JSON input")
                );
                return;
            } else {
                for (const filePath of allBuildInfoFiles) {
                    await exportJsonInput(filePath);
                }
            }
        } else {
            await exportJsonInput(taskArgs.exportFile);
        }
    });

const exportJsonInput = async (filePath) => {
    const buildInfoData = JSON.parse(
        fs.readFileSync(path.resolve(filePath), {
            withFileTypes: true,
            recursive: true,
        })
    );

    const buildInfoInput = buildInfoData.input;

    const { mode, ...newOptimizer } = buildInfoInput.settings.optimizer;

    const newData = {
        ...buildInfoInput,
        settings: {
            ...buildInfoInput.settings,
            optimizer: {
                ...newOptimizer,
            },
        },
    };

    const buildInfoName = path.basename(filePath, ".json");

    const { dataFilePath } = await Utils.prepareDataFile(
        Utils.BUILT_JSON_INPUT_OUTPUT_DIR,
        `${buildInfoName}.json`
    );

    await Utils.writeDataFile(dataFilePath, newData);
};
