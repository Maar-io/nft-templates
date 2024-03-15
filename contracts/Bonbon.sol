// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Bonbon is ERC721A, ERC2981, AccessControl, Ownable {
    using Strings for uint256;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    string public baseContractURI;

    string public baseURI;

    string public baseExtension;

    uint256 public maxSupply;

    // uint256 public cost;

    bool public locked;

    bool public paused;

    uint256 public mintLimit;

    //@notice constructor
    constructor(
        string memory name,
        string memory symbol,       // uint256 initCost,
        uint256 initMaxSupply
    ) ERC721A(name, symbol) Ownable(msg.sender)
    {
        // cost = initCost;
        maxSupply = initMaxSupply;
        locked = false;
        paused = false;
        baseContractURI = "";
        baseURI = "";
        baseExtension = ".json";
        mintLimit = 0;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _setDefaultRoyalty(msg.sender, 1000);
    }

    //@notice contractURI
    function contractURI() public view returns (string memory) {
        return baseContractURI;
    }

    //@notice tokenURI override
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721A)
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "Non Exist token"
        );

        return bytes(baseURI).length > 0
                ? string(
                    abi.encodePacked(
                        baseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    //@notice mint function
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(!paused,"Paused");
        if (maxSupply > 0){
            require(totalSupply() + amount <= maxSupply, "Max Supply");
        }
                if (mintLimit != 0) {
            require(balanceOf(to) < mintLimit, "ALREADY MINTED MAX NFTS");
        }
        // require(msg.value >= cost * amount, "Not Enough Value");

        //interact
        _mint(to, amount);
    }

    //@notice set limit amount per wallet
    function setMintLimit(uint256 _newMintLimit) public onlyRole(DEFAULT_ADMIN_ROLE) {
        mintLimit = _newMintLimit;
    }

    //@notice to contractUri
    function setContractURI(string memory _newBaseContractURI) public onlyRole(DEFAULT_ADMIN_ROLE) {
        baseContractURI = _newBaseContractURI;
    }

    //@notice to tokenUri
    function setBaseURI(string memory _newBaseURI) public onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = _newBaseURI;
    }

    //@notice to tokenUri
    function setBaseExtension(string memory _newBaseExtension) public onlyRole(DEFAULT_ADMIN_ROLE) {
        baseExtension = _newBaseExtension;
    }

    //@notice maxSupply
    function setMaxSupply(uint256 _newMaxSupply) public onlyRole(DEFAULT_ADMIN_ROLE) {
        maxSupply = _newMaxSupply;
    }

    //@notice cost
    // function setCost(uint256 _newCost) public onlyRole(DEFAULT_ADMIN_ROLE) {
    //     cost = _newCost;
    // }

    //@notice paused
    function setPaused(bool _newPaused) public onlyRole(DEFAULT_ADMIN_ROLE) {
        paused = _newPaused;
    }

    //@notice locked
    function setLocked(bool _newLocked) public onlyRole(DEFAULT_ADMIN_ROLE) {
        locked = _newLocked;
    }


    //@notice set Royality
    function setDefaultRoyalty(
        address _receiver,
        uint96 _feeNumerator
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setDefaultRoyalty(_receiver, _feeNumerator);
    }

    //@notice locked
    function _beforeTokenTransfers(
        address from,
        address,
        uint256,
        uint256
    ) internal virtual override {
        if (locked) {
            require(
                from == address(0),
                "BaseERC721: Transfers are disabled when Locked is true"
            );
        }
    }

    //@notice ERC2981 override
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721A, ERC2981, AccessControl)
        returns (bool)
    {
        return
            ERC721A.supportsInterface(interfaceId) ||
            ERC2981.supportsInterface(interfaceId) ||
            AccessControl.supportsInterface(interfaceId);
    }

    //@notice ERC721A override
    function _startTokenId() internal pure override returns (uint256) {
        return 1;
    }

    //@notice withdraw function
    function withdraw() public onlyRole(DEFAULT_ADMIN_ROLE) {
        payable(msg.sender).transfer(address(this).balance);
    }
}