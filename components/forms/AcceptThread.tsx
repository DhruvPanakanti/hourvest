"use client";

import Image from "next/image";
import { useTransition } from "react";
import { acceptThread } from "@/lib/actions/thread.actions";
import { useRouter } from "next/navigation";

interface Props {
  threadId: string;
  currentUserId: string;  // This is Clerk ID
  authorId: string;       // This is Clerk ID
  status: string;
  acceptedBy: string | null;  // This is Clerk ID
}

function AcceptThread({ threadId, currentUserId, authorId, status, acceptedBy }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Don't show accept button if:
  // 1. Current user is the author
  // 2. Thread is already accepted
  // 3. Thread is rejected
  if (currentUserId === authorId || status !== "pending") {
    return null;
  }

  const handleAccept = () => {
    startTransition(async () => {
      await acceptThread(threadId, currentUserId);
      router.refresh();
    });
  };

  return (
    <button
      className={`flex items-center gap-1 bg-green-500 px-3 py-1 rounded-md text-light-1 text-xs ${
        isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
      }`}
      onClick={handleAccept}
      disabled={isPending}
    >
      <Image src="/assets/check.svg" alt="accept" width={14} height={14} />
      Accept
    </button>
  );
}

export default AcceptThread;