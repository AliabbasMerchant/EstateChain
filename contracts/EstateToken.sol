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

    function ownerOf(uint256 _tokenId) external view returns (address) {
        return token2Owner[_tokenId];
    }

    function _transfer(address _from, address _to, uint256 _tokenId) private {
        token2Owner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) external payable {
        require (token2Owner[_tokenId] == msg.sender || tokenApprovals[_tokenId] == msg.sender);
        _transfer(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) external payable onlyOwnerOf(_tokenId) {
        tokenApprovals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }
}
