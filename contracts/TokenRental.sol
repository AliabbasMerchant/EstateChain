pragma solidity ^0.4.23;

import "./SafeMath.sol";
import "./Tenant.sol";

contract TokenRental is Tenant {
    using SafeMath for uint256;

    event e_rental(uint propId, uint rentVal);

    function getTokensByProp(uint propId) public returns (uint[]){
        Token[] memory t;
        for (uint i = 0; i < tokens.length; i++)
        {
            if (tokens[i].propId == propId)
            {
                t.push(i);
            }
        }
        return t;
    }

    function allotRental(uint propId) public {
        //Mapping Code
        uint[] result = getTokensByProp(propId);

        mapping(address => uint) owner_list;
        address[] owners;
        Token[] token_list;
        for (uint i = 0; i < result.length; i++)
        {
            address  owner = token2owner[result[i]];
            if (owner_list[owner])
            {
                token_list.push(result[i]);
                owners.push(owner);
                owner_list[owner] = 0;
            }
            else {
                owner_list[owner] = owner_list[owner] + 1;
            }
        }

        //Calc
        uint rental = 0;

        for (uint j = 0; j < owners.length; j++) {
            rental.add(owners_list[owners[j]].length * token_list[j].rentVal);
        }

        rental = rental.div(owners.length);
        props[propId].rented = rental;
        e_rental(propId, rental);

    }

}
