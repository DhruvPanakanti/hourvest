"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

import { deleteThread } from "@/lib/actions/thread.actions";

interface Props {
  threadId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

function DeleteThread({
  threadId,
  currentUserId,
  authorId,
  parentId,
  isComment,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Allow deletion only if the current user is the author
  if (currentUserId !== authorId) return null;

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this thread?");
    
    if (confirmDelete) {
      startTransition(async () => {
        await deleteThread(threadId, pathname);
        
        // Refresh the current page to show updated content
        if (!parentId || !isComment) {
          router.refresh();
        }
      });
    }
  };

  return (
    <Image
      src='/assets/delete.svg'
      alt='delete'
      width={18}
      height={18}
      className={`cursor-pointer object-contain ${isPending ? 'opacity-50' : ''}`}
      onClick={handleDelete}
    />
  );
}

export default DeleteThread;