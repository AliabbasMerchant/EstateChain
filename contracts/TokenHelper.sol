pragma solidity ^0.5.0;

import "./TokenFactory.sol";

contract TokenHelper is TokenFactory {
    uint mainOwnerSharePercentage = 10;
    function setMainOwnerSharePercentage(uint _percentage) external onlyOwner {
        mainOwnerSharePercentage = _percentage;
    }
    function increaseArea(uint _propId, uint _newSqFt) external onlyOwner {
        uint memory oldSqFt = props[_propId].sqFt;
        require(_newSqFt > oldSqFt);
        props[_propId].sqFt = _newSqFt;
        uint memory extra = _newSqFt.sub(oldSqFt);
        for(uint i=0;i<extra; i++) {
            // todo distribute
        }
    }

    modifier onlyMainOwnerOf(uint _propertyId) {
        require(msg.sender == property2MainOwner[_propertyId]);
        _;
    }
    function changeName(uint _propId, string _newName) external onlyMainOwnerOf(_propId) {
        props[_propId].name = _newName;
    }
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
