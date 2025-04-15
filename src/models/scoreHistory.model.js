// Now think of scoreHistory as the timeline or logbook — every time the score is updated (either through simulations, real data syncs, or imports), a new entry is created. This lets you:

// Show a historical graph of how the score changed over time.

// Let users see how simulations impacted their score.

// Track trends and alerts based on score movements.

// Compare sources (real vs. simulation vs. imported).

// When you’d update both
// Every time you generate a new credit report (real or simulated), you’d:

// Update the creditReport with the latest values.

// Push a new record into scoreHistory for tracking.

import mongoose, { Schema } from "mongoose";

const scoreHistorySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      enum: ["simulation", "real", "imported"],
      default: "simulation",
    },
    notes: {
      type: String,
      trim: true,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const ScoreHistory = mongoose.model("ScoreHistory", scoreHistorySchema);



