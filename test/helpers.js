const fs = require("fs");
const path = require("path");

function getOnlyContracts(taskArgs) {
    return taskArgs.only !== undefined && taskArgs.only.length > 0
        ? taskArgs.only.split(",")
        : [];
}

function getAllContractFiles(sourcePath) {
    return fs
        .readdirSync(sourcePath, {
            withFileTypes: true,
            recursive: true,
        })
        .filter((x) => x.isFile() && path.extname(x.name) === ".sol")
        .map((x) => path.join(x.path, x.name));
}

module.exports = { getOnlyContracts, getAllContractFiles };
