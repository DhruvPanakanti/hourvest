"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";
import { serializeThread } from "../utils/thread.utils";
import {User} from "../models/user.model";
import Thread from "../models/thread.model";
import {Community} from "../models/community.model";

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;

  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });

  const totalPostsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}


interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string,
}

export async function createThread({ text, author, communityId, path }: Params
) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdThread = await Thread.create({
      text,
      author,
      community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
      likes: [], // Initialize empty likes array for new threads
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdThread._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

async function fetchAllChildThreads(threadId: string): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}

export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the thread to be deleted (the main thread)
    const mainThread = await Thread.findById(id).populate("author community");

    if (!mainThread) {
      throw new Error("Thread not found");
    }

    // Fetch all child threads and their descendants recursively
    const descendantThreads = await fetchAllChildThreads(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child threads and their descendants
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}


export async function fetchThreadById(threadId: string) {
  connectToDB();

  try {
    const thread = await Thread.findById(threadId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .lean() // Convert to plain JavaScript object
      .exec();

    if (!thread) {
      throw new Error("Thread not found");
    }

    // Serialize the thread
    return serializeThread(thread);
  } catch (err) {
    console.error("Error while fetching thread:", err);
    throw new Error("Unable to fetch thread");
  }
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    // Find the original thread by its ID
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    // Create the new comment thread
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId, // Set the parentId to the original thread's ID
      likes: [], // Initialize empty likes array for new comments
    });

    // Save the comment thread to the database
    const savedCommentThread = await commentThread.save();

    // Add the comment thread's ID to the original thread's children array
    originalThread.children.push(savedCommentThread._id);

    // Save the updated original thread to the database
    await originalThread.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}

// New function to like a thread
export async function likeThread(threadId: string, userId: string) {
  try {
    connectToDB();

    // Find the thread and check if the user already liked it
    const thread = await Thread.findById(threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }

    // Add the userId to the likes array if not already there
    if (!thread.likes.includes(userId)) {
      thread.likes.push(userId);
      await thread.save();
    }

    // Return a plain object (not a Mongoose document)
    return { success: true };
  } catch (error: any) {
    console.error(`Failed to like thread: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// New function to unlike a thread
export async function unlikeThread(threadId: string, userId: string) {
  try {
    connectToDB();

    // Find the thread
    const thread = await Thread.findById(threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }

    // Remove the userId from the likes array
    thread.likes = thread.likes.filter((id: string) => id !== userId);
    await thread.save();

    // Return a plain object (not a Mongoose document)
    return { success: true };
  } catch (error: any) {
    console.error(`Failed to unlike thread: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// New function to check if a user has liked a thread
export async function hasUserLikedThread(threadId: string, userId: string) {
  try {
    connectToDB();

    const thread = await Thread.findById(threadId);
    if (!thread) {
      return false;
    }

    return thread.likes.includes(userId);
  } catch (error) {
    console.error("Error checking if user liked thread:", error);
    return false;
  }
}

// New function to get likes count for a thread
export async function getThreadLikesCount(threadId: string) {
  try {
    connectToDB();

    const thread = await Thread.findById(threadId);
    if (!thread) {
      return 0;
    }

    return thread.likes.length;
  } catch (error) {
    console.error("Error getting thread likes count:", error);
    return 0;
  }
}

// New function to repost a thread
export async function repostThread(threadId: string, userId: string) {
  try {
    connectToDB();

    // Find the thread and check if the user already reposted it
    const thread = await Thread.findById(threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }

    // Initialize reposts array if it doesn't exist
    if (!thread.reposts) {
      thread.reposts = [];
    }

    // Add the userId to the reposts array if not already there
    if (!thread.reposts.includes(userId)) {
      thread.reposts.push(userId);
      await thread.save();
    }

    // Return a plain object (not a Mongoose document)
    return { success: true };
  } catch (error: any) {
    console.error(`Failed to repost thread: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// New function to unrepost a thread
export async function unrepostThread(threadId: string, userId: string) {
  try {
    connectToDB();

    // Find the thread
    const thread = await Thread.findById(threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }

    // Remove the userId from the reposts array if it exists
    if (thread.reposts) {
      thread.reposts = thread.reposts.filter((id: string) => id !== userId);
      await thread.save();
    }

    // Return a plain object (not a Mongoose document)
    return { success: true };
  } catch (error: any) {
    console.error(`Failed to unrepost thread: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// New function to check if a user has reposted a thread
export async function hasUserRepostedThread(threadId: string, userId: string) {
  try {
    connectToDB();

    const thread = await Thread.findById(threadId);
    if (!thread || !thread.reposts) {
      return false;
    }

    return thread.reposts.includes(userId);
  } catch (error) {
    console.error("Error checking if user reposted thread:", error);
    return false;
  }
}

// New function to get reposts count for a thread
export async function getThreadRepostsCount(threadId: string) {
  try {
    connectToDB();

    const thread = await Thread.findById(threadId);
    if (!thread || !thread.reposts) {
      return 0;
    }

    return thread.reposts.length;
  } catch (error) {
    console.error("Error getting thread reposts count:", error);
    return 0;
  }
}

// Function to update a thread
export async function updateThread({
  threadId,
  text,
  path,
}: {
  threadId: string;
  text: string;
  path: string;
}) {
  try {
    connectToDB();

    // Find and update the thread
    const updatedThread = await Thread.findByIdAndUpdate(
      threadId,
      { text },
      { new: true } // Return the updated document
    );

    if (!updatedThread) {
      throw new Error("Thread not found");
    }

    revalidatePath(path);
    
    return JSON.parse(JSON.stringify(updatedThread));
  } catch (error: any) {
    console.error(`Failed to update thread: ${error.message}`);
    throw new Error(`Failed to update thread: ${error.message}`);
  }
}

