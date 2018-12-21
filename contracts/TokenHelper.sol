pragma solidity ^0.5.0;

contract TokenHelper is TokenFactory {
    function getTokensByOwner(address _owner) view returns(uint[]) {
        // Returns indices
        uint counter = 0;
        for (uint i = 0; i < tokens.length; i++) {
            if (token2Owner[i] == _owner) {
                counter++;
            }
        }
        uint[] memory result = new uint[](counter);
        counter = 0;
        for (uint i = 0; i < tokens.length; i++) {
            if (token2Owner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }
}
