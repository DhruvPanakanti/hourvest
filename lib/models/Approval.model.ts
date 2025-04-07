// models/Approval.ts
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IApproval extends Document {
  assistant: Types.ObjectId;
  appeal: Types.ObjectId;
  status: "pending" | "approved" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}

const ApprovalSchema = new Schema<IApproval>({
  assistant: { type: Schema.Types.ObjectId, ref: "User", required: true },
  appeal: { type: Schema.Types.ObjectId, ref: "Appeal", required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true });

export const Approval = mongoose.models.Approval || mongoose.model<IApproval>("Approval", ApprovalSchema);