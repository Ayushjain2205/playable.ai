"use client";

import ChevronLeftIcon from "@/components/icons/chevron-left";
import ChevronRightIcon from "@/components/icons/chevron-right";
import CloseIcon from "@/components/icons/close-icon";
import RefreshIcon from "@/components/icons/refresh";
import { extractFirstCodeBlock, splitByFirstCodeFence } from "@/lib/utils";
import { useState, useEffect } from "react";
import type { Chat, Message } from "./page";
import { Share } from "./share";
import { StickToBottom } from "use-stick-to-bottom";
import dynamic from "next/dynamic";
import ShareIcon from "@/components/icons/share-icon";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { parseEther } from "viem";
import { GAME_TOKEN_FACTORY_ABI, CONTRACT_ADDRESSES } from "@/lib/contracts";
import { useS3Upload } from "next-s3-upload";

const CodeRunner = dynamic(() => import("@/components/code-runner"), {
  ssr: false,
});
const SyntaxHighlighter = dynamic(
  () => import("@/components/syntax-highlighter"),
  {
    ssr: false,
  },
);

export default function CodeViewer({
  chat,
  streamText,
  message,
  onMessageChange,
  activeTab,
  onTabChange,
  onClose,
  onRequestFix,
}: {
  chat: Chat;
  streamText: string;
  message?: Message;
  onMessageChange: (v: Message) => void;
  activeTab: string;
  onTabChange: (v: "code" | "preview") => void;
  onClose: () => void;
  onRequestFix: (e: string) => void;
}) {
  const app = message ? extractFirstCodeBlock(message.content) : undefined;
  const streamAppParts = splitByFirstCodeFence(streamText);
  const streamApp = streamAppParts.find(
    (p) =>
      p.type === "first-code-fence-generating" || p.type === "first-code-fence",
  );
  const streamAppIsGenerating = streamAppParts.some(
    (p) => p.type === "first-code-fence-generating",
  );

  const code = streamApp ? streamApp.content : app?.code || "";
  const language = streamApp ? streamApp.language : app?.language || "";
  const title = streamApp ? streamApp.filename.name : app?.filename?.name || "";
  const layout = ["python", "ts", "js", "javascript", "typescript"].includes(
    language,
  )
    ? "two-up"
    : "tabbed";

  const assistantMessages = chat.messages.filter((m) => m.role === "assistant");
  const currentVersion = streamApp
    ? assistantMessages.length
    : message
      ? assistantMessages.map((m) => m.id).indexOf(message.id)
      : 1;
  const previousMessage =
    currentVersion !== 0 ? assistantMessages.at(currentVersion - 1) : undefined;
  const nextMessage =
    currentVersion < assistantMessages.length
      ? assistantMessages.at(currentVersion + 1)
      : undefined;

  const [refresh, setRefresh] = useState(0);
  const [showCoinPopup, setShowCoinPopup] = useState(false);
  const { uploadToS3 } = useS3Upload();

  // Game Token creation state
  const [form, setForm] = useState({
    gameName: "",
    gameSymbol: "",
    gameDescription: "",
    gameImageUri: "",
  });

  // Initialize form with app name and symbol when popup opens
  useEffect(() => {
    if (showCoinPopup && title) {
      const appName = title;
      const symbol = appName
        .replace(/[^a-zA-Z0-9]/g, "") // Remove special characters
        .substring(0, 5) // Take first 5 characters
        .toUpperCase(); // Convert to uppercase

      setForm((prev) => ({
        ...prev,
        gameName: appName,
        gameSymbol: symbol,
        gameDescription: `Game: ${appName}`,
        gameImageUri: "https://example.com/default.png",
      }));
    }
  }, [showCoinPopup, title]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { address: account } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      if (!account || !walletClient || !publicClient) {
        throw new Error("Please connect your wallet.");
      }

      if (!form.gameName || !form.gameSymbol || !form.gameDescription) {
        throw new Error("Please fill all required fields.");
      }

      if (form.gameSymbol.length < 3 || form.gameSymbol.length > 5) {
        throw new Error("Symbol must be 3-5 characters");
      }

      console.log("Creating game token with params:", form);

      // Use wagmi contract interaction
      const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESSES.GAME_TOKEN_FACTORY,
        abi: GAME_TOKEN_FACTORY_ABI,
        functionName: "createGameToken",
        args: [
          form.gameName,
          form.gameSymbol,
          form.gameDescription,
          form.gameImageUri || "https://example.com/default.png",
        ],
        account,
      });

      // Execute the transaction
      const hash = await walletClient.writeContract(request);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      console.log("Transaction result:", receipt);

      setResult({
        hash: hash,
        address: "0x1234567890123456789012345678901234567890", // Mock address for now
      });
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="pixelated-header-container flex h-16 shrink-0 items-center justify-between bg-white px-4"
        style={{
          border: "0",
          boxShadow:
            "0px 3px #0D1B52, 0px -3px #0D1B52, 3px 0px #0D1B52, -3px 0px #0D1B52, 0px 6px #0D1B5238, 3px 3px #0D1B5238, -3px 3px #0D1B5238, inset 0px 3px #ffffff36",
        }}
      >
        <div className="inline-flex items-center gap-4">
          <button
            className="text-bubblegumPink hover:text-lemonYellow"
            onClick={onClose}
          >
            <CloseIcon className="size-5" />
          </button>
          <span className="text-plumPurple font-heading">
            {title} v{currentVersion + 1}
          </span>
        </div>
        {layout === "tabbed" && (
          <div
            className="pixelated-tab-container flex bg-white p-1"
            style={{
              border: "0",
              boxShadow:
                "0px 3px #0D1B52, 0px -3px #0D1B52, 3px 0px #0D1B52, -3px 0px #0D1B52, 0px 6px #0D1B5238, 3px 3px #0D1B5238, -3px 3px #0D1B5238, inset 0px 3px #ffffff36",
            }}
          >
            <button
              onClick={() => onTabChange("code")}
              data-active={activeTab === "code" ? true : undefined}
              className={`pixelated-tab-button inline-flex h-9 w-24 items-center justify-center font-heading text-base font-bold outline-none transition-all duration-200 ${activeTab === "code" ? "text-white" : "text-plumPurple bg-transparent"}`}
              style={{
                border: "0",
                backgroundColor:
                  activeTab === "code" ? "#A37DE2" : "transparent",
                boxShadow:
                  activeTab === "code"
                    ? "0px 2px #0D1B52, 0px -2px #0D1B52, 2px 0px #0D1B52, -2px 0px #0D1B52, 0px 4px #0D1B5238, 2px 2px #0D1B5238, -2px 2px #0D1B5238, inset 0px 2px #ffffff36"
                    : "none",
              }}
            >
              Code
            </button>
            <button
              onClick={() => onTabChange("preview")}
              data-active={activeTab === "preview" ? true : undefined}
              className={`pixelated-tab-button inline-flex h-9 w-24 items-center justify-center font-heading text-base font-bold outline-none transition-all duration-200 ${activeTab === "preview" ? "text-white" : "text-plumPurple bg-transparent"}`}
              style={{
                border: "0",
                backgroundColor:
                  activeTab === "preview" ? "#A37DE2" : "transparent",
                boxShadow:
                  activeTab === "preview"
                    ? "0px 2px #0D1B52, 0px -2px #0D1B52, 2px 0px #0D1B52, -2px 0px #0D1B52, 0px 4px #0D1B5238, 2px 2px #0D1B5238, -2px 2px #0D1B5238, inset 0px 2px #ffffff36"
                    : "none",
              }}
            >
              Preview
            </button>
          </div>
        )}
      </div>

      {layout === "tabbed" ? (
        <div className="text-plumPurple flex grow flex-col overflow-y-auto bg-white">
          {activeTab === "code" ? (
            <StickToBottom
              className="relative grow overflow-hidden px-6 py-4"
              resize="smooth"
              initial={streamAppIsGenerating ? "smooth" : false}
            >
              <StickToBottom.Content>
                <SyntaxHighlighter code={code} language={language} />
              </StickToBottom.Content>
            </StickToBottom>
          ) : (
            <>
              {language && (
                <div className="flex h-full items-center justify-center px-6 py-4 font-pixel">
                  <CodeRunner
                    onRequestFix={onRequestFix}
                    language={language}
                    code={code}
                    key={refresh}
                  />
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="bg-softPeach flex grow flex-col">
          <div className="h-1/2 overflow-y-auto">
            <SyntaxHighlighter code={code} language={language} />
          </div>
          <div className="flex h-1/2 flex-col">
            <div className="border-bubblegumPink bg-bubblegumPink/70 text-bubblegumPink border-t px-4 py-4 font-heading">
              Output
            </div>
            <div className="border-bubblegumPink flex grow items-center justify-center border-t">
              {!streamAppIsGenerating && (
                <CodeRunner
                  onRequestFix={onRequestFix}
                  language={language}
                  code={code}
                  key={refresh}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <div
        className="pixelated-footer-container flex items-center justify-between bg-white px-4 py-4"
        style={{
          border: "0",
          boxShadow:
            "0px 3px #0D1B52, 0px -3px #0D1B52, 3px 0px #0D1B52, -3px 0px #0D1B52, 0px 6px #0D1B5238, 3px 3px #0D1B5238, -3px 3px #0D1B5238, inset 0px 3px #ffffff36",
        }}
      >
        <div className="text-bubblegumPink inline-flex items-center gap-2.5 font-heading text-sm">
          <form className="flex">
            <button
              type="submit"
              disabled={!message}
              className="pixelated-action-button border-bubblegumPink bg-lemonYellow text-plumPurple hover:bg-bubblegumPink hover:text-lemonYellow inline-flex items-center gap-1 border px-2 py-1 text-sm disabled:opacity-50"
              style={{ fontWeight: 500 }}
              onClick={(e) => {
                e.preventDefault();
                if (message) {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/share/v2/${message.id}`,
                  );
                }
              }}
            >
              <ShareIcon className="size-3" />
              Share
            </button>
          </form>
          <button
            className="pixelated-action-button border-bubblegumPink bg-lemonYellow text-plumPurple hover:bg-bubblegumPink hover:text-lemonYellow inline-flex items-center gap-1 border px-2 py-1 text-sm"
            style={{ fontWeight: 500 }}
            onClick={() => setRefresh((r) => r + 1)}
          >
            <RefreshIcon className="size-3" />
            Refresh
          </button>
          <button
            className="pixelated-action-button border-bubblegumPink bg-lemonYellow text-plumPurple hover:bg-bubblegumPink hover:text-lemonYellow inline-flex items-center gap-1 border px-2 py-1 text-sm"
            style={{ fontWeight: 500 }}
            onClick={() => setShowCoinPopup(true)}
            type="button"
          >
            🚀 Launch
          </button>
        </div>
        <div className="flex items-center justify-end gap-3">
          {previousMessage ? (
            <button
              className="text-plumPurple hover:text-lemonYellow"
              onClick={() => onMessageChange(previousMessage)}
            >
              <ChevronLeftIcon className="size-4" />
            </button>
          ) : (
            <button className="text-bubblegumPink opacity-25" disabled>
              <ChevronLeftIcon className="size-4" />
            </button>
          )}

          <p className="text-bubblegumPink font-heading text-sm">
            Version <span className="tabular-nums">{currentVersion + 1}</span>{" "}
            <span className="text-bubblegumPink">of</span>{" "}
            <span className="tabular-nums">
              {Math.max(currentVersion + 1, assistantMessages.length)}
            </span>
          </p>

          {nextMessage ? (
            <button
              className="text-plumPurple hover:text-lemonYellow"
              onClick={() => onMessageChange(nextMessage)}
            >
              <ChevronRightIcon className="size-4" />
            </button>
          ) : (
            <button className="text-bubblegumPink opacity-25" disabled>
              <ChevronRightIcon className="size-4" />
            </button>
          )}
        </div>
      </div>
      {showCoinPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div
            className="pixelated-coin-popup relative flex w-full min-w-[350px] max-w-lg flex-col items-center bg-white p-0"
            style={{
              border: "0",
              boxShadow:
                "0px 5px #0D1B52, 0px -5px #0D1B52, 5px 0px #0D1B52, -5px 0px #0D1B52, 0px 10px #0D1B5238, 5px 5px #0D1B5238, -5px 5px #0D1B5238, inset 0px 5px #ffffff36",
            }}
          >
            <button
              className="text-bubblegumPink hover:text-lemonYellow absolute right-2 top-2"
              onClick={() => setShowCoinPopup(false)}
            >
              <CloseIcon className="size-5" />
            </button>
            {/* Coin SVG at the top */}
            <div className="flex w-full flex-col items-center pt-8">
              <img src="/coin.svg" alt="Coin" className="mb-2 h-16 w-16" />
              {result ? (
                <div className="text-plumPurple mb-2 text-center font-heading text-2xl font-bold">
                  🎉 Your $
                  {form.gameSymbol ? `${form.gameSymbol}` : "game token"} is
                  live!
                </div>
              ) : (
                <h2 className="text-plumPurple mb-2 font-heading text-2xl">
                  Launch your game!
                </h2>
              )}
            </div>
            <div className="flex w-full flex-col items-center px-8 pb-8">
              {!result ? (
                <>
                  <ConnectButton
                    chainStatus="icon"
                    showBalance={false}
                    accountStatus={{
                      smallScreen: "avatar",
                      largeScreen: "full",
                    }}
                  />
                  <form
                    onSubmit={handleSubmit}
                    className="mt-6 flex w-full flex-col gap-3"
                  >
                    <input
                      name="gameName"
                      placeholder="Game Name"
                      value={form.gameName}
                      onChange={handleChange}
                      className="pixelated-input border-bubblegumPink text-plumPurple border-2 p-2 font-heading"
                      style={{
                        border: "2px solid #FF69B4",
                        boxShadow:
                          "0px 2px #0D1B52, 0px -2px #0D1B52, 2px 0px #0D1B52, -2px 0px #0D1B52, inset 0px 2px #ffffff36",
                      }}
                      required
                    />
                    <input
                      name="gameSymbol"
                      placeholder="Symbol (e.g. GAME)"
                      value={form.gameSymbol}
                      onChange={handleChange}
                      className="pixelated-input border-bubblegumPink text-plumPurple border-2 p-2 font-heading"
                      style={{
                        border: "2px solid #FF69B4",
                        boxShadow:
                          "0px 2px #0D1B52, 0px -2px #0D1B52, 2px 0px #0D1B52, -2px 0px #0D1B52, inset 0px 2px #ffffff36",
                      }}
                      required
                    />
                    <textarea
                      name="gameDescription"
                      placeholder="Description"
                      value={form.gameDescription}
                      onChange={handleChange}
                      className="pixelated-input border-bubblegumPink text-plumPurple border-2 p-2 font-heading"
                      style={{
                        border: "2px solid #FF69B4",
                        boxShadow:
                          "0px 2px #0D1B52, 0px -2px #0D1B52, 2px 0px #0D1B52, -2px 0px #0D1B52, inset 0px 2px #ffffff36",
                      }}
                      required
                    />
                    <input
                      name="gameImageUri"
                      placeholder="Image URI (optional)"
                      value={form.gameImageUri}
                      onChange={handleChange}
                      className="pixelated-input border-bubblegumPink text-plumPurple border-2 p-2 font-heading"
                      style={{
                        border: "2px solid #FF69B4",
                        boxShadow:
                          "0px 2px #0D1B52, 0px -2px #0D1B52, 2px 0px #0D1B52, -2px 0px #0D1B52, inset 0px 2px #ffffff36",
                      }}
                    />
                    <button
                      type="submit"
                      className="pixelated-action-button bg-bubblegumPink text-plumPurple gap-2 px-6 py-3 font-heading font-bold disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Launch your game!"}
                    </button>
                  </form>
                  {error && (
                    <div className="mt-4 font-heading text-red-600">
                      {error}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex w-full flex-col items-center">
                  {/* Success message is now in the header above */}
                  <div
                    className="pixelated-success-container border-bubblegumPink text-plumPurple mb-6 w-full border-2 bg-gray-50 p-4 font-heading"
                    style={{
                      border: "2px solid #FF69B4",
                      boxShadow:
                        "0px 2px #0D1B52, 0px -2px #0D1B52, 2px 0px #0D1B52, -2px 0px #0D1B52, inset 0px 2px #ffffff36",
                    }}
                  >
                    <div>
                      <a
                        href={`https://testnet.explorer.etherlink.com/tx/${result.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Transaction
                      </a>
                    </div>
                    <div>
                      <a
                        href={`https://testnet.explorer.etherlink.com/address/${result.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Coin
                      </a>
                    </div>
                  </div>
                  <button
                    className="pixelated-action-button bg-bubblegumPink text-plumPurple gap-2 px-6 py-3 font-heading font-bold"
                    onClick={() => setShowCoinPopup(false)}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
