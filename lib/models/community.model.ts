import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICommunity extends Document {
  name: string;
  description?: string;
  admin: Types.ObjectId;
  members: Types.ObjectId[];
  posts: Types.ObjectId[];
}

const CommunitySchema = new Schema<ICommunity>({
  name: { type: String, required: true, unique: true },
  description: String,
  admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }]
}, { timestamps: true });

export const Community = mongoose.models.Community || 
  mongoose.model<ICommunity>("Community", CommunitySchema);