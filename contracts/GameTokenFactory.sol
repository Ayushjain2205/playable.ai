// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./GameToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title GameTokenFactory
 * @dev Factory contract for creating GameToken contracts for each game
 */
contract GameTokenFactory is Ownable {
    using Strings for uint256;

    // Game token template
    GameToken public gameTokenTemplate;

    // Game tracking
    struct Game {
        uint256 gameId;
        string gameName;
        string gameSymbol;
        string gameDescription;
        string gameImageUri;
        address tokenAddress;
        address creator;
        uint256 createdAt;
        bool exists;
    }

    // Mapping from gameId to Game struct
    mapping(uint256 => Game) public games;

    // Mapping from token address to gameId
    mapping(address => uint256) public tokenToGameId;

    // Counter for game IDs
    uint256 public gameCounter;

    // Events
    event GameTokenDeployed(
        uint256 indexed gameId,
        string gameName,
        string gameSymbol,
        address tokenAddress,
        address creator,
        uint256 timestamp
    );

    event GameTokenTemplateUpdated(
        address indexed oldTemplate,
        address indexed newTemplate
    );

    constructor(address _owner) Ownable(_owner) {
        gameCounter = 0;
    }

    /**
     * @dev Set the game token template contract
     * @param _template Address of the GameToken template contract
     */
    function setGameTokenTemplate(address _template) external onlyOwner {
        require(
            _template != address(0),
            "GameTokenFactory: Invalid template address"
        );
        address oldTemplate = address(gameTokenTemplate);
        gameTokenTemplate = GameToken(_template);
        emit GameTokenTemplateUpdated(oldTemplate, _template);
    }

    /**
     * @dev Create a new game token
     * @param _gameName Name of the game
     * @param _gameSymbol Symbol for the token (3-5 characters)
     * @param _gameDescription Description of the game
     * @param _gameImageUri URI for the game image
     * @return gameId The ID of the created game
     * @return tokenAddress The address of the deployed token contract
     */
    function createGameToken(
        string memory _gameName,
        string memory _gameSymbol,
        string memory _gameDescription,
        string memory _gameImageUri
    ) external returns (uint256 gameId, address tokenAddress) {
        require(
            bytes(_gameName).length > 0,
            "GameTokenFactory: Game name cannot be empty"
        );
        require(
            bytes(_gameSymbol).length >= 3 && bytes(_gameSymbol).length <= 5,
            "GameTokenFactory: Symbol must be 3-5 characters"
        );
        require(
            address(gameTokenTemplate) != address(0),
            "GameTokenFactory: Template not set"
        );

        // Increment game counter
        gameId = ++gameCounter;

        // Create new game token using CREATE2 for deterministic addresses
        bytes32 salt = keccak256(
            abi.encodePacked(gameId, _gameName, _gameSymbol, msg.sender)
        );

        // Deploy the token contract
        GameToken newToken = new GameToken{salt: salt}(
            gameId,
            _gameName,
            _gameSymbol,
            _gameDescription,
            _gameImageUri,
            msg.sender
        );

        tokenAddress = address(newToken);

        // Store game information
        games[gameId] = Game({
            gameId: gameId,
            gameName: _gameName,
            gameSymbol: _gameSymbol,
            gameDescription: _gameDescription,
            gameImageUri: _gameImageUri,
            tokenAddress: tokenAddress,
            creator: msg.sender,
            createdAt: block.timestamp,
            exists: true
        });

        // Map token address to game ID
        tokenToGameId[tokenAddress] = gameId;

        emit GameTokenDeployed(
            gameId,
            _gameName,
            _gameSymbol,
            tokenAddress,
            msg.sender,
            block.timestamp
        );

        return (gameId, tokenAddress);
    }

    /**
     * @dev Get game information by game ID
     * @param _gameId The game ID
     * @return Game struct with all game information
     */
    function getGame(uint256 _gameId) external view returns (Game memory) {
        require(games[_gameId].exists, "GameTokenFactory: Game does not exist");
        return games[_gameId];
    }

    /**
     * @dev Get game information by token address
     * @param _tokenAddress The token contract address
     * @return Game struct with all game information
     */
    function getGameByToken(
        address _tokenAddress
    ) external view returns (Game memory) {
        uint256 gameId = tokenToGameId[_tokenAddress];
        require(gameId > 0, "GameTokenFactory: Token not found");
        require(games[gameId].exists, "GameTokenFactory: Game does not exist");
        return games[gameId];
    }

    /**
     * @dev Get all games created by a specific creator
     * @param _creator The creator address
     * @return gameIds Array of game IDs created by the creator
     */
    function getGamesByCreator(
        address _creator
    ) external view returns (uint256[] memory gameIds) {
        uint256 count = 0;

        // First pass: count games by creator
        for (uint256 i = 1; i <= gameCounter; i++) {
            if (games[i].exists && games[i].creator == _creator) {
                count++;
            }
        }

        // Second pass: collect game IDs
        gameIds = new uint256[](count);
        uint256 index = 0;

        for (uint256 i = 1; i <= gameCounter; i++) {
            if (games[i].exists && games[i].creator == _creator) {
                gameIds[index] = i;
                index++;
            }
        }

        return gameIds;
    }

    /**
     * @dev Get total number of games created
     * @return Total number of games
     */
    function getTotalGames() external view returns (uint256) {
        return gameCounter;
    }

    /**
     * @dev Check if a game exists
     * @param _gameId The game ID
     * @return True if game exists, false otherwise
     */
    function gameExists(uint256 _gameId) external view returns (bool) {
        return games[_gameId].exists;
    }

    /**
     * @dev Check if a token address is a valid game token
     * @param _tokenAddress The token address
     * @return True if valid game token, false otherwise
     */
    function isValidGameToken(
        address _tokenAddress
    ) external view returns (bool) {
        return tokenToGameId[_tokenAddress] > 0;
    }
}
