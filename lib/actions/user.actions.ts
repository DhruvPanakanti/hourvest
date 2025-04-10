"use server";

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

import{Community} from "../models/community.model";
import Thread from "../models/thread.model";
import {User} from "../models/user.model";

import { connectToDB } from "../mongoose";

/**
 * Fetches a user by their userId and populates their communities.
 */
export async function fetchUser(userId: string) {
  try {
    await connectToDB();

    return await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

interface UpdateUserParams {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

/**
 * Updates a user's details and revalidates the specified path if needed.
 */
export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: UpdateUserParams): Promise<void> {
  try {
    await connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

/**
 * Fetches all threads authored by a specific user.
 */
export async function fetchUserPosts(userId: string) {
  try {
    await connectToDB();

    const user = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id",
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id",
          },
        },
      ],
    });

    return user?.threads || [];
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
}

interface FetchUsersParams {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}

/**
 * Fetches a list of users based on search criteria, with pagination and sorting.
 */
export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: FetchUsersParams) {
  try {
    await connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }];
    }

    const sortOptions = { createdAt: sortBy };

    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .exec();

    const totalUsersCount = await User.countDocuments(query);
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

/**
 * Retrieves recent activity (replies) for a user's threads.
 */
export async function getActivity(userId: string) {
  try {
    await connectToDB();

    const userThreads = await Thread.find({ author: userId });

    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, [] as string[]);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error) {
    console.error("Error fetching replies: ", error);
    throw error;
  }
}

/**
 * Fetches all replies made by a specific user.
 */
export async function fetchUserReplies(userId: string) {
  try {
    await connectToDB();

    const user = await User.findOne({ id: userId });
    if (!user) throw new Error("User not found");

    const replies = await Thread.find({
      author: user._id,
      parentId: { $exists: true, $ne: null },
    })
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
        populate: {
          path: "author",
          model: User,
          select: "_id id name image",
        },
      })
      .sort({ createdAt: "desc" });

    return {
      name: user.name,
      image: user.image,
      id: user.id,
      replies: replies,
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch user replies: ${error.message}`);
  }
}

interface FetchSuggestedUsersParams {
  userId: string;
  limit?: number;
}

/**
 * Fetches a list of suggested users, excluding the specified user.
 */
export async function fetchSuggestedUsers({
  userId,
  limit = 5,
}: FetchSuggestedUsersParams) {
  try {
    await connectToDB();

    const users = await User.find({ id: { $ne: userId } })
      .limit(limit)
      .sort({ createdAt: -1 });

    return { users };
  } catch (error) {
    console.error("Error fetching suggested users:", error);
    throw error;
  }
}
