pragma solidity ^0.4.23;

import "./Ownable.sol";
import "./SafeMath.sol";

contract TokenFactory is Ownable {
    using SafeMath for uint256;

    event NewProperty(string name, address mainOwner, uint sqFt, uint propId);

    struct Token {
        uint propId;
        uint boughtAtValuePerSqFt;
        uint sellValPerSqFt; // 0 implies not to sell
        uint rentValPerSqFtPerDay; // 0 implies not set
    }

    struct Property {
        string name;
        uint sqFt;
        uint rentedAtValue; // 0 implies not rented
        address rentedBy;
        uint rentedUntil;
        string docsHash; // on IPFS
    }

    uint public noOfTokens = 0;
    Token[] public tokens;
    Property[] public props;
    mapping(uint => address) public token2Owner;
    mapping(uint => address) public property2MainOwner;

    function newProperty(string _name, address _main_owner, uint _sqFt, uint _boughtAtValuePerSqFt, uint _sellValPerSqFt, uint _rentValPerSqFtPerDay) public onlyOwner
    {
        uint propId = props.push(Property(_name, _sqFt, 0, address(0), 0, "")) - 1;
        property2MainOwner[propId] = _main_owner;
        emit NewProperty(_name, _main_owner, _sqFt, propId);
        for (uint i = 0; i < _sqFt; i++) {
            uint id = tokens.push(Token(propId, _boughtAtValuePerSqFt, _sellValPerSqFt, _rentValPerSqFtPerDay)) - 1;
            noOfTokens++;
            token2Owner[id] = _main_owner;
        }
    }
}
