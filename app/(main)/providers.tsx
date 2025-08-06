"use client";

import { createContext, ReactNode, useState } from "react";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const Context = createContext<{
  streamPromise?: Promise<ReadableStream>;
  setStreamPromise: (v: Promise<ReadableStream> | undefined) => void;
}>({
  setStreamPromise: () => {},
});

// Etherlink testnet config
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
};

const config = getDefaultConfig({
  appName: "ZappForge",
  projectId: "zappforge-etherlink-testnet", // You can use any string here
  chains: [etherlinkTestnet],
  transports: {
    [etherlinkTestnet.id]: http("https://rpc.ankr.com/etherlink_testnet"),
  },
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  const [streamPromise, setStreamPromise] = useState<Promise<ReadableStream>>();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <Context value={{ streamPromise, setStreamPromise }}>
            {children}
          </Context>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
