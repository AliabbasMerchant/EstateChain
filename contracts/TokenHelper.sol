pragma solidity ^0.4.23;

import "./TokenFactory.sol";
import "./SafeMath.sol";

contract TokenHelper is TokenFactory {
    using SafeMath for uint256;
    uint public mainOwnerSharePercentage = 10;
    uint public propertyTaxPercentage = 5;

    function setMainOwnerSharePercentage(uint _percentage) external onlyOwner {
        mainOwnerSharePercentage = _percentage;
    }

    function setPropertyTaxPercentage(uint _percentage) external onlyOwner {
        propertyTaxPercentage = _percentage;
    }

    function increaseArea(uint _propId, uint _newSqFt) external onlyOwner {
        uint oldSqFt = props[_propId].sqFt;
        require(_newSqFt > oldSqFt);
        props[_propId].sqFt = _newSqFt;
//        uint extra = _newSqFt.sub(oldSqFt);
        // todo distribute
    }

    modifier onlyMainOwnerOf(uint _propertyId) {
        require(msg.sender == property2MainOwner[_propertyId], "Can only be executed by the main owner");
        _;
    }
    //    function changeName(uint _propId, string _newName) external onlyMainOwnerOf(_propId) {
    //        props[_propId].name = _newName;
    //    }
    function changeDocsHash(uint _propId, string _newDocsHash) external onlyMainOwnerOf(_propId) {
        props[_propId].docsHash = _newDocsHash;
    }
    function changeMainOwner(uint _propId, address _newOwner) external onlyMainOwnerOf(_propId) {
        property2MainOwner[_propId] = _newOwner;
    }

    modifier onlyOwnerOf(uint _tokenId) {
        require(msg.sender == token2Owner[_tokenId], "Can only be executed by the owner");
        _;
    }
    function setValues(uint _tokenId, uint _newSellValPerSqFt, uint _newRentValPerSqFtPerDay) external onlyOwnerOf(_tokenId) {
        tokens[_tokenId].sellValPerSqFt = _newSellValPerSqFt;
        tokens[_tokenId].rentValPerSqFtPerDay = _newRentValPerSqFtPerDay;
    }
}
