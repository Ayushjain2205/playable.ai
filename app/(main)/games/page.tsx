"use client";

import { useState } from "react";
import Image from "next/image";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/client";
import { etherlinkTestnet } from "thirdweb/chains";

// Mock data for games
const mockGames = [
  {
    id: 1,
    title: "Snake Game",
    views: "187",
    thumbnail: "/placeholder-game-1.png",
    avatar: "/placeholder-avatar-1.png",
  },
  {
    id: 2,
    title: "Tetris",
    views: "156",
    thumbnail: "/placeholder-game-2.png",
    avatar: "/placeholder-avatar-2.png",
  },
  {
    id: 3,
    title: "Pong",
    views: "142",
    thumbnail: "/placeholder-game-3.png",
    avatar: "/placeholder-avatar-3.png",
  },
  {
    id: 4,
    title: "Breakout",
    views: "198",
    thumbnail: "/placeholder-game-4.png",
    avatar: "/placeholder-avatar-4.png",
  },
  {
    id: 5,
    title: "Pac-Man",
    views: "134",
    thumbnail: "/placeholder-game-5.png",
    avatar: "/placeholder-avatar-5.png",
  },
  {
    id: 6,
    title: "Space Invaders",
    views: "167",
    thumbnail: "/placeholder-game-6.png",
    avatar: "/placeholder-avatar-6.png",
  },
  {
    id: 7,
    title: "Asteroids",
    views: "145",
    thumbnail: "/placeholder-game-7.png",
    avatar: "/placeholder-avatar-7.png",
  },
  {
    id: 8,
    title: "Frogger",
    views: "123",
    thumbnail: "/placeholder-game-8.png",
    avatar: "/placeholder-avatar-8.png",
  },
  {
    id: 9,
    title: "Donkey Kong",
    views: "178",
    thumbnail: "/placeholder-game-9.png",
    avatar: "/placeholder-avatar-9.png",
  },
  {
    id: 10,
    title: "Galaga",
    views: "156",
    thumbnail: "/placeholder-game-10.png",
    avatar: "/placeholder-avatar-10.png",
  },
  {
    id: 11,
    title: "Centipede",
    views: "134",
    thumbnail: "/placeholder-game-11.png",
    avatar: "/placeholder-avatar-11.png",
  },
  {
    id: 12,
    title: "Missile Command",
    views: "189",
    thumbnail: "/placeholder-game-12.png",
    avatar: "/placeholder-avatar-12.png",
  },
];

export default function GamesPage() {
  const [activeTab, setActiveTab] = useState("top-games");

  return (
    <div className="font-body min-h-screen bg-gradient-to-b from-sky-top to-sky-bottom text-text-primary">
      {/* Header */}
      <header className="absolute left-0 top-0 z-50 w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="">
              <Image
                src="/new_logo.svg"
                alt="Playable Logo"
                width={48}
                height={48}
                priority
                className="object-contain"
              />
            </div>
            <span className="ml-2 text-2xl font-bold tracking-wide">
              <span className="font-pixel text-text-primary">Playable.ai</span>
            </span>
          </div>
          <div>
            <ConnectButton client={client} chain={etherlinkTestnet} />
          </div>
        </div>
      </header>

      {/* Background overlays */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-pink/20 via-coin/10 to-transparent" />

      {/* Main Content */}
      <section className="relative z-20 flex min-h-screen flex-col px-6 pb-20 pt-20">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="mb-4 text-3xl font-bold text-text-primary">
              All Games
            </h1>

            {/* Navigation Tabs */}
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab("top-games")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "top-games"
                    ? "bg-gray-700/50 text-text-primary"
                    : "text-text-primary/70 hover:text-text-primary"
                }`}
              >
                Top Games
              </button>
              <button
                onClick={() => setActiveTab("recent-graduates")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "recent-graduates"
                    ? "bg-gray-700/50 text-text-primary"
                    : "text-text-primary/70 hover:text-text-primary"
                }`}
              >
                Recent Graduates
              </button>
              <button
                onClick={() => setActiveTab("most-recent")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "most-recent"
                    ? "bg-gray-700/50 text-text-primary"
                    : "text-text-primary/70 hover:text-text-primary"
                }`}
              >
                Most Recent
              </button>
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-6 gap-4">
            {mockGames.map((game) => (
              <div key={game.id} className="group cursor-pointer">
                {/* Game Thumbnail */}
                <div className="relative mb-3 overflow-hidden rounded-lg bg-gray-800/50 backdrop-blur-sm">
                  <div className="flex aspect-square w-full items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
                    <div className="text-center">
                      <div className="mb-2 text-4xl">🎮</div>
                      <div className="text-xs text-gray-300">Game Preview</div>
                    </div>
                  </div>
                </div>

                {/* Game Info */}
                <div className="flex items-start space-x-2">
                  {/* Avatar */}
                  <div className="to-pink-500 mt-1 h-6 w-6 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-500">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-700/50 text-xs text-text-primary backdrop-blur-sm">
                      👤
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    {/* Game Title */}
                    <h3 className="mb-1 truncate text-sm font-medium text-text-primary">
                      {game.title}
                    </h3>

                    {/* View Count */}
                    <div className="flex items-center space-x-1">
                      <svg
                        className="h-3 w-3 text-text-primary/60"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs text-text-primary/60">
                        {game.views}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
