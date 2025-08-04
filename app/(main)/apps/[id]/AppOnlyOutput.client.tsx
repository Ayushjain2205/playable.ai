"use client";
import { extractFirstCodeBlock } from "@/lib/utils";
import dynamic from "next/dynamic";
import type { Message } from "../../chats/[id]/page";
import Image from "next/image";

const CodeRunner = dynamic(() => import("@/components/code-runner"), {
  ssr: false,
});

export default function AppOnlyOutputClient({
  assistantMessage,
}: {
  assistantMessage: Message;
}) {
  const codeBlock = extractFirstCodeBlock(assistantMessage.content);

  if (!codeBlock) {
    return <div>No code block found in the assistant message.</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="pixelated-code-viewer-container h-[80vh] w-full max-w-2xl bg-white p-6 text-base"
        style={{
          boxShadow: `
          0px 4px #0d1b52,
          0px -4px #0d1b52,
          4px 0px #0d1b52,
          -4px 0px #0d1b52
        `,
        }}
      >
        <CodeRunner
          language={codeBlock.language || ""}
          code={codeBlock.code}
          onRequestFix={() => {}}
        />
      </div>
      <Image
        src="/controls.svg"
        alt="Game controls"
        width={512}
        height={200}
        className="mt-2 w-full max-w-2xl"
        priority
      />
    </div>
  );
}
