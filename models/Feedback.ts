import mongoose, { Schema, models } from "mongoose";

const FeedbackSchema = new Schema(
  {
    company: {
      type: String,
      required: true,
    },

    customer: {
      type: String,
      required: true,
    },

    feedback: {
      type: String,
      required: true,
    },

    sentiment: {
      type: String,
      enum: ["Positive", "Negative", "Neutral"],
      default: "Neutral",
    },

    status: {
      type: String,
      enum: ["Open", "Closed", "Review"],
      default: "Open",
    },

    userEmail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Feedback =
  models.Feedback || mongoose.model("Feedback", FeedbackSchema);

export default Feedback;