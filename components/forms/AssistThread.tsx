"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { acceptThread } from "@/lib/actions/thread.actions";

interface Props {
  threadId: string;
  currentUserId: string;
  authorId: string;
  status: string;
  acceptedBy: string | null;
  buttonText?: string; // Added custom button text prop
}

function AcceptThread({
  threadId,
  currentUserId,
  authorId,
  status,
  acceptedBy,
  buttonText = "Accept" // Default text is "Accept"
}: Props) {
  const router = useRouter();
  const [isAccepting, setIsAccepting] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isAlreadyAccepted, setIsAlreadyAccepted] = useState(false);

  useEffect(() => {
    setIsAuthor(currentUserId === authorId);
    setIsAlreadyAccepted(status === "accepted" && acceptedBy === currentUserId);
  }, [currentUserId, authorId, status, acceptedBy]);

  const handleAccept = async () => {
    if (isAuthor) return; // Author can't accept their own thread
    if (isAlreadyAccepted) return; // Already accepted by this user
    if (status === "accepted" && acceptedBy !== null) return; // Already accepted by someone else

    setIsAccepting(true);

    try {
      await acceptThread(threadId, currentUserId);
      router.refresh();
    } catch (error) {
      console.error("Error accepting thread:", error);
    } finally {
      setIsAccepting(false);
    }
  };

  // Don't show the button if user is the author or if thread is already accepted by someone else
  if (isAuthor || (status === "accepted" && acceptedBy !== null && acceptedBy !== currentUserId)) {
    return null;
  }

  return (
    <button
      onClick={handleAccept}
      disabled={isAccepting || isAlreadyAccepted}
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        isAlreadyAccepted
          ? "bg-green-500/20 text-green-400 cursor-default"
          : "bg-primary-500 text-white hover:bg-primary-600"
      }`}
    >
      {isAccepting 
        ? "Processing..." 
        : isAlreadyAccepted 
          ? "Accepted" 
          : buttonText
      }
    </button>
  );
}

export default AcceptThread;