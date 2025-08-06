// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title GameToken
 * @dev ERC20 token for individual games with minting capabilities
 */
contract GameToken is ERC20, Ownable {
    using Strings for uint256;

    // Game metadata
    string public gameName;
    string public gameDescription;
    string public gameImageUri;
    uint256 public gameId;

    // Tokenomics
    uint256 public constant INITIAL_SUPPLY = 1000000 * 10 ** 18; // 1 million tokens
    uint256 public constant MAX_SUPPLY = 10000000 * 10 ** 18; // 10 million tokens max

    // Events
    event GameTokenCreated(
        uint256 indexed gameId,
        string gameName,
        string symbol,
        address tokenAddress,
        address creator
    );

    event TokensMinted(address indexed to, uint256 amount, string reason);
    event TokensBurned(address indexed from, uint256 amount, string reason);

    constructor(
        uint256 _gameId,
        string memory _gameName,
        string memory _symbol,
        string memory _gameDescription,
        string memory _gameImageUri,
        address _creator
    ) ERC20(_gameName, _symbol) Ownable(_creator) {
        gameId = _gameId;
        gameName = _gameName;
        gameDescription = _gameDescription;
        gameImageUri = _gameImageUri;

        // Mint initial supply to creator
        _mint(_creator, INITIAL_SUPPLY);

        emit GameTokenCreated(
            _gameId,
            _gameName,
            _symbol,
            address(this),
            _creator
        );
    }

    /**
     * @dev Mint tokens to a specific address (only owner)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     * @param reason Reason for minting (e.g., "game_reward", "achievement")
     */
    function mint(
        address to,
        uint256 amount,
        string memory reason
    ) external onlyOwner {
        require(
            totalSupply() + amount <= MAX_SUPPLY,
            "GameToken: Exceeds max supply"
        );
        _mint(to, amount);
        emit TokensMinted(to, amount, reason);
    }

    /**
     * @dev Burn tokens from a specific address (only owner)
     * @param from Address to burn tokens from
     * @param amount Amount of tokens to burn
     * @param reason Reason for burning (e.g., "penalty", "game_cost")
     */
    function burn(
        address from,
        uint256 amount,
        string memory reason
    ) external onlyOwner {
        _burn(from, amount);
        emit TokensBurned(from, amount, reason);
    }

    /**
     * @dev Get token metadata for the game
     */
    function getGameMetadata()
        external
        view
        returns (
            uint256 _gameId,
            string memory _gameName,
            string memory _gameDescription,
            string memory _gameImageUri,
            uint256 _totalSupply,
            uint256 _maxSupply
        )
    {
        return (
            gameId,
            gameName,
            gameDescription,
            gameImageUri,
            totalSupply(),
            MAX_SUPPLY
        );
    }

    /**
     * @dev Override decimals to use 18 decimals
     */
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
}
