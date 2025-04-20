'use client'
import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";

import { formatDateString } from "@/lib/utils";
import DeleteThread from "../forms/DeleteThread";
import AcceptThread from "../forms/AcceptThread";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  fullName: string;
  phoneNo: string;
  email: string;
  approvalType: string;
  description: string;
  status?: string;
  acceptedBy?: {
    name: string;
    image: string;
    id: string;
  } | null;
  timePeriod: string;
  rewards: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}

function ThreadCard({
  id,
  currentUserId,
  parentId,
  fullName,
  phoneNo,
  email,
  approvalType,
  description,
  status,
  acceptedBy,
  timePeriod,
  rewards,
  author,
  community,
  createdAt,
  comments,
  isComment,
}: Props) {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      }`}
    >
      <div className='flex items-start justify-between'>
        <div className='flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            <Link href={`/profile/${author.id}`} className='relative h-11 w-11'>
              <Image
                src={author.image}
                alt='user_community_image'
                fill
                className='cursor-pointer rounded-full'
              />
            </Link>

            <div className='thread-card_bar' />
          </div>

          <div className='flex w-full flex-col'>
            <Link href={`/profile/${author.id}`} className='w-fit'>
              <h4 className='cursor-pointer text-base-semibold text-light-1'>
                {author.name}
              </h4>
            </Link>

            {!isComment && (
              <div className="mt-2 space-y-2">
                {/* Always show description, time period, and rewards */}
                {description && (
                  <>
                    <p className="text-small-regular text-light-2">{description}</p>
                  </>
                )}
                {timePeriod && (
                  <div className="text-small-medium text-gray-1">Time Period: <span className="text-light-2">{timePeriod}</span></div>
                )}
                {rewards && (
                  <div className="text-small-medium text-gray-1">Rewards: <span className="text-light-2">{rewards}</span></div>
                )}
                
                {/* Show all details when showDetails is true */}
                {showDetails && (
                  <>
                    {fullName && (
                      <div className="text-small-medium text-gray-1">Full Name: <span className="text-light-2">{fullName}</span></div>
                    )}
                    {phoneNo && (
                      <div className="text-small-medium text-gray-1">Phone: <span className="text-light-2">{phoneNo}</span></div>
                    )}
                    {email && (
                      <div className="text-small-medium text-gray-1">Email: <span className="text-light-2">{email}</span></div>
                    )}
                    {approvalType && (
                      <div className="text-small-medium text-gray-1">Approval Type: <span className="text-light-2 uppercase">{approvalType}</span></div>
                    )}
                    <div className="mt-3 flex items-center gap-3">
                      {/* Status indicator */}
                      {status && (
                        <div
                          className={`text-xs px-2 py-1 rounded-md ${
                            status === "accepted"
                              ? "bg-green-500/20 text-green-400"
                              : status === "rejected"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </div>
                      )}

                      {/* Accepted by information */}
                      {status === "accepted" && acceptedBy && (
                        <div className="flex items-center gap-2 text-xs text-gray-1">
                          <Image
                            src={acceptedBy.image}
                            alt="accepter"
                            width={16}
                            height={16}
                            className="rounded-full"
                          />
                          <span>Accepted by {acceptedBy.name}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {isComment && (
              <p className='mt-2 text-small-regular text-light-2'>{description}</p>
            )}
          </div>
        </div>

        <DeleteThread
          threadId={id.toString()}
          currentUserId={currentUserId}
          authorId={author.id}
          parentId={parentId}
          isComment={isComment}
        />
      </div>

      {/* Bottom section with See More button and comments */}
      <div className="mt-4 flex items-center justify-between">
        {/* Comments section */}
        {!isComment && comments.length > 0 && (
          <div className='flex items-center gap-2'>
            {comments.slice(0, 2).map((comment, index) => (
              <Image
                key={index}
                src={comment.author.image}
                alt={`user_${index}`}
                width={24}
                height={24}
                className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
              />
            ))}

            <Link href={`/thread/${id}`}>
              <p className='text-subtle-medium text-gray-1'>
                {comments.length} repl{comments.length > 1 ? "ies" : "y"}
              </p>
            </Link>
          </div>
        )}
        
        {/* Buttons section */}
        <div className="flex gap-3 ml-auto">
          {/* "See More" button */}
          {!isComment && (
            <button 
              onClick={toggleDetails} 
              className="text-small-medium text-primary-500 hover:underline"
            >
              {showDetails ? "See Less" : "See More"}
            </button>
          )}
          
          {/* Assist button (renamed from Accept) */}
          {!isComment && (
            <div className="ml-2">
              <AcceptThread
                threadId={id.toString()}
                currentUserId={currentUserId}
                authorId={author.id}
                status={status || "pending"}
                acceptedBy={acceptedBy ? acceptedBy.id : null}
                buttonText="Assist"
              />
            </div>
          )}
        </div>
      </div>

      {!isComment && community && (
        <Link
          href={`/communities/${community.id}`}
          className='mt-5 flex items-center'
        >
          <p className='text-subtle-medium text-gray-1'>
            {formatDateString(createdAt)}
            {community && ` - ${community.name} Community`}
          </p>

          <Image
            src={community.image}
            alt={community.name}
            width={14}
            height={14}
            className='ml-1 rounded-full object-cover'
          />
        </Link>
      )}
    </article>
  );
}

export default ThreadCard;