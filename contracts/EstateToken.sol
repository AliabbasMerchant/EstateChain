pragma solidity ^0.5.0;

import "./ERC721.sol";
import "./SafeMath.sol";
import "./TokenHelper.sol";

contract EstateToken is ERC721, TokenHelper {
    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    mapping (uint => address) tokenApprovals;

    function balanceOf(address _owner) external view returns (uint256) {
        uint count = 0;
        for (uint i = 0; i < tokens.length; i++) {
            if (token2Owner[i] == _owner) {
                count++;
            }
        }
        return count;
    }

    function ownerOf(uint _tokenId) external view returns (address) {
        return token2Owner[_tokenId];
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) external payable {
//        require (token2Owner[_tokenId] == msg.sender || tokenApprovals[_tokenId] == msg.sender);
//        _transfer(_from, _to, _tokenId);
        token2Owner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function buy(uint _tokenId) external payable {
        require(msg.sender != token2Owner[_tokenId] && tokens[_tokenId].sellValPerSqFt != 0);
        uint sellingPrice = tokens[_tokenId].sellValPerSqFt;
        require(msg.value == sellingPrice);
        token2Owner[_tokenId].transfer(sellingPrice);
        transferFrom(token2Owner[_tokenId], msg.sender, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) external payable onlyOwnerOf(_tokenId) {
        // not used, as all transactions are already approved
        tokenApprovals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }
}
