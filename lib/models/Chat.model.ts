// models/Chat.ts
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMessage extends Document {
  sender: Types.ObjectId;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const MessageSchema = new Schema<IMessage>({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
}, { timestamps: true });

export interface IChat extends Document {
  participants: Types.ObjectId[];
  messages: IMessage[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ChatSchema = new Schema<IChat>({
  participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  messages: [MessageSchema],
}, { timestamps: true });

export const Chat = mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);