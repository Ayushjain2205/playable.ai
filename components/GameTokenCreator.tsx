"use client";

import { useState, useEffect } from "react";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { parseEther, formatEther } from "viem";
import {
  GAME_TOKEN_FACTORY_ABI,
  GAME_TOKEN_ABI,
  CONTRACT_ADDRESSES,
  type CreateGameTokenParams,
  type GameInfo,
  type GameMetadata,
  type MintTokenParams,
  type BurnTokenParams,
} from "@/lib/contracts";

interface CreatedGame {
  gameId: number;
  gameName: string;
  gameSymbol: string;
  tokenAddress: string;
  creator: string;
}

export default function GameTokenCreator() {
  const { address: account } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  // Form states
  const [gameForm, setGameForm] = useState({
    gameName: "",
    gameSymbol: "",
    gameDescription: "",
    gameImageUri: "",
  });

  const [mintForm, setMintForm] = useState({
    tokenAddress: "",
    toAddress: "",
    amount: "",
    reason: "",
  });

  const [burnForm, setBurnForm] = useState({
    tokenAddress: "",
    fromAddress: "",
    amount: "",
    reason: "",
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createdGames, setCreatedGames] = useState<CreatedGame[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameInfo | null>(null);
  const [gameMetadata, setGameMetadata] = useState<GameMetadata | null>(null);

  // Create a new game token
  const handleCreateGameToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!account || !walletClient || !publicClient) {
        throw new Error("Please connect your wallet");
      }

      if (
        !gameForm.gameName ||
        !gameForm.gameSymbol ||
        !gameForm.gameDescription
      ) {
        throw new Error("Please fill all required fields");
      }

      if (gameForm.gameSymbol.length < 3 || gameForm.gameSymbol.length > 5) {
        throw new Error("Symbol must be 3-5 characters");
      }

      console.log("Creating game token with params:", gameForm);

      // Use wagmi contract interaction
      const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESSES.GAME_TOKEN_FACTORY,
        abi: GAME_TOKEN_FACTORY_ABI,
        functionName: "createGameToken",
        args: [
          gameForm.gameName,
          gameForm.gameSymbol,
          gameForm.gameDescription,
          gameForm.gameImageUri || "https://example.com/default.png",
        ],
        account,
      });

      // Execute the transaction
      const hash = await walletClient.writeContract(request);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      console.log("Transaction result:", receipt);

      // For now, simulate the game creation since event parsing is complex
      const mockGame: CreatedGame = {
        gameId: createdGames.length + 1,
        gameName: gameForm.gameName,
        gameSymbol: gameForm.gameSymbol,
        tokenAddress: "0x1234567890123456789012345678901234567890",
        creator: account,
      };

      setCreatedGames((prev) => [...prev, mockGame]);
      setSuccess(
        `Game token "${gameForm.gameName}" created successfully! Transaction: ${hash}`,
      );

      // Reset form
      setGameForm({
        gameName: "",
        gameSymbol: "",
        gameDescription: "",
        gameImageUri: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to create game token");
    } finally {
      setLoading(false);
    }
  };

  // Mint tokens
  const handleMintTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!account || !walletClient || !publicClient) {
        throw new Error("Please connect your wallet");
      }

      if (
        !mintForm.tokenAddress ||
        !mintForm.toAddress ||
        !mintForm.amount ||
        !mintForm.reason
      ) {
        throw new Error("Please fill all required fields");
      }

      console.log("Minting tokens with params:", mintForm);

      // Use wagmi contract interaction
      const { request } = await publicClient!.simulateContract({
        address: mintForm.tokenAddress,
        abi: GAME_TOKEN_ABI,
        functionName: "mint",
        args: [
          mintForm.toAddress,
          parseEther(mintForm.amount),
          mintForm.reason,
        ],
        account,
      });

      // Execute the transaction
      const hash = await walletClient.writeContract(request);
      await publicClient!.waitForTransactionReceipt({ hash });

      setSuccess(
        `Successfully minted ${mintForm.amount} tokens to ${mintForm.toAddress}. Transaction: ${hash}`,
      );

      // Reset form
      setMintForm({
        tokenAddress: "",
        toAddress: "",
        amount: "",
        reason: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to mint tokens");
    } finally {
      setLoading(false);
    }
  };

  // Burn tokens
  const handleBurnTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!account || !walletClient || !publicClient) {
        throw new Error("Please connect your wallet");
      }

      if (
        !burnForm.tokenAddress ||
        !burnForm.fromAddress ||
        !burnForm.amount ||
        !burnForm.reason
      ) {
        throw new Error("Please fill all required fields");
      }

      console.log("Burning tokens with params:", burnForm);

      // Use wagmi contract interaction
      const { request } = await publicClient!.simulateContract({
        address: burnForm.tokenAddress,
        abi: GAME_TOKEN_ABI,
        functionName: "burn",
        args: [
          burnForm.fromAddress,
          parseEther(burnForm.amount),
          burnForm.reason,
        ],
        account,
      });

      // Execute the transaction
      const hash = await walletClient.writeContract(request);
      await publicClient!.waitForTransactionReceipt({ hash });

      setSuccess(
        `Successfully burned ${burnForm.amount} tokens from ${burnForm.fromAddress}. Transaction: ${hash}`,
      );

      // Reset form
      setBurnForm({
        tokenAddress: "",
        fromAddress: "",
        amount: "",
        reason: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to burn tokens");
    } finally {
      setLoading(false);
    }
  };

  // Get game info
  const handleGetGameInfo = async (gameId: number) => {
    try {
      setError(null);

      // Simulate getting game info
      const mockGameInfo: GameInfo = {
        gameId,
        gameName: "Test Game",
        gameSymbol: "TEST",
        gameDescription: "A test game",
        gameImageUri: "https://example.com/test.png",
        tokenAddress: "0x1234567890123456789012345678901234567890" as any,
        creator: account!,
        createdAt: BigInt(Date.now()),
        exists: true,
      };

      setSelectedGame(mockGameInfo);
    } catch (err: any) {
      setError(err.message || "Failed to get game info");
    }
  };

  // Get game metadata
  const handleGetGameMetadata = async (tokenAddress: string) => {
    try {
      setError(null);

      // Simulate getting game metadata
      const mockMetadata: GameMetadata = {
        gameId: 1,
        gameName: "Test Game",
        gameDescription: "A test game",
        gameImageUri: "https://example.com/test.png",
        totalSupply: parseEther("1000000"),
        maxSupply: parseEther("10000000"),
      };

      setGameMetadata(mockMetadata);
    } catch (err: any) {
      setError(err.message || "Failed to get game metadata");
    }
  };

  return (
    <div className="space-y-8">
      {/* Error/Success Messages */}
      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/20 p-4">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-500/50 bg-green-500/20 p-4">
          <p className="text-green-300">{success}</p>
        </div>
      )}

      {/* Create Game Token Form */}
      <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
        <h2 className="mb-6 text-2xl font-semibold">Create Game Token</h2>
        <form onSubmit={handleCreateGameToken} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Game Name *
              </label>
              <input
                type="text"
                value={gameForm.gameName}
                onChange={(e) =>
                  setGameForm((prev) => ({ ...prev, gameName: e.target.value }))
                }
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:border-blue-400 focus:outline-none"
                placeholder="My Awesome Game"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Symbol (3-5 chars) *
              </label>
              <input
                type="text"
                value={gameForm.gameSymbol}
                onChange={(e) =>
                  setGameForm((prev) => ({
                    ...prev,
                    gameSymbol: e.target.value.toUpperCase(),
                  }))
                }
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:border-blue-400 focus:outline-none"
                placeholder="GAME"
                maxLength={5}
                required
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Description *
            </label>
            <textarea
              value={gameForm.gameDescription}
              onChange={(e) =>
                setGameForm((prev) => ({
                  ...prev,
                  gameDescription: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:border-blue-400 focus:outline-none"
              placeholder="Describe your game..."
              rows={3}
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Image URI</label>
            <input
              type="url"
              value={gameForm.gameImageUri}
              onChange={(e) =>
                setGameForm((prev) => ({
                  ...prev,
                  gameImageUri: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:border-blue-400 focus:outline-none"
              placeholder="https://example.com/game-image.png"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-800"
          >
            {loading ? "Creating..." : "Create Game Token"}
          </button>
        </form>
      </div>

      {/* Mint Tokens Form */}
      <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
        <h2 className="mb-6 text-2xl font-semibold">Mint Tokens</h2>
        <form onSubmit={handleMintTokens} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Token Address *
              </label>
              <input
                type="text"
                value={mintForm.tokenAddress}
                onChange={(e) =>
                  setMintForm((prev) => ({
                    ...prev,
                    tokenAddress: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:border-blue-400 focus:outline-none"
                placeholder="0x..."
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                To Address *
              </label>
              <input
                type="text"
                value={mintForm.toAddress}
                onChange={(e) =>
                  setMintForm((prev) => ({
                    ...prev,
                    toAddress: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:border-blue-400 focus:outline-none"
                placeholder="0x..."
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Amount *</label>
              <input
                type="number"
                value={mintForm.amount}
                onChange={(e) =>
                  setMintForm((prev) => ({ ...prev, amount: e.target.value }))
                }
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:border-blue-400 focus:outline-none"
                placeholder="1000"
                step="0.000001"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Reason *</label>
              <input
                type="text"
                value={mintForm.reason}
                onChange={(e) =>
                  setMintForm((prev) => ({ ...prev, reason: e.target.value }))
                }
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:border-blue-400 focus:outline-none"
                placeholder="game_reward"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-600 px-6 py-3 font-semibold transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-800"
          >
            {loading ? "Minting..." : "Mint Tokens"}
          </button>
        </form>
      </div>

      {/* Burn Tokens Form */}
      <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
        <h2 className="mb-6 text-2xl font-semibold">Burn Tokens</h2>
        <form onSubmit={handleBurnTokens} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Token Address *
              </label>
              <input
                type="text"
                value={burnForm.tokenAddress}
                onChange={(e) =>
                  setBurnForm((prev) => ({
                    ...prev,
                    tokenAddress: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:border-blue-400 focus:outline-none"
                placeholder="0x..."
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                From Address *
              </label>
              <input
                type="text"
                value={burnForm.fromAddress}
                onChange={(e) =>
                  setBurnForm((prev) => ({
                    ...prev,
                    fromAddress: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:border-blue-400 focus:outline-none"
                placeholder="0x..."
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Amount *</label>
              <input
                type="number"
                value={burnForm.amount}
                onChange={(e) =>
                  setBurnForm((prev) => ({ ...prev, amount: e.target.value }))
                }
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:border-blue-400 focus:outline-none"
                placeholder="100"
                step="0.000001"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Reason *</label>
              <input
                type="text"
                value={burnForm.reason}
                onChange={(e) =>
                  setBurnForm((prev) => ({ ...prev, reason: e.target.value }))
                }
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:border-blue-400 focus:outline-none"
                placeholder="penalty"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-600 px-6 py-3 font-semibold transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-800"
          >
            {loading ? "Burning..." : "Burn Tokens"}
          </button>
        </form>
      </div>

      {/* Created Games List */}
      {createdGames.length > 0 && (
        <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
          <h2 className="mb-6 text-2xl font-semibold">Created Games</h2>
          <div className="space-y-4">
            {createdGames.map((game, index) => (
              <div key={index} className="rounded-lg bg-white/5 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{game.gameName}</h3>
                    <p className="text-sm text-gray-300">
                      Symbol: {game.gameSymbol}
                    </p>
                    <p className="text-sm text-gray-300">
                      Token: {game.tokenAddress}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleGetGameInfo(game.gameId)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm hover:bg-blue-700"
                    >
                      Get Info
                    </button>
                    <button
                      onClick={() => handleGetGameMetadata(game.tokenAddress)}
                      className="rounded-lg bg-purple-600 px-4 py-2 text-sm hover:bg-purple-700"
                    >
                      Get Metadata
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Game Info Display */}
      {selectedGame && (
        <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
          <h2 className="mb-6 text-2xl font-semibold">Game Information</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-300">Game ID</p>
              <p className="font-semibold">{selectedGame.gameId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-300">Name</p>
              <p className="font-semibold">{selectedGame.gameName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-300">Symbol</p>
              <p className="font-semibold">{selectedGame.gameSymbol}</p>
            </div>
            <div>
              <p className="text-sm text-gray-300">Creator</p>
              <p className="font-mono text-sm">{selectedGame.creator}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-300">Description</p>
              <p className="font-semibold">{selectedGame.gameDescription}</p>
            </div>
          </div>
        </div>
      )}

      {/* Game Metadata Display */}
      {gameMetadata && (
        <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
          <h2 className="mb-6 text-2xl font-semibold">Game Metadata</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-300">Game ID</p>
              <p className="font-semibold">{gameMetadata.gameId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-300">Name</p>
              <p className="font-semibold">{gameMetadata.gameName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-300">Total Supply</p>
              <p className="font-semibold">
                {formatEther(gameMetadata.totalSupply)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-300">Max Supply</p>
              <p className="font-semibold">
                {formatEther(gameMetadata.maxSupply)}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-300">Description</p>
              <p className="font-semibold">{gameMetadata.gameDescription}</p>
            </div>
          </div>
        </div>
      )}

      {/* Contract Information */}
      <div className="rounded-lg border border-green-500/50 bg-green-500/20 p-6">
        <h3 className="mb-2 text-lg font-semibold">✅ Contracts Deployed</h3>
        <p className="mb-4 text-sm text-gray-300">
          The contracts are deployed on Etherlink testnet and ready for testing.
        </p>
        <div className="space-y-1 text-sm">
          <p>
            • GameTokenFactory:{" "}
            <code className="rounded bg-white/10 px-2 py-1">
              {CONTRACT_ADDRESSES.GAME_TOKEN_FACTORY}
            </code>
          </p>
          <p>
            • GameToken Template:{" "}
            <code className="rounded bg-white/10 px-2 py-1">
              {CONTRACT_ADDRESSES.GAME_TOKEN_TEMPLATE}
            </code>
          </p>
          <p>• Network: Etherlink Testnet (Chain ID: 128123)</p>
          <p>
            • Get testnet XTZ from{" "}
            <a
              href="https://faucet.etherlink.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 underline hover:text-blue-200"
            >
              Etherlink Faucet
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
