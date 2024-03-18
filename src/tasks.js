const {
    TASK_COMPILE,
    TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS,
} = require("hardhat/builtin-tasks/task-names");

const TASK_EXPORT_ABIS = "export-ABIs";
const TASK_EXPORT_JSON_INPUT = "export-json-input";

module.exports = {
    TASK_COMPILE,
    TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS,
    TASK_EXPORT_ABIS,
    TASK_EXPORT_JSON_INPUT
};
