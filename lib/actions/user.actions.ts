"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { User } from "../models/user.model";
import { Community } from "../models/community.model";
import { Appeal } from "../models/Appeal.model"; // Import the registered Appeal model

// Set your MongoDB URI from an environment variable or update this string accordingly.
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/yourdbname";

/**
 * Connects to MongoDB using Mongoose.
 * Checks the built-in connection state to avoid multiple connection attempts.
 */
export async function connectToDB() {
  // mongoose.connection.readyState:
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting.
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
    // This error is usually due to the MongoDB server not running or a wrong URI.
    throw error;
  }
}

/**
 * Fetches a user by their userId and populates their communities and appeals.
 */
export async function fetchUser(userId: string) {
  try {
    await connectToDB();
    return await User.findOne({ id: userId })
      .populate([
        { path: "communities", model: Community, select: "name description" },
        { path: "appealsCreated", model: Appeal, select: "title status" },
        { path: "appealsAssisted", model: Appeal, select: "title status" }
      ]);
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

/**
 * Updates a user's details and revalidates the specified path if needed.
 */
export async function updateUser(params: {
  userId: string;
  username: string;
  name: string;
  bio?: string;
  image?: string;
  skills?: string[];
  path: string;
}): Promise<void> {
  try {
    await connectToDB();
    await User.findOneAndUpdate(
      { id: params.userId },
      {
        username: params.username.toLowerCase(),
        name: params.name,
        bio: params.bio,
        image: params.image,
        skills: params.skills,
        onboarded: true
      },
      { upsert: true }
    );
    if (params.path === "/profile/edit") {
      revalidatePath(params.path);
    }
  } catch (error: any) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
}

/**
 * Fetches a list of suggested users excluding the specified user.
 */
export async function fetchSuggestedUsers(userId: string, limit = 5) {
  try {
    await connectToDB();
    return await User.find({ id: { $ne: userId } })
      .select("id name username image")
      .limit(limit)
      .lean();
  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
}

/**
 * Fetches an overview list of user profiles.
 * You can use the 'limit' and 'skip' parameters for pagination.
 */
export async function fetchUserProfiles(limit = 10, skip = 0) {
  try {
    await connectToDB();
    return await User.find({})
      .select("id name username image bio")
      .limit(limit)
      .skip(skip)
      .lean();
  } catch (error: any) {
    throw new Error(`Failed to fetch user profiles: ${error.message}`);
  }
}
