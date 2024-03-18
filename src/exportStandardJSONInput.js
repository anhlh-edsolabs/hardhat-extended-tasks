const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { log, error } = require("console");
const { task, types } = require("hardhat/config");
const { Utils } = require("./utils");

const { TASK_EXPORT_JSON_INPUT } = require("./tasks");

task(
    TASK_EXPORT_JSON_INPUT,
    "Exports the built JSON input for contract verification...",
)
    .addOptionalParam(
        "exportFile",
        "A JSON file that contains a list of contract names to be processed",
        undefined,
        types.inputFile,
    )
    .setAction(async (taskArgs, { config }) => {
        const filePath = taskArgs.exportFile;

        const buildInfo = fs.readdirSync(filePath, {
            withFileTypes: true,
            recursive: true,
        });

        const buildInfoInput = buildInfo.input;
        const { mode, ...newOptimizer } = buildInfoInput.settings.optimizer;

        const newData = {
            ...buildInfoInput,
            settings: {
                optimizer: {
                    ...newOptimizer,
                },
            },
        };

        const buildInfoName = path.basename(filePath, ".json");

        const { dataFilePath } = await Utils.prepareDataFile(
            Utils.BUILT_JSON_INPUT_OUTPUT_DIR,
            buildInfoName,
        );

        await Utils.writeDataFile(dataFilePath, newData);
    });
