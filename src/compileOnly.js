const { task, subtask, types } = require("hardhat/config");
const path = require("path");

const {
    TASK_COMPILE,
    TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS,
} = require("./tasks");

// Override the TASK_COMPILE task to add an optional parameter 'only'
task(TASK_COMPILE, "Compiles the entire project, building all artifacts")
    .addOptionalParam(
        "only",
        "A list of contract names, separated by comma. For example: --only ContractA,ContractB",
        undefined,
        types.string
    )
    .setAction(async (taskArgs, { config }, runSuper) => {
        const onlyContracts =
            taskArgs.only !== undefined && taskArgs.only.length > 0
                ? taskArgs.only.split(",")
                : [];
        config.only = onlyContracts;
        await runSuper(taskArgs);
    });

// Override the TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS subtask to filter the source paths
subtask(
    TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS,
    async (_, { config }, runSuper) => {
        const paths = await runSuper();
        return paths.filter((solidityFilePath) => {
            const contractName = path.basename(solidityFilePath, ".sol");
            return (
                config.only.length === 0 || config.only.includes(contractName)
            );
        });
    }
);
