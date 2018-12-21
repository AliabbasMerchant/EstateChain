pragma solidity ^0.4.23;

import "./SafeMath.sol";
import "./TokenHelper.sol";

contract TokenRental is TokenHelper {
    using SafeMath for uint256;

    event Rented(uint propId, uint rentVal, uint _days);

    function calcRentPerSqFtPerDay(uint _propId) public view returns(uint) {
        uint amount = 0;
        for (uint i = 0; i < noOfTokens; i++)
        {
            if (tokens[i].propId == _propId)
            {
                amount += tokens[i].rentValPerSqFtPerDay;
            }
        }
        amount = uint(amount.div(props[_propId].sqFt));
        return amount;
    }
    function Rent(uint _propId, uint _days) external payable {
        uint rentPerSqFtPerDay = calcRentPerSqFtPerDay(_propId);
        uint rent = rentPerSqFtPerDay.mul(_days).mul(props[_propId].sqFt);
        require(msg.value == rent);
        uint mainOwnerShare = rent.mul(mainOwnerSharePercentage).div(100);
        property2MainOwner[_propId].transfer(mainOwnerShare);
        rent = rent - mainOwnerShare;
//        uint uniqueOwners = 0;
//        mapping(address=>uint) addressToSqFT;
        // TODO some more efficient distribution mechanism
        for(uint i=0; i<noOfTokens;i++) {
            if(tokens[i].propId == _propId) {
                address owner = token2Owner[i];
                owner.transfer(rent.div(props[_propId].sqFt));
            }
        }
        props[_propId].rentedBy = msg.sender;
        props[_propId].rentedAtValue = rentPerSqFtPerDay;
        props[_propId].rentedUntil = now + _days.mul(86400);
        emit Rented(_propId, calcRentPerSqFtPerDay(_propId), _days);
    }
}
