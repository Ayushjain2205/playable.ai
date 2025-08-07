import { notFound } from "next/navigation";
import { cache } from "react";
import { getPrisma } from "@/lib/prisma";
import PageClient from "./page.client";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const chat = await getChatById(id);

  if (!chat) notFound();

  return (
    <div className="bg-softPeach font-body text-plumPurple min-h-screen">
      <PageClient chat={chat} />
    </div>
  );
}

const getChatById = cache(async (id: string) => {
  const prisma = getPrisma();
  return await prisma.chat.findFirst({
    where: { id },
    include: { messages: { orderBy: { position: "asc" } } },
  });
});

export type Chat = NonNullable<Awaited<ReturnType<typeof getChatById>>>;
export type Message = Chat["messages"][number];

export const runtime = "edge";
export const maxDuration = 45;
