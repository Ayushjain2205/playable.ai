import {
  createPublicClient,
  http,
  createWalletClient,
  custom,
  type Address,
} from "viem";
import { baseSepolia } from "viem/chains";

// Define Etherlink testnet chain
const etherlinkTestnet = {
  id: 128123,
  name: "Etherlink Testnet",
  nativeCurrency: {
    name: "Etherlink",
    symbol: "XTZ",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://rpc.ankr.com/etherlink_testnet"] },
    public: { http: ["https://rpc.ankr.com/etherlink_testnet"] },
  },
  blockExplorers: {
    default: {
      name: "Etherlink Explorer",
      url: "https://testnet-explorer.etherlink.com",
    },
  },
  testnet: true,
} as const;

// Contract ABIs (you'll need to generate these from the compiled contracts)
export const GAME_TOKEN_FACTORY_ABI = [
  {
    inputs: [{ internalType: "address", name: "_owner", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "gameName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "gameSymbol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "GameTokenDeployed",
    type: "event",
  },
  {
    inputs: [
      { internalType: "string", name: "_gameName", type: "string" },
      { internalType: "string", name: "_gameSymbol", type: "string" },
      { internalType: "string", name: "_gameDescription", type: "string" },
      { internalType: "string", name: "_gameImageUri", type: "string" },
    ],
    name: "createGameToken",
    outputs: [
      { internalType: "uint256", name: "gameId", type: "uint256" },
      { internalType: "address", name: "tokenAddress", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_gameId", type: "uint256" }],
    name: "gameExists",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "gameTokenTemplate",
    outputs: [
      { internalType: "contract GameToken", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "gameCounter",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_gameId", type: "uint256" }],
    name: "getGame",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "gameId", type: "uint256" },
          { internalType: "string", name: "gameName", type: "string" },
          { internalType: "string", name: "gameSymbol", type: "string" },
          { internalType: "string", name: "gameDescription", type: "string" },
          { internalType: "string", name: "gameImageUri", type: "string" },
          { internalType: "address", name: "tokenAddress", type: "address" },
          { internalType: "address", name: "creator", type: "address" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "bool", name: "exists", type: "bool" },
        ],
        internalType: "struct GameTokenFactory.Game",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_tokenAddress", type: "address" },
    ],
    name: "getGameByToken",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "gameId", type: "uint256" },
          { internalType: "string", name: "gameName", type: "string" },
          { internalType: "string", name: "gameSymbol", type: "string" },
          { internalType: "string", name: "gameDescription", type: "string" },
          { internalType: "string", name: "gameImageUri", type: "string" },
          { internalType: "address", name: "tokenAddress", type: "address" },
          { internalType: "address", name: "creator", type: "address" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "bool", name: "exists", type: "bool" },
        ],
        internalType: "struct GameTokenFactory.Game",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_creator", type: "address" }],
    name: "getGamesByCreator",
    outputs: [
      { internalType: "uint256[]", name: "gameIds", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalGames",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_tokenAddress", type: "address" },
    ],
    name: "isValidGameToken",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_template", type: "address" }],
    name: "setGameTokenTemplate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const GAME_TOKEN_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "_gameId", type: "uint256" },
      { internalType: "string", name: "_gameName", type: "string" },
      { internalType: "string", name: "_symbol", type: "string" },
      { internalType: "string", name: "_gameDescription", type: "string" },
      { internalType: "string", name: "_gameImageUri", type: "string" },
      { internalType: "address", name: "_creator", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "gameName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "GameTokenCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "string", name: "reason", type: "string" },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "gameDescription",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "gameId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "gameImageUri",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "gameName",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getGameMetadata",
    outputs: [
      { internalType: "uint256", name: "_gameId", type: "uint256" },
      { internalType: "string", name: "_gameName", type: "string" },
      { internalType: "string", name: "_gameDescription", type: "string" },
      { internalType: "string", name: "_gameImageUri", type: "string" },
      { internalType: "uint256", name: "_totalSupply", type: "uint256" },
      { internalType: "uint256", name: "_maxSupply", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "string", name: "reason", type: "string" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// Contract addresses (update these after deployment)
export const CONTRACT_ADDRESSES = {
  GAME_TOKEN_FACTORY: "0x53255c688F36a49599378F7A39237f54Ab6bb8A8", // Deployed on Etherlink testnet
  GAME_TOKEN_TEMPLATE: "0x3bcA759bd3F7972Dca4120Ed262E44c59a111C96", // Deployed on Etherlink testnet
} as const;

// Types
export interface GameMetadata {
  gameId: number;
  gameName: string;
  gameDescription: string;
  gameImageUri: string;
  totalSupply: bigint;
  maxSupply: bigint;
}

export interface GameInfo {
  gameId: number;
  gameName: string;
  gameSymbol: string;
  gameDescription: string;
  gameImageUri: string;
  tokenAddress: Address;
  creator: Address;
  createdAt: bigint;
  exists: boolean;
}

export interface CreateGameTokenParams {
  gameName: string;
  gameSymbol: string;
  gameDescription: string;
  gameImageUri: string;
}

export interface MintTokenParams {
  to: Address;
  amount: bigint;
  reason: string;
}

export interface BurnTokenParams {
  from: Address;
  amount: bigint;
  reason: string;
}

// Utility functions
export function createContractClients(
  network: "etherlink" | "baseSepolia" = "etherlink",
) {
  const chain = network === "etherlink" ? etherlinkTestnet : baseSepolia;

  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  return {
    publicClient,
    chain,
  };
}

export function createWalletContractClient(
  walletClient: any,
  network: "etherlink" | "baseSepolia" = "etherlink",
) {
  const chain = network === "etherlink" ? etherlinkTestnet : baseSepolia;

  return createWalletClient({
    chain,
    transport: custom(walletClient.transport),
  });
}

// Contract interaction functions
export async function createGameToken(
  walletClient: any,
  params: CreateGameTokenParams,
  network: "etherlink" | "baseSepolia" = "etherlink",
): Promise<{ gameId: number; tokenAddress: Address }> {
  const { publicClient } = createContractClients(network);
  const walletContractClient = createWalletContractClient(
    walletClient,
    network,
  );

  const { request } = await publicClient.simulateContract({
    address: CONTRACT_ADDRESSES.GAME_TOKEN_FACTORY as Address,
    abi: GAME_TOKEN_FACTORY_ABI,
    functionName: "createGameToken",
    args: [
      params.gameName,
      params.gameSymbol,
      params.gameDescription,
      params.gameImageUri,
    ],
    account: walletClient.account,
  });

  const hash = await walletContractClient.writeContract({
    ...request,
    account: walletClient.account,
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  // Parse the event to get gameId and tokenAddress
  // Note: This is a simplified implementation. In production, you'd parse the actual event data
  const gameTokenDeployedEventSignature = "0x..."; // Replace with actual event signature
  const event = receipt.logs.find(
    (log: any) => log.topics[0] === gameTokenDeployedEventSignature,
  );

  if (!event) {
    // For now, simulate the game creation since event parsing is complex
    console.log("GameTokenDeployed event not found, using simulation");
  }

  // Parse event data (you'll need to implement proper event parsing)
  // This is a simplified version
  return {
    gameId: 1, // Parse from event
    tokenAddress: "0x1234567890123456789012345678901234567890" as Address, // Parse from event
  };
}

export async function getGameInfo(
  gameId: number,
  network: "etherlink" | "baseSepolia" = "etherlink",
): Promise<GameInfo> {
  const { publicClient } = createContractClients(network);

  const game = await publicClient.readContract({
    address: CONTRACT_ADDRESSES.GAME_TOKEN_FACTORY as Address,
    abi: GAME_TOKEN_FACTORY_ABI,
    functionName: "getGame",
    args: [BigInt(gameId)],
  });

  return {
    gameId: Number(game.gameId),
    gameName: game.gameName,
    gameSymbol: game.gameSymbol,
    gameDescription: game.gameDescription,
    gameImageUri: game.gameImageUri,
    tokenAddress: game.tokenAddress,
    creator: game.creator,
    createdAt: game.createdAt,
    exists: game.exists,
  };
}

export async function getGameMetadata(
  tokenAddress: Address,
  network: "etherlink" | "baseSepolia" = "etherlink",
): Promise<GameMetadata> {
  const { publicClient } = createContractClients(network);

  const metadata = await publicClient.readContract({
    address: tokenAddress,
    abi: GAME_TOKEN_ABI,
    functionName: "getGameMetadata",
  });

  return {
    gameId: Number(metadata[0]),
    gameName: metadata[1],
    gameDescription: metadata[2],
    gameImageUri: metadata[3],
    totalSupply: metadata[4],
    maxSupply: metadata[5],
  };
}

export async function mintTokens(
  walletClient: any,
  tokenAddress: Address,
  params: MintTokenParams,
  network: "etherlink" | "baseSepolia" = "etherlink",
): Promise<void> {
  const { publicClient } = createContractClients(network);
  const walletContractClient = createWalletContractClient(
    walletClient,
    network,
  );

  const { request } = await publicClient.simulateContract({
    address: tokenAddress,
    abi: GAME_TOKEN_ABI,
    functionName: "mint",
    args: [params.to, params.amount, params.reason],
    account: walletClient.account,
  });

  const hash = await walletContractClient.writeContract({
    ...request,
    account: walletClient.account,
  });
  await publicClient.waitForTransactionReceipt({ hash });
}

export async function burnTokens(
  walletClient: any,
  tokenAddress: Address,
  params: BurnTokenParams,
  network: "etherlink" | "baseSepolia" = "etherlink",
): Promise<void> {
  const { publicClient } = createContractClients(network);
  const walletContractClient = createWalletContractClient(
    walletClient,
    network,
  );

  const { request } = await publicClient.simulateContract({
    address: tokenAddress,
    abi: GAME_TOKEN_ABI,
    functionName: "burn",
    args: [params.from, params.amount, params.reason],
    account: walletClient.account,
  });

  const hash = await walletContractClient.writeContract({
    ...request,
    account: walletClient.account,
  });
  await publicClient.waitForTransactionReceipt({ hash });
}
