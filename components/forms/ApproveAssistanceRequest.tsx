"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface Props {
  activityId: string;
  threadId: string;
  currentUserId: string;
  senderId: string;
  action: "approve" | "decline";
}

function ApproveAssistanceRequest({
  activityId,
  threadId,
  currentUserId,
  senderId,
  action,
}: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = async () => {
    if (!threadId) {
      toast.error("Thread not found");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/assistance/respond", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activityId,
          threadId,
          currentUserId,
          senderId,
          action,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} assistance request`);
      }

      toast.success(`Assistance request ${action === "approve" ? "approved" : "declined"}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      onClick={handleAction}
      className={`rounded-md px-3 py-1.5 text-xs ${
        action === "approve"
          ? "bg-primary-500 text-light-1"
          : "bg-red-500/20 text-red-400"
      } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={isSubmitting}
    >
      {isSubmitting ? `${action === "approve" ? "Approving..." : "Declining..."}` : action === "approve" ? "Approve" : "Decline"}
    </button>
  );
}

export default ApproveAssistanceRequest;