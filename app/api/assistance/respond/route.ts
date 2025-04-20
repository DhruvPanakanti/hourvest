import { NextRequest, NextResponse } from "next/server";

import Thread from "@/lib/models/thread.model";
import {User} from "@/lib/models/user.model";
import Activity from "@/lib/models/activity.model";
import { connectToDB } from "@/lib/mongoose";

export async function PATCH(request: NextRequest) {
  try {
    const { activityId, threadId, currentUserId, senderId, action } = await request.json();

    await connectToDB();

    // Find the activity and update its status
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    activity.status = action === "approve" ? "approved" : "declined";
    await activity.save();

    // Find the thread
    const thread = await Thread.findById(threadId);
    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    // Find the assistant user
    const assistantUser = await User.findById(senderId);
    if (!assistantUser) {
      return NextResponse.json(
        { error: "Assistant user not found" },
        { status: 404 }
      );
    }

    if (action === "approve") {
      // Update thread with the assistant's information
      if (!thread.assistedBy) {
        thread.assistedBy = [];
      }
      
      // Check if user is already in assistedBy array
      const alreadyAssisted = thread.assistedBy.some(
        (assistant: any) => assistant.toString() === senderId
      );
      
      if (!alreadyAssisted) {
        thread.assistedBy.push(senderId);
        thread.status = "accepted";
        await thread.save();
      }
    }

    // Create new activity to notify the assistant
    const newActivity = new Activity({
      sender: currentUserId,
      receiver: senderId,
      type: action === "approve" ? "assist_approved" : "assist_declined",
      thread: threadId,
    });

    await newActivity.save();

    return NextResponse.json(
      { message: `Assistance request ${action}d successfully` },
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