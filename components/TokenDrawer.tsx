"use client";
import React from "react";
import Image from "next/image";

const QUIZ_TOKEN = {
  name: "$QUIZ",
  marketCap: "35625.99",
  holders: "2",
  volume24h: "12.57",
  address: "0x6a81...d99c",
  creator: "0xchristopher",
  totalSupply: "1000000000",
  dateCreated: "19 Jun 2025",
  about:
    "QUIZ is the ultimate trivia token. Play, earn, and challenge your friends! Mint ends 6/2 10:00pm ET. 1,000,000,000 max supply. $QUIZ will power the next generation of on-chain quizzes.",
};

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

function truncateAddress(addr: string) {
  if (addr.length <= 12) return addr;
  const [start, end] = addr.split("...");
  if (start && end) return `${start}...${end}`;
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

export default function TokenDrawer() {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [buyAmount, setBuyAmount] = React.useState("");
  const suggested = ["0.001", "0.005", "0.02"];

  const handleCopy = () => {
    copyToClipboard(QUIZ_TOKEN.address.replace("...", ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <>
      {/* Drawer Tab */}
      <button
        className={`bg-pink text-text-button hover:bg-coin fixed left-0 top-1/2 z-30 flex flex-col items-center justify-center gap-1 rounded-r-xl px-6 py-4 font-heading text-lg font-extrabold uppercase tracking-wider shadow-xl transition-all ${open ? "hidden" : ""}`}
        style={{ minWidth: 100, minHeight: 90, transform: "translateY(-50%)" }}
        onClick={() => setOpen(true)}
        aria-label="Open $QUIZ drawer"
      >
        <Image src="/coin.svg" alt="$QUIZ Coin" width={36} height={36} />
        <span>{QUIZ_TOKEN.name}</span>
      </button>
      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 z-40 h-full w-80 transform bg-white transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{ borderTopRightRadius: 16, borderBottomRightRadius: 16 }}
      >
        <div className="border-outline-peri flex items-center justify-between border-b px-4 py-3">
          <span className="text-text-primary font-heading text-xl">
            {QUIZ_TOKEN.name} Token
          </span>
          <button
            className="text-text-primary hover:text-text-primary/80 ml-2 p-1 focus:outline-none"
            onClick={() => setOpen(false)}
            aria-label="Close drawer"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-6 p-4">
          {/* Pills Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Market Cap */}
            <div className="bg-coin/60 flex min-h-[100px] flex-col items-center rounded-[28px] px-6 py-5">
              <span className="text-text-primary mb-1 font-heading text-xs font-bold uppercase tracking-wider">
                MARKET CAP
              </span>
              <span className="text-text-primary font-body text-3xl font-extrabold">
                {QUIZ_TOKEN.marketCap}
              </span>
            </div>
            {/* Holders */}
            <div className="bg-pink/30 flex min-h-[100px] flex-col items-center rounded-[28px] px-6 py-5">
              <span className="text-text-primary mb-1 font-heading text-xs font-bold uppercase tracking-wider">
                HOLDERS
              </span>
              <span className="text-text-primary font-body text-3xl font-extrabold">
                {QUIZ_TOKEN.holders}
              </span>
            </div>
            {/* 24h Volume */}
            <div className="bg-mint/10 flex min-h-[100px] flex-col items-center rounded-[28px] px-6 py-5">
              <span className="text-text-primary mb-1 font-heading text-xs font-bold uppercase tracking-wider">
                24H VOLUME
              </span>
              <span className="text-text-primary font-body text-3xl font-extrabold">
                {QUIZ_TOKEN.volume24h}
              </span>
            </div>
            {/* Address */}
            <div className="bg-coin/30 flex min-h-[100px] flex-col items-center rounded-[28px] px-6 py-5">
              <span className="text-text-primary mb-1 font-heading text-xs font-bold uppercase tracking-wider">
                ADDRESS
              </span>
              <span className="text-text-primary mb-2 max-w-[110px] truncate font-body font-mono text-xs">
                {truncateAddress(QUIZ_TOKEN.address)}
              </span>
              <button
                className="bg-mint mt-1 rounded px-4 py-1 font-body text-sm font-semibold text-white"
                onClick={handleCopy}
                aria-label="Copy address"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          {/* Created by */}
          <div className="text-text-primary/70 mt-2 flex items-center gap-2 font-body text-sm">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="7" r="4" stroke="#a3a3a3" strokeWidth="2" />
              <path
                d="M4 21c0-3.314 3.134-6 7-6s7 2.686 7 6"
                stroke="#a3a3a3"
                strokeWidth="2"
              />
            </svg>
            <span className="font-heading font-semibold">Created by</span>
            <span className="text-text-primary ml-1 font-body font-extrabold">
              {QUIZ_TOKEN.creator}
            </span>
          </div>
          {/* Total Supply & Date Created */}
          <div className="bg-surface-card mt-2 flex flex-col gap-2 rounded-2xl px-4 py-3 font-body">
            <div className="flex justify-between text-base">
              <span className="text-text-primary font-heading font-bold">
                Total Supply:
              </span>
              <span className="text-text-primary font-extrabold">
                {QUIZ_TOKEN.totalSupply}
              </span>
            </div>
            <div className="flex justify-between text-base">
              <span className="text-text-primary font-heading font-bold">
                Date Created:
              </span>
              <span className="text-text-primary font-extrabold">
                {QUIZ_TOKEN.dateCreated}
              </span>
            </div>
          </div>
          {/* About */}
          <div className="bg-pink/10 mt-2 rounded-2xl px-4 py-3">
            <div className="text-text-primary mb-1 font-heading font-bold">
              About {QUIZ_TOKEN.name}
            </div>
            <div className="text-text-primary whitespace-pre-line font-body text-sm">
              {QUIZ_TOKEN.about}
            </div>
          </div>
        </div>
        {/* Buy Section */}
        <div className="mt-auto flex flex-col gap-2 px-4 pb-6 pt-2">
          <label
            htmlFor="buy-amount"
            className="text-text-primary mb-1 font-heading text-sm"
          >
            Buy {QUIZ_TOKEN.name} (ETH)
          </label>
          <input
            id="buy-amount"
            type="number"
            min="0"
            step="any"
            placeholder="Amount in ETH"
            className="border-mint bg-surface-card text-text-primary focus:ring-mint w-full rounded-lg border px-3 py-2 font-body text-base focus:outline-none focus:ring-2"
            value={buyAmount}
            onChange={(e) => setBuyAmount(e.target.value)}
          />
          <div className="mb-2 flex gap-2">
            {suggested.map((amt) => (
              <button
                key={amt}
                type="button"
                className={`w-full rounded-lg border px-3 py-2 font-body text-base transition-colors ${buyAmount === amt ? "border-mint bg-mint text-white" : "border-surface-card bg-surface-card text-text-primary hover:bg-mint/20"}`}
                onClick={() => setBuyAmount(amt)}
              >
                {amt}
              </button>
            ))}
          </div>
          <button className="bg-mint hover:bg-pink mt-2 w-full rounded-lg px-4 py-2 font-heading text-lg font-bold text-white transition-colors">
            Buy
          </button>
        </div>
      </div>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/10"
          onClick={() => setOpen(false)}
          aria-label="Close drawer overlay"
        />
      )}
    </>
  );
}
