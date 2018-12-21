pragma solidity ^0.5.0;

import "./Ownable.sol";
import "./Safemath.sol";

contract TokenFactory is Ownable {

  uint tokenId=0;
  uint propId=0;

  struct Token {
    address owner;
    uint tokenId;
    uint rentVal;
    uint sellVal;
    uint propId;
  }

  struct Property{
    address mainOwner;
    uint sq_ft;
    bool rented;
    uint propId; 
  }
  event newProp(Property p,uint token_no);

  Token[] tokens=[];
  Property[] props=[];
  
  mapping(uint => address) token2Owner;

  function _newProperty(address MainOwner, uint _sq_ft,uint sellVal, bool rented) public {
    uint i = 0;
    for (i = 0; i < _sq_ft; i++) {
      tokens.push(Token(mainowner,tokenId,0,sellVal,propId));
      tokenId = tokenId+1;
      
    }
    var p = Property(mainowner,_sq_ft,propId,rented);
    props.push(p);
    propId = propId+1;
    newProp(p, _sq_ft);
  }
}