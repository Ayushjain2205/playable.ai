import { getPrisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AppOnlyOutputClient from "./AppOnlyOutput.client";
import type { Chat, Message } from "../../chats/[id]/page";
import LogoSmall from "@/components/icons/logo-small";
import Link from "next/link";
import Image from "next/image";
import TokenDrawer from "@/components/TokenDrawer";

function Spinner() {
  return (
    <svg
      className="text-coin-gold h-8 w-8 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      ></path>
    </svg>
  );
}

// Simple Floating Coins Component
function FloatingCoins() {
  const coins = [
    { x: "5%", y: "15%", size: 40, rotation: 15 },
    { x: "8%", y: "45%", size: 35, rotation: -10 },
    { x: "12%", y: "75%", size: 45, rotation: 25 },
    { x: "85%", y: "20%", size: 30, rotation: -5 },
    { x: "88%", y: "50%", size: 50, rotation: 20 },
    { x: "92%", y: "80%", size: 38, rotation: -15 },
    { x: "20%", y: "8%", size: 42, rotation: 30 },
    { x: "75%", y: "8%", size: 33, rotation: 12 },
    { x: "15%", y: "90%", size: 47, rotation: -25 },
    { x: "80%", y: "90%", size: 36, rotation: 18 },
    { x: "3%", y: "60%", size: 41, rotation: -12 },
    { x: "95%", y: "35%", size: 34, rotation: 22 },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {coins.map((coin, index) => (
        <img
          key={index}
          src="/coin.svg"
          alt=""
          aria-hidden="true"
          className="absolute select-none"
          style={{
            width: `${coin.size}px`,
            height: "auto",
            left: coin.x,
            top: coin.y,
            transform: `rotate(${coin.rotation}deg)`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
}

export default async function AppViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prisma = getPrisma();
  const chat = await prisma.chat.findFirst({
    where: { id },
    include: { messages: { orderBy: { position: "asc" } } },
  });
  if (!chat) notFound();
  const assistantMessage = chat.messages
    .filter((m: Message) => m.role === "assistant")
    .at(-1);

  return (
    <div className="font-body min-h-screen bg-gradient-to-b from-sky-top to-sky-bottom text-text-primary">
      {/* Floating Coins */}
      <FloatingCoins />

      {/* Top Heading Bar */}
      <div className="fixed left-0 top-0 z-20 flex w-full items-center justify-between border-b border-outline-peri bg-surface-card/90 px-4 py-2 shadow-sm">
        <Link href="/">
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
        </Link>
        <div className="flex flex-1 justify-center">
          <div className="text-center">
            <div className="flex max-w-xs flex-wrap items-center justify-center gap-1 font-heading font-semibold text-text-primary sm:max-w-md md:max-w-lg">
              <span className="truncate">{chat.title || chat.prompt}</span>
              <span className="mx-1 font-normal text-pink">by</span>
              <span className="truncate text-sm font-normal text-mint">
                0xdsc..poc
              </span>
            </div>
          </div>
        </div>
        <div>
          <button className="rounded bg-pink px-4 py-1.5 font-heading font-bold text-text-button shadow-md transition-all hover:bg-coin">
            Buy $
          </button>
        </div>
      </div>
      {/* App Output */}
      <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center pt-16">
        {!assistantMessage ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Spinner />
            <div className="mt-4 font-display text-pink">
              Loading app output...
            </div>
          </div>
        ) : (
          <div className="flex w-full justify-center">
            <AppOnlyOutputClient
              assistantMessage={assistantMessage as Message}
            />
          </div>
        )}
      </div>
    </div>
  );
}
