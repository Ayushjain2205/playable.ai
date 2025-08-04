/* eslint-disable @next/next/no-img-element */
"use client";

import LightningBoltIcon from "@/components/icons/lightning-bolt";
import Spinner from "@/components/spinner";
import * as Select from "@radix-ui/react-select";
import assert from "assert";
import { CheckIcon, ChevronDownIcon, Gamepad2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useState, useRef, useTransition, useEffect } from "react";
import { createChat, getAllChats } from "./actions";
import { Context } from "./providers";
import Header from "@/components/header";
import { useS3Upload } from "next-s3-upload";
import UploadIcon from "@/components/icons/upload-icon";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { MODELS, SUGGESTED_PROMPTS } from "@/lib/constants";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/client";
import { etherlinkTestnet } from "thirdweb/chains";

// Add type for Chat
interface Chat {
  id: string;
  model: string;
  quality: string;
  prompt: string;
  title: string;
  createdAt: string;
}

// Floating Clouds Component
function FloatingClouds() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const cloudsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const clouds = [
    { src: "/cloud1.svg", size: 120, x: "10%", y: "35%", speed: 0.02 },
    { src: "/cloud2.svg", size: 100, x: "25%", y: "28%", speed: 0.015 },
    { src: "/cloud3.svg", size: 80, x: "45%", y: "32%", speed: 0.025 },
    { src: "/cloud2.svg", size: 90, x: "65%", y: "38%", speed: 0.018 },
    { src: "/cloud1.svg", size: 110, x: "85%", y: "30%", speed: 0.022 },
  ];

  return (
    <div
      ref={cloudsRef}
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
      style={{ height: "40vh" }}
    >
      {clouds.map((cloud, index) => {
        const moveX = isClient
          ? (mousePosition.x - window.innerWidth / 2) * cloud.speed
          : 0;
        const moveY = isClient
          ? (mousePosition.y - window.innerHeight / 2) * cloud.speed
          : 0;

        return (
          <img
            key={index}
            src={cloud.src}
            alt=""
            aria-hidden="true"
            className="absolute select-none transition-transform duration-1000 ease-out"
            style={{
              width: `${cloud.size}px`,
              height: "auto",
              left: cloud.x,
              top: cloud.y,
              transform: `translate(${moveX}px, ${moveY}px)`,
              opacity: 0.7,
            }}
          />
        );
      })}
    </div>
  );
}

// Floating Coins Component
function FloatingCoins() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const coinsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const coins = [
    {
      src: "/coin.svg",
      size: 40,
      x: "28%",
      y: "88%",
      speed: 0.015,
      rotation: 15,
    },
    {
      src: "/coin.svg",
      size: 35,
      x: "42%",
      y: "90%",
      speed: 0.02,
      rotation: -10,
    },
    {
      src: "/coin.svg",
      size: 45,
      x: "58%",
      y: "92%",
      speed: 0.018,
      rotation: 25,
    },
    {
      src: "/coin.svg",
      size: 30,
      x: "72%",
      y: "89%",
      speed: 0.012,
      rotation: -5,
    },
  ];

  return (
    <div
      ref={coinsRef}
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
      style={{ height: "100vh" }}
    >
      {coins.map((coin, index) => {
        const moveX = isClient
          ? (mousePosition.x - window.innerWidth / 2) * coin.speed
          : 0;
        const moveY = isClient
          ? (mousePosition.y - window.innerHeight / 2) * coin.speed
          : 0;

        return (
          <img
            key={index}
            src={coin.src}
            alt=""
            aria-hidden="true"
            className="absolute select-none transition-transform duration-1000 ease-out"
            style={{
              width: `${coin.size}px`,
              height: "auto",
              left: coin.x,
              top: coin.y,
              transform: `translate(${moveX}px, ${moveY}px) rotate(${coin.rotation}deg)`,
              opacity: 0.8,
            }}
          />
        );
      })}
    </div>
  );
}

