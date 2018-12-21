pragma solidity ^0.5.0;

import "./Safemath.sol";
import "./TokenFactory";

contract TokenRental{
  
  using SafeMath for uint256;

  event e_rental(uint propId,uint rentVal);
  
  function setRental(uint tokenId,uint rentVal) public {
    tokens[tokenId].rentVal = rentVal;
  }

  function getTokensByProp(uint propId) returns(uint[]){
    Tokens[] t;
    for (uint i=0;i<tokens.length;i++){
      if (tokens[i].propId == propId){
        t.push(i);
      }
    }
    return t;
  }

  function allotRental(uint propId) public {
    
    //Mapping Code
    var result = getTokensByProp(propId);

    mapping(address => uint) owner_list;
    var owners=[];
    var token_list=[];
    for (uint i = 0;i < result.length;i++)
    { var owner = token2owner[result[i]];
      if (owner_list[owner]){
        token_list.push(result[i]);
        owners.push(owner);
        owner_list[owner] = 0;
      }
      else{
        owner_list[owner] = owner_list[owner]+1;
      }
    }
    
    //Calc
    uint rental = 0;
    
    for (uint j = 0; j<owners.length; j++){
        rental.add(owners_list[owners[j]].length*token_list[j].rentVal);
    }

    rental = rental.div(owners.length);
    props[propId].rented = true;
    e_rental(propId,rental);

  }

}
