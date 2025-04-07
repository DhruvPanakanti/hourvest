import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAppeal extends Document {
  title: string;
  description: string;
  category: string;
  createdBy: Types.ObjectId;
  status: "open" | "closed";
  timeRequired: number;
  skillsRequired: string[];
  assistants: Types.ObjectId[];
}

const AppealSchema = new Schema<IAppeal>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    timeRequired: { type: Number, required: true },
    skillsRequired: [String],
    assistants: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

// Register or reuse the Appeal model.
export const Appeal =
  mongoose.models.Appeal || mongoose.model<IAppeal>("Appeal", AppealSchema);
