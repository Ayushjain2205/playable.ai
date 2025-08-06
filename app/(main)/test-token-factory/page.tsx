"use client";

import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { createPublicClient, http, createWalletClient, custom } from "viem";
import { parseEther, formatEther } from "viem";
import GameTokenCreator from "@/components/GameTokenCreator";

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

export default function TestTokenFactoryPage() {
  const { address: account } = useAccount();
  const { data: walletClientData } = useWalletClient();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-center text-4xl font-bold">
            🎮 Game Token Factory Test
          </h1>

          <div className="mb-8 rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
            <h2 className="mb-4 text-2xl font-semibold">Current Status</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-white/5 p-4">
                <p className="text-sm text-gray-300">Wallet Address</p>
                <p className="font-mono text-lg">
                  {account ? account : "Not connected"}
                </p>
              </div>
              <div className="rounded-lg bg-white/5 p-4">
                <p className="text-sm text-gray-300">Network</p>
                <p className="font-mono text-lg">Etherlink Testnet</p>
              </div>
            </div>
          </div>

          {!account ? (
            <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/20 p-6 text-center">
              <p className="mb-4 text-lg">
                Please connect your wallet to continue
              </p>
              <p className="text-sm text-gray-300">
                You need to connect a wallet that supports Etherlink testnet
              </p>
            </div>
          ) : (
            <GameTokenCreator />
          )}
        </div>
      </div>
    </div>
  );
}
