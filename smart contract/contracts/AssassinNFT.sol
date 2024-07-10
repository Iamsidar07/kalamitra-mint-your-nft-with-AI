// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AssassinNFT is
    ERC721,
    ERC721Enumerable,
    ERC721Pausable,
    Ownable,
    ERC721URIStorage
{
    event NftMinted(uint256 tokenId, address by);

    /*
     * @notice Public minting is not open
     */
    error PublicMintNotOpen();
    /*
     * @notice Allowlist minting is not open
     */
    error AllowListMintNotOpen();
    /*
     * @notice Not enough fund
     */
    error NotEnoughFund();
    /*
     * @notice You are not in allowlist
     */
    error NotInAllowList();

    uint256 private _nextTokenId;
    uint256 public publicMintNftPrice = 0.000000085 ether;
    uint256 public allowListMintNftPrice = 0.000000025 ether;

    bool public isPublicMintOpen = false;
    bool public isAllowListMintOpen = false;

    mapping(address => bool) public allowList;

    constructor(
        address[] memory _allowList
    ) ERC721("Assassin", "ASS") Ownable(msg.sender) {
        for (uint i; i < _allowList.length; i++) {
            allowList[_allowList[i]] = true;
        }
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function getCurrentTokenId() external view returns (uint256) {
        return _nextTokenId;
    }

    function editNftPrice(
        uint256 _publicMintNftPrice,
        uint256 _allowListMintNftPrice
    ) public onlyOwner {
        publicMintNftPrice = _publicMintNftPrice;
        allowListMintNftPrice = _allowListMintNftPrice;
    }

    function withdraw() public onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success, "Transfer failed.");
    }

    function editMintOpen(
        bool _isPublicMintOpen,
        bool _isAllowListMintOpen
    ) public onlyOwner {
        isPublicMintOpen = _isPublicMintOpen;
        isAllowListMintOpen = _isAllowListMintOpen;
    }

    function publicMint(address to, string memory uri) external payable {
        if (!isPublicMintOpen) {
            revert PublicMintNotOpen();
        }
        if (msg.value != publicMintNftPrice) {
            revert NotEnoughFund();
        }
        _mintingHelper(to, uri);
    }

    function allowListMint(address to, string memory uri) external payable {
        if (!isAllowListMintOpen) {
            revert AllowListMintNotOpen();
        }
        if (msg.value != allowListMintNftPrice) {
            revert NotEnoughFund();
        }
        if (!allowList[msg.sender]) {
            revert NotInAllowList();
        }
        _mintingHelper(to, uri);
    }

    function _mintingHelper(address to, string memory uri) private {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit NftMinted(tokenId, msg.sender);
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address to,
        uint256 tokenId,
        address auth
    )
        internal
        override(ERC721, ERC721Enumerable, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
