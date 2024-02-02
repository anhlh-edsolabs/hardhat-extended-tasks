const mock = require('mock-fs');
const { getAllContractFiles } = require('./helpers');

describe('getAllContractFiles', () => {
    beforeEach(() => {
        mock({
            'contracts': {
                'ContractA.sol': '',
                'ContractB.sol': '',
                'NotASolidityFile.txt': '',
                'nested': {
                    'ContractC.sol': '',
                },
            },
            'contracts/nested/nested2': {
                'ContractD.sol': '',
            }
        });
    });

    afterEach(() => {
        mock.restore();
    });

    test('should return an array of .sol files in the source directory', () => {
        const sourcePath = 'contracts';
        const result = getAllContractFiles(sourcePath);
        expect(result).toEqual([
            'contracts/ContractA.sol',
            'contracts/ContractB.sol',
            'contracts/nested/ContractC.sol',
            'contracts/nested/nested2/ContractD.sol',
        ]);
    });
});