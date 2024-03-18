const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const { log, error } = require("console");

const ABI_OUTPUT_DIR = "./ABIs";
const ABI_OUTPUT_EXTENSION = "_ABI.json";
const BUILT_JSON_INPUT_OUTPUT_DIR = "./json-inputs";

async function prepareDataFile(dataRootPath, fileName, loadContent = false) {
    try {
        // Check if the directory exists
        fs.promises.mkdir(dataRootPath, { recursive: true });
    } catch (err) {
        console.error(err);
    }

    const dataFilePath = path.join(dataRootPath, fileName);
    const dataFileAbsPath = path.resolve(dataFilePath);

    // const fileExistsAsync = util.promisify(fs.existsSync);

    if (!fs.existsSync(dataFilePath)) {
        log(
            `${chalk.bold.blue(dataFilePath)} ${chalk.yellow("not found, creating file...")}`,
        );
        fs.promises.writeFile(dataFilePath, JSON.stringify({}));
    }

    if (loadContent) {
        let dataContent;
        try {
            dataContent = require(dataFileAbsPath);
        } catch (err) {
            // Handle the error
            log(
                chalk.bold.red(
                    `Error importing data from ${dataFilePath}: ${err.message}`,
                ),
            );
            // Initialize an empty object as data content
            dataContent = {};
        }
        // log("Path:", dataFilePath);
        // log("Data:", dataContent);

        return { dataFilePath, dataContent };
    } else {
        return { dataFilePath };
    }
}

async function writeDataFile(dataFilePath, dataContent) {
    try {
        await fs.promises.writeFile(
            dataFilePath,
            JSON.stringify(dataContent, null, "\t"),
        );
        log(
            chalk.bold.green(
                `Information has been written to ${chalk.bold.blue(dataFilePath)}!`,
            ),
        );
    } catch (err) {
        error(
            chalk.bold.red(
                `Error when trying to write to ${dataFilePath}: ${err}`,
            ),
        );
    }
}

async function writeDataSequentially(contractFiles) {
    for (const file of contractFiles) {
        await handleFile(file);
    }
}

async function writeDataConcurrently(contractFiles) {
    const promises = contractFiles.map(handleFile);
    await handlePromises(promises);
}

async function handleFile(file) {
    const contractName = path.basename(file, ".sol");
    try {
        const artifact = await artifacts.readArtifact(contractName);
        const filename = contractName + ABI_OUTPUT_EXTENSION;
        const { dataFilePath } = await prepareDataFile(
            ABI_OUTPUT_DIR,
            filename,
        );
        await writeDataFile(dataFilePath, artifact.abi);
    } catch (err) {
        error(
            chalk.bold.red(
                `Error exporting ABI for contract ${contractName}: ${err.message}`,
            ),
        );
        return null;
    }
}

async function handlePromises(promises) {
    const results = await Promise.allSettled(promises);

    // Handle results
    for (const result of results) {
        if (result.status === "rejected") {
            error(chalk.bold.red(`Failed promise: ${result.reason}`));
        }
    }
}

module.exports = {
    Utils: {
        prepareDataFile,
        writeDataFile,
        writeDataConcurrently,
        writeDataSequentially,
        ABI_OUTPUT_DIR,
        BUILT_JSON_INPUT_OUTPUT_DIR,
    },
    handleFile,
    handlePromises,
};
