"use client";

import ArrowUpIcon from "@/components/icons/arrow-up";
import Spinner from "@/components/spinner";
import assert from "assert";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { createMessage } from "../../actions";
import { type Chat } from "./page";

export default function ChatBox({
  chat,
  onNewStreamPromise,
  isStreaming,
}: {
  chat: Chat;
  onNewStreamPromise: (v: Promise<ReadableStream>) => void;
  isStreaming: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const disabled = isPending || isStreaming;
  const didFocusOnce = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [prompt, setPrompt] = useState("");
  const textareaResizePrompt = prompt
    .split("\n")
    .map((text) => (text === "" ? "a" : text))
    .join("\n");

  useEffect(() => {
    if (!textareaRef.current) return;

    if (!disabled && !didFocusOnce.current) {
      textareaRef.current.focus();
      didFocusOnce.current = true;
    } else {
      didFocusOnce.current = false;
    }
  }, [disabled]);

  return (
    <div className="mx-auto mb-5 flex w-full max-w-prose shrink-0 px-8 font-display">
      <form
        className="relative flex w-full"
        action={async () => {
          startTransition(async () => {
            const message = await createMessage(chat.id, prompt, "user");
            const streamPromise = fetch(
              "/api/get-next-completion-stream-promise",
              {
                method: "POST",
                body: JSON.stringify({
                  messageId: message.id,
                  model: chat.model,
                }),
              },
            ).then((res) => {
              if (!res.body) {
                throw new Error("No body on response");
              }
              return res.body;
            });

            onNewStreamPromise(streamPromise);
            startTransition(() => {
              router.refresh();
              setPrompt("");
            });
          });
        }}
      >
        <fieldset className="w-full" disabled={disabled}>
          <div
            className="pixelated-chat-box relative flex bg-bubblegumPink/70"
            style={{
              border: "0",
              boxShadow:
                "0px 5px #0D1B52, 0px -5px #0D1B52, 5px 0px #0D1B52, -5px 0px #0D1B52, 0px 10px #0D1B5238, 5px 5px #0D1B5238, -5px 5px #0D1B5238, inset 0px 5px #ffffff36",
            }}
          >
            <div className="relative w-full">
              <div className="w-full p-2">
                <p className="invisible min-h-[48px] w-full whitespace-pre-wrap font-body text-plumPurple">
                  {textareaResizePrompt}
                </p>
              </div>
              <textarea
                ref={textareaRef}
                placeholder="Follow up"
                autoFocus={!disabled}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                name="prompt"
                className="peer absolute inset-0 w-full resize-none bg-transparent p-2 font-display text-plumPurple placeholder:text-plumPurple/60 focus:outline-none focus:ring-2 focus:ring-lemonYellow disabled:opacity-50"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    const target = event.target;
                    if (!(target instanceof HTMLTextAreaElement)) return;
                    target.closest("form")?.requestSubmit();
                  }
                }}
              />
            </div>
            <div className="pointer-events-none absolute inset-0 rounded peer-focus:outline peer-focus:outline-offset-0 peer-focus:outline-lemonYellow" />

            <div className="absolute bottom-1.5 right-1.5 flex has-[:disabled]:opacity-50">
              <button
                className="pixelated-chat-button relative inline-flex size-8 items-center justify-center font-heading text-white transition-all duration-200"
                style={{
                  border: "0",
                  backgroundColor: "#A0EBDC", // mint color
                  boxShadow:
                    "0px 3px #0D1B52, 0px -3px #0D1B52, 3px 0px #0D1B52, -3px 0px #0D1B52, 0px 6px #0D1B5238, 3px 3px #0D1B5238, -3px 3px #0D1B5238, inset 0px 3px #ffffff36",
                  cursor: "pointer",
                }}
                type="submit"
              >
                <Spinner loading={disabled}>
                  <ArrowUpIcon className="text-text-primary h-5 w-5" />
                </Spinner>
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
