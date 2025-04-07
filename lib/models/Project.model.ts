import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  client: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  budget: {
    type: Number,
    default: 0,
  },
  hourlyRate: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["active", "completed", "on-hold", "canceled"],
    default: "active",
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timeEntries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "TimeEntry",
  }],
}, 
{
  timestamps: true,
});

const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export default Project;