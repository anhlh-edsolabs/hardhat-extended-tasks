const { getOnlyContracts } = require("./helpers");

describe('getOnlyContracts', () => {
    test('should return an array of contract names when taskArgs.only is defined and not empty', () => {
        const taskArgs = { only: 'ContractA,ContractB' };
        const result = getOnlyContracts(taskArgs);
        expect(result).toEqual(['ContractA', 'ContractB']);
    });

    test('should return an empty array when taskArgs.only is undefined', () => {
        const taskArgs = {};
        const result = getOnlyContracts(taskArgs);
        expect(result).toEqual([]);
    });

    test('should return an empty array when taskArgs.only is an empty string', () => {
        const taskArgs = { only: '' };
        const result = getOnlyContracts(taskArgs);
        expect(result).toEqual([]);
    });
});