import { NextRequest, NextResponse } from "next/server";
import Thread from "@/lib/models/thread.model";
import {User} from "@/lib/models/user.model";
import Activity from "@/lib/models/activity.model";
import { connectToDB } from "@/lib/mongoose";

export async function PATCH(request: NextRequest) {
  try {
    const { threadId, userId, status } = await request.json();

    await connectToDB();

    // Find the thread
    const thread = await Thread.findById(threadId);
    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    // Find the user offering assistance
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Find thread author
    const threadAuthor = await User.findById(thread.author);
    if (!threadAuthor) {
      return NextResponse.json(
        { error: "Thread author not found" },
        { status: 404 }
      );
    }

    // Create new activity for assistance request
    const newActivity = new Activity({
      sender: user._id,
      receiver: threadAuthor._id,
      type: "assist_request",
      thread: threadId,
      status: "pending",
    });

    await newActivity.save();

    return NextResponse.json(
      { message: "Assistance offered successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}