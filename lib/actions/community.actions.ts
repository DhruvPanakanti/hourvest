"use server";
import {Community }from "../models/community.model";
import { connectToDB } from "../mongoose";

export async function fetchPopularCommunities(limit = 5) {
  try {
    await connectToDB();
    return await Community.find()
      .populate({
        path: "members",
        model: "User",
        select: "name image"
      })
      .sort({ members: -1 })
      .limit(limit)
      .lean();
  } catch (error: any) {
    throw new Error(`Failed to fetch communities: ${error.message}`);
  }
}