import { InferSchemaType, Schema, Types, model, models } from "mongoose";
import { JobTypes } from "@/types";

const JobOpeningSchema = new Schema(
  {
    companyLogo: String,
    jobTitle: String,
    companyName: String,
    location: String,
    jobType: {
      type: String,
      enum: Object.values(JobTypes),
    },
    minSalary: Number,
    maxSalary: Number,
    yearlySalary: Number,
    experience: {
      type: String,
      enum: ["Fresher", "1+ Years", "3+ Years", "6+ Years"],
    },
    environment: {
      type: String,
      enum: ["Onsite", "Hybrid", "Remote"],
    },
    applicationDeadline: { type: Date },
    description: String,
  },
  { timestamps: true },
);

export type IJobOpening = InferSchemaType<typeof JobOpeningSchema> & {
  _id: Types.ObjectId | string;
};

export const JobOpening =
  models.JobOpening || model("JobOpening", JobOpeningSchema);
