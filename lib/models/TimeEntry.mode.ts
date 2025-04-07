// models/TimeEntry.ts
import mongoose, { Document, Schema, Types } from "mongoose";

export interface ITimeEntry extends Document {
  user: Types.ObjectId;
  appeal: Types.ObjectId;
  hours: number;
  type: "earned" | "spent";
  status: "pending" | "approved" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}

const TimeEntrySchema = new Schema<ITimeEntry>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  appeal: { type: Schema.Types.ObjectId, ref: "Appeal", required: true },
  hours: { type: Number, required: true },
  type: { type: String, enum: ["earned", "spent"], required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true });

export const TimeEntry = mongoose.models.TimeEntry || mongoose.model<ITimeEntry>("TimeEntry", TimeEntrySchema);