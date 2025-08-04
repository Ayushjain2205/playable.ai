"use client";

import type { Chat, Message } from "./page";
import ArrowLeftIcon from "@/components/icons/arrow-left";
import { splitByFirstCodeFence } from "@/lib/utils";
import { Fragment } from "react";
import Markdown from "react-markdown";
import { StickToBottom } from "use-stick-to-bottom";

export default function ChatLog({
  chat,
  activeMessage,
  streamText,
  onMessageClick,
}: {
  chat: Chat;
  activeMessage?: Message;
  streamText: string;
  onMessageClick: (v: Message) => void;
}) {
  const assistantMessages = chat.messages.filter((m) => m.role === "assistant");

  return (
    <StickToBottom
      className="relative grow overflow-hidden font-display"
      resize="smooth"
      initial="smooth"
    >
      <StickToBottom.Content className="mx-auto flex w-full max-w-prose flex-col gap-8 p-8">
        <UserMessage content={chat.prompt} />

        {chat.messages.slice(2).map((message) => (
          <Fragment key={message.id}>
            {message.role === "user" ? (
              <UserMessage content={message.content} />
            ) : (
              <AssistantMessage
                content={message.content}
                version={
                  assistantMessages.map((m) => m.id).indexOf(message.id) + 1
                }
                message={message}
                isActive={!streamText && activeMessage?.id === message.id}
                onMessageClick={onMessageClick}
              />
            )}
          </Fragment>
        ))}

        {streamText && (
          <AssistantMessage
            content={streamText}
            version={assistantMessages.length + 1}
            isActive={true}
          />
        )}
      </StickToBottom.Content>
    </StickToBottom>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="relative inline-flex max-w-[80%] items-end gap-3 self-end">
      <div
        className="pixelated-user-message bg-pink/70 text-text-primary whitespace-pre-wrap px-4 py-2 font-display"
        style={{
          border: "0",
          boxShadow:
            "0px 3px #0D1B52, 0px -3px #0D1B52, 3px 0px #0D1B52, -3px 0px #0D1B52, 0px 6px #0D1B5238, 3px 3px #0D1B5238, -3px 3px #0D1B5238, inset 0px 3px #ffffff36",
        }}
      >
        {content}
      </div>
    </div>
  );
}

