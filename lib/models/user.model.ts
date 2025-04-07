import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
  id: string;
  username: string;
  name: string;
  bio?: string;
  image?: string;
  skills: string[];
  onboarded: boolean;
  timeBalance: number;
  appealsCreated: Types.ObjectId[];
  appealsAssisted: Types.ObjectId[];
  communities: Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  bio: String,
  image: String,
  skills: [String],
  onboarded: { type: Boolean, default: false },
  timeBalance: { type: Number, default: 0 },
  appealsCreated: [{ type: Schema.Types.ObjectId, ref: "Appeal" }],
  appealsAssisted: [{ type: Schema.Types.ObjectId, ref: "Appeal" }],
  communities: [{ type: Schema.Types.ObjectId, ref: "Community" }]
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);