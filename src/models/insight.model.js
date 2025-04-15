import mongoose, { Schema } from "mongoose";

const insightSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["SPENDING_TREND", "CATEGORY_BREAKDOWN", "SAVINGS_OPPORTUNITY", "CREDIT_SCORE_IMPACT", "RECURRING_ANALYSIS"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed, // Can contain chart data, computed values, etc.
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Insight = mongoose.model("Insight", insightSchema);
// export default Insight;
