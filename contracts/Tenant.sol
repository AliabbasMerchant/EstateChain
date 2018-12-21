pragma solidity ^0.5.0;

import "./SafeMath.sol";
import "./TokenFactory.sol";
import "./TokenHelper.sol";

contract Tenant is TokenFactory, SafeMath, TokenHelper{
  
    using SafeMath for uint256;
    uint rentalVal=0;

    function getRental(uint propId) public 
    {    
        rentalVal = props[propId].rented;
        uint ownerShare = mainOwnerSharePercentage(rentalVal,propId);
        rentalVal = rentalVal-ownerShare;
        rentalVal = rentalVal.div(props[propId].sqFt);
        
        //Mapping Code
        mapping(address => uint) owner_list;
        address owners = [];
        Token token_list = [];
        for (uint i = 0;i < result.length;i++)
        { 
            var owner = token2owner[result[i]];
            if (owner_list[owner])
            {
                token_list.push(result[i]);
                owners.push(owner);
                owner_list[owner] = 0;
            }
            else
            {
                owner_list[owner] = owner_list[owner]+1;
            }
        }

        //Rental Calc
        for (uint i = 0;i<owners.length;i++)
        {    
            uint share = owners_list[owners[i]];
            transferRent(owner[i],share);
        }
    }
    function transferRent(address to, uint value) public{
        balances[msg.sender] -= value;
        to.transfer(value);
    }
}