const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GameTokenFactory", function () {
  let gameTokenFactory;
  let gameTokenTemplate;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy GameToken template
    const GameToken = await ethers.getContractFactory("GameToken");
    gameTokenTemplate = await GameToken.deploy(
      0, // gameId
      "Template Game",
      "TEMP",
      "Template game description",
      "https://example.com/template.png",
      owner.address,
    );

    // Deploy GameTokenFactory
    const GameTokenFactory =
      await ethers.getContractFactory("GameTokenFactory");
    gameTokenFactory = await GameTokenFactory.deploy(owner.address);

    // Set template in factory
    await gameTokenFactory.setGameTokenTemplate(
      await gameTokenTemplate.getAddress(),
    );
  });

  describe("Deployment", function () {
    it("Should deploy with correct owner", async function () {
      expect(await gameTokenFactory.owner()).to.equal(owner.address);
    });

    it("Should set template correctly", async function () {
      expect(await gameTokenFactory.gameTokenTemplate()).to.equal(
        await gameTokenTemplate.getAddress(),
      );
    });

    it("Should start with 0 games", async function () {
      expect(await gameTokenFactory.getTotalGames()).to.equal(0);
    });
  });

  describe("Game Token Creation", function () {
    it("Should create a new game token", async function () {
      const gameName = "Test Game";
      const gameSymbol = "TEST";
      const gameDescription = "A test game";
      const gameImageUri = "https://example.com/test.png";

      const tx = await gameTokenFactory
        .connect(user1)
        .createGameToken(gameName, gameSymbol, gameDescription, gameImageUri);

      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "GameTokenDeployed",
      );

      expect(event).to.not.be.undefined;
      expect(event.args.gameId).to.equal(1);
      expect(event.args.gameName).to.equal(gameName);
      expect(event.args.gameSymbol).to.equal(gameSymbol);
      expect(event.args.creator).to.equal(user1.address);

      // Check game counter
      expect(await gameTokenFactory.getTotalGames()).to.equal(1);
    });

    it("Should store game information correctly", async function () {
      const gameName = "Test Game";
      const gameSymbol = "TEST";
      const gameDescription = "A test game";
      const gameImageUri = "https://example.com/test.png";

      await gameTokenFactory
        .connect(user1)
        .createGameToken(gameName, gameSymbol, gameDescription, gameImageUri);

      const game = await gameTokenFactory.getGame(1);
      expect(game.gameId).to.equal(1);
      expect(game.gameName).to.equal(gameName);
      expect(game.gameSymbol).to.equal(gameSymbol);
      expect(game.gameDescription).to.equal(gameDescription);
      expect(game.gameImageUri).to.equal(gameImageUri);
      expect(game.creator).to.equal(user1.address);
      expect(game.exists).to.be.true;
    });

    it("Should fail with empty game name", async function () {
      await expect(
        gameTokenFactory
          .connect(user1)
          .createGameToken(
            "",
            "TEST",
            "A test game",
            "https://example.com/test.png",
          ),
      ).to.be.revertedWith("GameTokenFactory: Game name cannot be empty");
    });

    it("Should fail with invalid symbol length", async function () {
      await expect(
        gameTokenFactory.connect(user1).createGameToken(
          "Test Game",
          "TE", // Too short
          "A test game",
          "https://example.com/test.png",
        ),
      ).to.be.revertedWith("GameTokenFactory: Symbol must be 3-5 characters");

      await expect(
        gameTokenFactory.connect(user1).createGameToken(
          "Test Game",
          "TESTING", // Too long
          "A test game",
          "https://example.com/test.png",
        ),
      ).to.be.revertedWith("GameTokenFactory: Symbol must be 3-5 characters");
    });
  });

  describe("Game Token Functionality", function () {
    let gameToken;
    let gameId;

    beforeEach(async function () {
      const tx = await gameTokenFactory
        .connect(user1)
        .createGameToken(
          "Test Game",
          "TEST",
          "A test game",
          "https://example.com/test.png",
        );

      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "GameTokenDeployed",
      );

      gameId = event.args.gameId;
      const tokenAddress = event.args.tokenAddress;

      gameToken = await ethers.getContractAt("GameToken", tokenAddress);
    });

    it("Should have correct initial supply", async function () {
      const initialSupply = ethers.parseEther("1000000"); // 1 million tokens
      expect(await gameToken.totalSupply()).to.equal(initialSupply);
      expect(await gameToken.balanceOf(user1.address)).to.equal(initialSupply);
    });

    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      const reason = "game_reward";

      await gameToken.connect(user1).mint(user2.address, mintAmount, reason);

      expect(await gameToken.balanceOf(user2.address)).to.equal(mintAmount);
    });

    it("Should allow owner to burn tokens", async function () {
      const burnAmount = ethers.parseEther("1000");
      const reason = "penalty";

      // First mint some tokens to user2
      await gameToken
        .connect(user1)
        .mint(user2.address, burnAmount, "initial_mint");

      // Then burn them
      await gameToken.connect(user1).burn(user2.address, burnAmount, reason);

      expect(await gameToken.balanceOf(user2.address)).to.equal(0);
    });

    it("Should not allow non-owner to mint", async function () {
      const mintAmount = ethers.parseEther("1000");

      await expect(
        gameToken.connect(user2).mint(user2.address, mintAmount, "test"),
      ).to.be.revertedWithCustomError(gameToken, "OwnableUnauthorizedAccount");
    });

    it("Should not allow non-owner to burn", async function () {
      const burnAmount = ethers.parseEther("1000");

      await expect(
        gameToken.connect(user2).burn(user1.address, burnAmount, "test"),
      ).to.be.revertedWithCustomError(gameToken, "OwnableUnauthorizedAccount");
    });

    it("Should return correct game metadata", async function () {
      const metadata = await gameToken.getGameMetadata();

      expect(metadata._gameId).to.equal(gameId);
      expect(metadata._gameName).to.equal("Test Game");
      expect(metadata._gameDescription).to.equal("A test game");
      expect(metadata._gameImageUri).to.equal("https://example.com/test.png");
      expect(metadata._totalSupply).to.equal(ethers.parseEther("1000000"));
      expect(metadata._maxSupply).to.equal(ethers.parseEther("10000000"));
    });
  });

  describe("Factory Queries", function () {
    beforeEach(async function () {
      // Create multiple games
      await gameTokenFactory
        .connect(user1)
        .createGameToken(
          "Game 1",
          "GAME1",
          "First game",
          "https://example.com/game1.png",
        );

      await gameTokenFactory
        .connect(user2)
        .createGameToken(
          "Game 2",
          "GAME2",
          "Second game",
          "https://example.com/game2.png",
        );

      await gameTokenFactory
        .connect(user1)
        .createGameToken(
          "Game 3",
          "GAME3",
          "Third game",
          "https://example.com/game3.png",
        );
    });

    it("Should get games by creator", async function () {
      const user1Games = await gameTokenFactory.getGamesByCreator(
        user1.address,
      );
      const user2Games = await gameTokenFactory.getGamesByCreator(
        user2.address,
      );

      expect(user1Games.length).to.equal(2);
      expect(user2Games.length).to.equal(1);
      expect(user1Games[0]).to.equal(1);
      expect(user1Games[1]).to.equal(3);
      expect(user2Games[0]).to.equal(2);
    });

    it("Should validate game existence", async function () {
      expect(await gameTokenFactory.gameExists(1)).to.be.true;
      expect(await gameTokenFactory.gameExists(2)).to.be.true;
      expect(await gameTokenFactory.gameExists(3)).to.be.true;
      expect(await gameTokenFactory.gameExists(4)).to.be.false;
    });

    it("Should get total games count", async function () {
      expect(await gameTokenFactory.getTotalGames()).to.equal(3);
    });
  });

  describe("Access Control", function () {
    it("Should only allow owner to set template", async function () {
      const newTemplate = await ethers.deployContract("GameToken", [
        0,
        "New Template",
        "NEW",
        "New template",
        "https://example.com/new.png",
        owner.address,
      ]);

      await expect(
        gameTokenFactory
          .connect(user1)
          .setGameTokenTemplate(await newTemplate.getAddress()),
      ).to.be.revertedWithCustomError(
        gameTokenFactory,
        "OwnableUnauthorizedAccount",
      );

      await gameTokenFactory
        .connect(owner)
        .setGameTokenTemplate(await newTemplate.getAddress());
      expect(await gameTokenFactory.gameTokenTemplate()).to.equal(
        await newTemplate.getAddress(),
      );
    });
  });
});
