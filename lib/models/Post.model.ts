// models/Post.ts
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPost extends Document {
  content: string;
  author: Types.ObjectId;
  community: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const PostSchema = new Schema<IPost>({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  community: { type: Schema.Types.ObjectId, ref: "Community", required: true },
}, { timestamps: true });

export const Post = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);