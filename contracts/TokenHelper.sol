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
        uint extra = _newSqFt.sub(oldSqFt);
        // todo distribute
    }

    modifier onlyMainOwnerOf(uint _propertyId) {
        require(msg.sender == property2MainOwner[_propertyId]);
        _;
    }
    //    function changeName(uint _propId, string _newName) external onlyMainOwnerOf(_propId) {
    //        props[_propId].name = _newName;
    //    }
    function changeDocsHash(uint _propId, string _newDocsHash) external onlyMainOwnerOf(_propId) {
        props[_propId].docsHash = _newDocsHash;
    }

    modifier onlyOwnerOf(uint _tokenId) {
        require(msg.sender == token2Owner[_tokenId]);
        _;
    }
    function setSellValPerSqFt(uint _tokenId, uint _newSellValPerSqFt) external onlyOwnerOf(_tokenId) {
        tokens[_tokenId].sellValPerSqFt = _newSellValPerSqFt;
    }

    function setRentValPerSqFtPerDay(uint _tokenId, uint _newRentValPerSqFtPerDay) external onlyOwnerOf(_tokenId) {
        tokens[_tokenId].rentValPerSqFtPerDay = _newRentValPerSqFtPerDay;
    }
}
