"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";
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
      select: "_id id name image"
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

// Other functions remain the same
export async function deleteThread(id: string, path: string): Promise<void> {
  // Implementation unchanged
}

export async function fetchThreadById(threadId: string) {
  // Implementation unchanged
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  // Implementation unchanged
}