export default function Home() {
  const { setStreamPromise } = use(Context);
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState(MODELS[0].value);
  const [quality, setQuality] = useState("high");
  const [screenshotUrl, setScreenshotUrl] = useState<string | undefined>(
    undefined,
  );
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  const selectedModel = MODELS.find((m) => m.value === model);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();

  const [isStarting, setIsStarting] = useState(false);
  const loadingMessages = [
    "Coming up with a blueprint...",
    "Writing code...",
    "Deploying your app...",
    "Almost done...",
  ];
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isStarting) {
      setLoadingMessageIndex(0);
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => {
          if (prev < loadingMessages.length - 1) {
            return prev + 1;
          } else {
            // Stop at the last message
            if (interval) clearInterval(interval);
            return prev;
          }
        });
      }, 7000); // 7 seconds
    } else {
      setLoadingMessageIndex(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStarting]);

  const { uploadToS3 } = useS3Upload();
  const handleScreenshotUpload = async (event: any) => {
    if (prompt.length === 0) setPrompt("Build this");
    setQuality("low");
    setScreenshotLoading(true);
    let file = event.target.files[0];
    const { url } = await uploadToS3(file);
    setScreenshotUrl(url);
    setScreenshotLoading(false);
  };

  const textareaResizePrompt = prompt
    .split("\n")
    .map((text) => (text === "" ? "a" : text))
    .join("\n");

  const [chats, setChats] = useState<Chat[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await getAllChats();
      setChats(
        result.map((chat: any) => ({
          ...chat,
          createdAt:
            typeof chat.createdAt === "string"
              ? chat.createdAt
              : chat.createdAt.toISOString(),
        })),
      );
      setLoadingApps(false);
    })();
  }, []);

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

      {/* Floating Clouds */}
      <FloatingClouds />

      {/* Floating Coins */}
      <FloatingCoins />

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col justify-center px-4 pb-20 pt-32">
        {/* Decorative Cranes */}

        <img
          src="/spaceship.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none fixed left-8 top-1/2 z-0 hidden w-[150px] max-w-none -translate-y-1/2 select-none sm:block"
          style={{
            minHeight: 150,
            transform: "translateY(-50%) rotate(45deg)",
          }}
        />
        <img
          src="/joystick.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none fixed bottom-0 left-0 z-0 hidden w-[200px] max-w-none select-none sm:block"
          style={{ minHeight: 200 }}
        />
        <img
          src="/console.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none fixed bottom-0 right-0 z-0 hidden w-[350px] max-w-none select-none sm:block"
          style={{ minHeight: 400 }}
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-pink/20 via-coin/10 to-transparent" />

        <div className="container relative z-20 mx-auto max-w-4xl text-center">
          {/* Hero Heading with Coin */}
          <div className="relative inline-block w-full">
            <h1 className="mb-12 font-heading text-5xl font-bold md:text-7xl">
              <span className="font-heading text-text-primary">Turn your </span>
              <span className="font-heading">idea</span>
              <br className="mb-4" />
              <span className="font-heading text-text-primary">into a </span>
              <span className="font-heading font-bold">$GAME</span>
            </h1>
          </div>

          {/* Prompt Box */}
          <form
            className="relative z-20 mx-auto max-w-3xl"
            onSubmit={async (e) => {
              e.preventDefault();
              setIsStarting(true);
              const formData = new FormData(e.currentTarget);
              const prompt = formData.get("prompt");
              const model = formData.get("model");
              const quality = formData.get("quality");

              assert.ok(typeof prompt === "string");
              assert.ok(typeof model === "string");
              assert.ok(quality === "high" || quality === "low");

              const { chatId, lastMessageId } = await createChat(
                prompt,
                model,
                quality,
                screenshotUrl,
              );

              const streamPromise = fetch(
                "/api/get-next-completion-stream-promise",
                {
                  method: "POST",
                  body: JSON.stringify({ messageId: lastMessageId, model }),
                },
              ).then((res) => {
                if (!res.body) {
                  throw new Error("No body on response");
                }
                return res.body;
              });

              setStreamPromise(streamPromise);
              router.push(`/chats/${chatId}`);
            }}
          >
            {/* Controller positioned behind the left top corner of the form */}
            <img
              src="/controller.svg"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -left-24 -top-20 z-0 hidden w-[150px] max-w-none -rotate-45 select-none sm:block"
              style={{ minHeight: 120 }}
            />
            {/* Glow and heat distortion overlays behind prompt box */}
            <div
              className="from-bubblegum/30 to-coin-gold/30 pointer-events-none absolute -inset-6 z-10 rounded-xl bg-gradient-to-r opacity-70 blur-xl"
              style={{ zIndex: 10 }}
            ></div>
            <div
              className="from-bubblegum/5 pointer-events-none absolute inset-0 z-10 rounded-xl bg-gradient-to-b to-transparent opacity-30"
              style={{ zIndex: 10 }}
            ></div>
            <div
              className="pixelated-prompt-box relative z-20 mb-8 flex flex-col items-center justify-center bg-surface-card p-8 backdrop-blur-md"
              style={{
                border: "0",
                boxShadow:
                  "0px 5px #0D1B52, 0px -5px #0D1B52, 5px 0px #0D1B52, -5px 0px #0D1B52, 0px 10px #0D1B5238, 5px 5px #0D1B5238, -5px 5px #0D1B5238, inset 0px 5px #ffffff36",
              }}
            >
              <div
                className="pointer-events-none absolute -inset-2 z-0 bg-gradient-to-br from-coin/20 via-pink/10 to-mint/10"
                style={{
                  clipPath:
                    "polygon(0% 0%, 95% 0%, 100% 5%, 100% 100%, 5% 100%, 0% 95%)",
                  filter: "blur(8px)",
                }}
              />
              <div className="relative z-10 flex w-full flex-col">
                <textarea
                  placeholder="Describe your game idea in detail..."
                  required
                  name="prompt"
                  rows={4}
                  className="min-h-[120px] w-full resize-none border-2 border-dashed border-outline-peri bg-cta p-4 font-display text-lg text-text-primary shadow-sm transition placeholder:text-text-muted focus:outline-none disabled:opacity-50"
                  style={{
                    clipPath:
                      "polygon(0% 0%, 98% 0%, 100% 2%, 100% 100%, 2% 100%, 0% 98%)",
                    boxShadow:
                      "inset 0 0 10px rgba(255, 192, 203, 0.2), 0 0 10px rgba(255, 215, 0, 0.3)",
                  }}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      const target = event.target;
                      if (!(target instanceof HTMLTextAreaElement)) return;
                      target.closest("form")?.requestSubmit();
                    }
                  }}
                />
                {isStarting && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center rounded-xl bg-white px-1 py-3 md:px-3">
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                      <span className="animate-pulse text-balance text-center font-pixel text-sm text-text-primary md:text-base">
                        {loadingMessages[loadingMessageIndex]}
                      </span>
                    </div>
                  </div>
                )}
                {/* Screenshot preview */}
                {screenshotLoading && (
                  <div className="relative z-20 mx-3 mt-3">
                    <div className="rounded-xl">
                      <div className="group mb-2 flex h-16 w-[68px] animate-pulse items-center justify-center rounded bg-gray-200">
                        <Spinner />
                      </div>
                    </div>
                  </div>
                )}
                {screenshotUrl && (
                  <div className={`relative z-20 mx-3 mt-3`}>
                    <div className="rounded-xl">
                      <img
                        alt="screenshot"
                        src={screenshotUrl}
                        className="group relative mb-2 h-16 w-[68px] rounded"
                      />
                    </div>
                    <button
                      type="button"
                      id="x-circle-icon"
                      className="absolute -right-3 -top-4 left-14 z-30 size-5 rounded-full bg-white text-gray-900 hover:text-gray-500"
                      onClick={() => {
                        setScreenshotUrl(undefined);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      <XCircleIcon />
                    </button>
                  </div>
                )}
              </div>
              <div
                className="z-20 mt-4 flex hidden w-full flex-col gap-4 border-t-2 border-dashed border-outline-peri pt-4 sm:flex-row sm:items-center sm:justify-between"
                style={{
                  borderImage:
                    "linear-gradient(90deg, transparent, rgba(255, 192, 203, 0.5), rgba(255, 215, 0, 0.5), rgba(152, 251, 152, 0.5), transparent) 1",
                }}
              >
                <div className="flex items-center gap-3">
                  <Select.Root
                    name="model"
                    value={model}
                    onValueChange={setModel}
                  >
                    <Select.Trigger
                      className="z-30 inline-flex w-[180px] items-center gap-1 rounded-md border-none bg-transparent p-1 font-display text-sm text-gray-400 hover:bg-zinc-900/10 hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300"
                      tabIndex={0}
                      style={{ zIndex: 30 }}
                    >
                      <Select.Value aria-label={model}>
                        <span className="font-display">
                          {selectedModel?.label}
                        </span>
                      </Select.Value>
                      <Select.Icon>
                        <ChevronDownIcon className="size-3" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="z-50 overflow-hidden rounded-md border-zinc-700 bg-zinc-900 shadow ring-1 ring-black/5">
                        <Select.Viewport className="space-y-1 p-2">
                          {MODELS.map((m) => (
                            <Select.Item
                              key={m.value}
                              value={m.value}
                              className="flex cursor-pointer items-center gap-1 rounded-md p-1 font-display text-sm transition-colors data-[highlighted]:bg-coin/90 data-[highlighted]:font-bold data-[highlighted]:text-text-primary data-[highlighted]:outline-none"
                            >
                              <Select.ItemText className="inline-flex items-center gap-2 font-display text-pink">
                                {m.label}
                              </Select.ItemText>
                              <Select.ItemIndicator>
                                <CheckIcon className="size-3 text-mint" />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                        <Select.ScrollDownButton />
                        <Select.Arrow />
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                  <div className="h-4 w-px bg-outline-peri max-sm:hidden" />
                  <Select.Root
                    name="quality"
                    value={quality}
                    onValueChange={setQuality}
                  >
                    <Select.Trigger
                      className="z-30 inline-flex items-center gap-1 rounded p-1 font-display text-sm text-gray-400 hover:bg-zinc-900/80 hover:text-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300"
                      tabIndex={0}
                      style={{ zIndex: 30 }}
                    >
                      <Select.Value aria-label={quality}>
                        <span className="font-display max-sm:hidden">
                          {quality === "low"
                            ? "Low quality [faster]"
                            : "High quality [slower]"}
                        </span>
                        <span className="sm:hidden">
                          <LightningBoltIcon className="size-3" />
                        </span>
                      </Select.Value>
                      <Select.Icon>
                        <ChevronDownIcon className="size-3" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="z-50 overflow-hidden rounded-md bg-zinc-900 shadow ring-1 ring-black/5">
                        <Select.Viewport className="space-y-1 p-2">
                          {[
                            { value: "low", label: "Low quality [faster]" },
                            {
                              value: "high",
                              label: "High quality [slower]",
                            },
                          ].map((q) => (
                            <Select.Item
                              key={q.value}
                              value={q.value}
                              className="flex cursor-pointer items-center gap-1 rounded-md p-1 font-display text-sm transition-colors data-[highlighted]:bg-coin/90 data-[highlighted]:font-bold data-[highlighted]:text-text-primary data-[highlighted]:outline-none"
                            >
                              <Select.ItemText className="inline-flex items-center gap-2 font-display text-pink">
                                {q.label}
                              </Select.ItemText>
                              <Select.ItemIndicator>
                                <CheckIcon className="size-3 text-mint" />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                        <Select.ScrollDownButton />
                        <Select.Arrow />
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                  <div className="h-4 w-px bg-outline-peri max-sm:hidden" />
                  <div>
                    <label
                      htmlFor="screenshot"
                      className="z-30 flex cursor-pointer gap-2 font-display text-sm text-gray-400 hover:underline"
                      style={{ zIndex: 30 }}
                    >
                      <div className="flex size-6 items-center justify-center rounded bg-coin hover:bg-pink/40">
                        <UploadIcon className="size-4" />
                      </div>
                      <div className="flex items-center justify-center font-display transition hover:text-pink">
                        Attach
                      </div>
                    </label>
                    <input
                      id="screenshot"
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleScreenshotUpload}
                      className="hidden"
                      ref={fileInputRef}
                    />
                  </div>
                </div>
              </div>
              <div className="relative z-20 mt-4 flex shrink-0 has-[:disabled]:opacity-50">
                <button
                  type="submit"
                  className="pixelated-button flex items-center gap-3 bg-pink px-8 py-4 font-heading text-xl font-bold text-text-button transition-all duration-200 hover:bg-coin disabled:opacity-50"
                  style={{
                    minWidth: 180,
                    border: "0",
                    boxShadow:
                      "0px 5px #0D1B52, 0px -5px #0D1B52, 5px 0px #0D1B52, -5px 0px #0D1B52, 0px 10px #0D1B5238, 5px 5px #0D1B5238, -5px 5px #0D1B5238, inset 0px 5px #ffffff36",
                    cursor: "pointer",
                  }}
                  disabled={isStarting}
                >
                  <Gamepad2 className="h-7 w-7" />
                  {isStarting ? "Starting..." : "Create"}
                </button>
              </div>
              {isPending && (
                <LoadingMessage
                  isHighQuality={quality === "high"}
                  screenshotUrl={screenshotUrl}
                />
              )}
              {/* Pixelated molten metal effect at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-3 animate-pulse"
                style={{
                  background:
                    "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255, 215, 0, 0.8) 4px, rgba(255, 215, 0, 0.8) 8px, rgba(255, 192, 203, 0.8) 8px, rgba(255, 192, 203, 0.8) 12px, rgba(152, 251, 152, 0.8) 12px, rgba(152, 251, 152, 0.8) 16px)",
                  clipPath: "polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)",
                }}
              ></div>
            </div>
            {/* Pixelated Suggestion Chips */}
            <div className="relative z-30 mb-6 flex flex-wrap justify-center gap-3">
              {SUGGESTED_PROMPTS.map((v) => (
                <button
                  key={v.title}
                  type="button"
                  onClick={() => setPrompt(v.description)}
                  className="flex items-center gap-1.5 border-2 border-dashed border-outline-peri bg-surface-card/70 px-3 py-1.5 font-display text-sm text-text-primary transition-colors hover:bg-pink/20"
                  style={{
                    zIndex: 30,
                    clipPath:
                      "polygon(0% 0%, 90% 0%, 100% 10%, 100% 100%, 10% 100%, 0% 90%)",
                    background:
                      "linear-gradient(135deg, rgba(255, 192, 203, 0.2) 0%, rgba(255, 215, 0, 0.2) 100%)",
                    boxShadow: "0 0 8px rgba(255, 192, 203, 0.3)",
                  }}
                >
                  {v.title}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

function LoadingMessage({
  isHighQuality,
  screenshotUrl,
}: {
  isHighQuality: boolean;
  screenshotUrl: string | undefined;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white px-1 py-3 md:px-3">
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
        <span className="animate-pulse text-balance text-center text-sm text-pink md:text-base">
          {isHighQuality
            ? `Coming up with project plan, may take 15 seconds...`
            : screenshotUrl
              ? "Analyzing your screenshot..."
              : `Creating your app...`}
        </span>
        <Spinner />
      </div>
    </div>
  );
}

export const runtime = "edge";
export const maxDuration = 45;