function AssistantMessage({
  content,
  version,
  message,
  isActive,
  onMessageClick = () => {},
}: {
  content: string;
  version: number;
  message?: Message;
  isActive?: boolean;
  onMessageClick?: (v: Message) => void;
}) {
  const parts = splitByFirstCodeFence(content);

  return (
    <div>
      {parts.map((part, i) => (
        <div key={i}>
          {part.type === "text" ? (
            <Markdown className="text-text-primary prose-headings:text-text-primary prose-strong:text-text-primary prose-ol:text-text-primary prose-ul:text-text-primary prose-li:text-text-primary prose-li:marker:text-text-primary prose prose-invert font-display">
              {part.content}
            </Markdown>
          ) : part.type === "first-code-fence-generating" ? (
            <div className="my-4">
              <button
                disabled
                className="pixelated-generating-button bg-pink/70 inline-flex w-full animate-pulse items-center gap-2 p-1.5"
                style={{
                  border: "0",
                  boxShadow:
                    "0px 3px #0D1B52, 0px -3px #0D1B52, 3px 0px #0D1B52, -3px 0px #0D1B52, 0px 6px #0D1B5238, 3px 3px #0D1B5238, -3px 3px #0D1B5238, inset 0px 3px #ffffff36",
                }}
              >
                <div
                  className="pixelated-version-badge bg-pink text-text-primary flex size-8 items-center justify-center font-bold"
                  style={{
                    border: "0",
                    boxShadow:
                      "0px 2px #0D1B52, 0px -2px #0D1B52, 2px 0px #0D1B52, -2px 0px #0D1B52, 0px 4px #0D1B5238, 2px 2px #0D1B5238, -2px 2px #0D1B5238, inset 0px 2px #ffffff36",
                  }}
                >
                  V{version}
                </div>
                <div className="flex flex-col gap-0.5 text-left leading-none">
                  <div className="text-text-primary text-sm font-medium leading-none">
                    Generating...
                  </div>
                </div>
              </button>
            </div>
          ) : message ? (
            <div className="my-4">
              <button
                className={`pixelated-message-button ${isActive ? "bg-pink/70" : "bg-pink hover:bg-coin/20"} inline-flex w-full items-center gap-2 p-1.5 transition-all duration-200`}
                style={{
                  border: "0",
                  boxShadow:
                    "0px 3px #0D1B52, 0px -3px #0D1B52, 3px 0px #0D1B52, -3px 0px #0D1B52, 0px 6px #0D1B5238, 3px 3px #0D1B5238, -3px 3px #0D1B5238, inset 0px 3px #ffffff36",
                }}
                onClick={() => onMessageClick(message)}
              >
                <div
                  className={`pixelated-version-badge ${isActive ? "bg-pink" : "bg-pink/70"} text-text-primary flex size-8 items-center justify-center font-bold`}
                  style={{
                    border: "0",
                    boxShadow:
                      "0px 2px #0D1B52, 0px -2px #0D1B52, 2px 0px #0D1B52, -2px 0px #0D1B52, 0px 4px #0D1B5238, 2px 2px #0D1B5238, -2px 2px #0D1B5238, inset 0px 2px #ffffff36",
                  }}
                >
                  V{version}
                </div>
                <div className="flex flex-col gap-0.5 text-left leading-none">
                  <div className="text-text-primary text-sm font-medium leading-none">
                    {toTitleCase(part.filename.name)}{" "}
                    {version !== 1 && `v${version}`}
                  </div>
                  <div className="text-grey text-xs leading-none">
                    {part.filename.name}
                    {version !== 1 && `-v${version}`}
                    {"."}
                    {part.filename.extension}
                  </div>
                </div>
                <div className="ml-auto">
                  <ArrowLeftIcon />
                </div>
              </button>
            </div>
          ) : (
            <div className="my-4">
              <button
                className="pixelated-disabled-button bg-bubblegum/70 inline-flex w-full items-center gap-2 p-1.5"
                style={{
                  border: "0",
                  boxShadow:
                    "0px 3px #0D1B52, 0px -3px #0D1B52, 3px 0px #0D1B52, -3px 0px #0D1B52, 0px 6px #0D1B5238, 3px 3px #0D1B5238, -3px 3px #0D1B5238, inset 0px 3px #ffffff36",
                }}
                disabled
              >
                <div
                  className="pixelated-version-badge bg-bubblegum text-coin-gold flex size-8 items-center justify-center font-bold"
                  style={{
                    border: "0",
                    boxShadow:
                      "0px 2px #0D1B52, 0px -2px #0D1B52, 2px 0px #0D1B52, -2px 0px #0D1B52, 0px 4px #0D1B5238, 2px 2px #0D1B5238, -2px 2px #0D1B5238, inset 0px 2px #ffffff36",
                  }}
                >
                  V{version}
                </div>
                <div className="flex flex-col gap-0.5 text-left leading-none">
                  <div className="text-text-primary text-sm font-medium leading-none">
                    {toTitleCase(part.filename.name)}{" "}
                    {version !== 1 && `v${version}`}
                  </div>
                  <div className="text-xs leading-none text-bubblegumPink">
                    {part.filename.name}
                    {version !== 1 && `-v${version}`}
                    {"."}
                    {part.filename.extension}
                  </div>
                </div>
                <div className="ml-auto">
                  <ArrowLeftIcon />
                </div>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function toTitleCase(rawName: string): string {
  // Split on one or more hyphens or underscores
  const parts = rawName.split(/[-_]+/);

  // Capitalize each part and join them back with spaces
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
