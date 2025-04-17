"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";
import {User} from "../models/user.model";
import Thread from "../models/thread.model";
import {Community} from "../models/community.model";
import Activity from "../models/activity.model";

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
      select: "_id id name image"  // Include both MongoDB ObjectId and Clerk ID
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "acceptedBy",
      model: User,
      select: "_id id name image"  // Include both MongoDB ObjectId and Clerk ID
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
  fullName: string,
  phoneNo: string,
  email: string,
  approvalType: "online" | "offline",
  description: string,
  timePeriod: string,
  rewards: string,
  author: string,
  communityId: string | null,
  path: string,
}

export async function createThread({ 
  fullName, 
  phoneNo, 
  email, 
  approvalType, 
  description, 
  timePeriod, 
  rewards, 
  author, 
  communityId, 
  path 
}: Params) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdThread = await Thread.create({
      fullName,
      phoneNo,
      email,
      approvalType,
      description,
      timePeriod,
      rewards,
      author,
      community: communityIdObject,
      likes: [],
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    if (communityIdObject) {
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdThread._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}


export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    const mainThread = await Thread.findById(id).populate("author community");

    if (!mainThread) {
      throw new Error("Thread not found");
    }

    await Thread.deleteOne({ _id: id });

    if (mainThread.author) {
      await User.findByIdAndUpdate(mainThread.author._id, {
        $pull: { threads: id },
      });
    }

    if (mainThread.community) {
      await Community.findByIdAndUpdate(mainThread.community._id, {
        $pull: { threads: id },
      });
    }

    if (mainThread.parentId) {
      await Thread.findByIdAndUpdate(mainThread.parentId, {
        $pull: { children: id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}



export async function acceptThread(threadId: string, clerkUserId: string) {
  try {
    connectToDB();

    // First, find the MongoDB user record using the Clerk ID
    const acceptingUser = await User.findOne({ id: clerkUserId });
    
    if (!acceptingUser) {
      throw new Error("User not found");
    }

    const thread = await Thread.findById(threadId).populate('author');
    
    if (!thread) {
      throw new Error("Thread not found");
    }

    if (thread.status !== "pending") {
      throw new Error("Thread is not in pending status");
    }

    // Make sure the accepting user is not the thread author
    if (thread.author.id === clerkUserId) {
      throw new Error("Cannot accept your own thread");
    }

    // Update thread status using MongoDB ObjectId
    await Thread.findByIdAndUpdate(threadId, {
      status: "accepted",
      acceptedBy: acceptingUser._id,  // Using MongoDB ObjectId
      acceptedAt: new Date(),
    });

    // Create activity notification
    await Activity.create({
      type: "accept",
      user: thread.author._id,  // The user who will receive the notification (MongoDB ObjectId)
      sender: acceptingUser._id,  // The user who accepted the thread (MongoDB ObjectId)
      thread: threadId,
    });

    // Update the acceptingUser's appealsAssisted array
    await User.findByIdAndUpdate(acceptingUser._id, {
      $push: { appealsAssisted: threadId }
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(`Failed to accept thread: ${error.message}`);
  }
}

export async function fetchUserActivity(mongoUserId: string) {
  try {
    connectToDB();

    // Find all activity records for this user
    const activities = await Activity.find({ user: mongoUserId })
      .populate({
        path: "sender",
        model: User,
        select: "_id id name image",  // Include both MongoDB ObjectId and Clerk ID
      })
      .populate({
        path: "thread",
        model: Thread,
        select: "_id fullName",  // Select necessary fields
      })
      .sort({ createdAt: "desc" })
      .exec();

    return activities;
  } catch (error: any) {
    console.error("Error fetching user activity:", error);
    throw new Error(`Failed to fetch user activity: ${error.message}`);
  }
}