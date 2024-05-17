// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract PBADAO is
    ERC1155,
    ERC1155Supply,
    ERC1155Burnable,
    ERC1155URIStorage,
    Ownable,
    AccessControl
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    string public name;
    string public symbol;
    uint256 public price = 0.0008 ether;
    string public baseURI;
    string public baseExtension;

    uint256 public constant MAX_SUPPLY = 8888;

    constructor()
        ERC1155("")
        Ownable(msg.sender)
    {
        _grantRole(MINTER_ROLE, 0xCB1095416b6A8e0C3ea39F8fe6Df84f4179C93C2);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        baseURI = "ipfs://QmVvj73kum2jZMTrAZbFyYa6n4egYexK4bXhdTbCgG5Bbz/";
        baseExtension = ".json";
        name = "PBADAO GACHA COLLECTION x ASTAR";
        symbol = "GACHA";
    }

    function mint(
        address to_,
        uint256 amount_
    ) external payable onlyRole(MINTER_ROLE) {
        require(totalSupply() + amount_ <= MAX_SUPPLY, "Exceeds total supply");
        require(msg.value == price * amount_, "Invalid price");

        uint256 currentTokenId = (totalSupply() % 6) + 1; // Start from the next token ID in the sequence
        _mint(to_, currentTokenId, amount_, "0x00"); // Use _mintBatch to mint different token IDs
    }

    function uri(uint256 tokenId) public view override(ERC1155, ERC1155URIStorage) returns (string memory) {
        require((tokenId > 0 && tokenId < 7), "Non Exist token");

        return
            bytes(baseURI).length > 0
                ? string(
                    abi.encodePacked(
                        baseURI,
                        Strings.toString(tokenId),
                        baseExtension
                    )
                )
                : "";
    }

    /**
     * @dev Set a new URI for all token types, by relying on the
     * token type ID substitution mechanism
     */
    function setURI(string memory newuri) public onlyRole(ADMIN_ROLE) {
        baseURI = newuri;
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool transferTx, ) = msg.sender.call{value: balance}("");
        require(transferTx, "Transfer failed.");
    }

    // The following functions are overrides required by Solidity.
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal virtual override(ERC1155, ERC1155Supply) {
        super._update(from, to, ids, values);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
