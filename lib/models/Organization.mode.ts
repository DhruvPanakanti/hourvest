import mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema({
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
  image: {
    type: String,
    default: "",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  }],
  timeEntries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "TimeEntry",
  }],
}, 
{
  timestamps: true,
});

const Organization = mongoose.models.Organization || mongoose.model("Organization", OrganizationSchema);

export default Organization;