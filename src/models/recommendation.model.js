// Insight = What happened?

// Data-driven observations, summaries, or patterns.

// Passive → "Here’s what we noticed."

// 🎯 Recommendation = What should I do about it?

// Actionable tips based on those insights.

// Proactive → "Here’s what you can do next."



// // Flexibility:

// One insight can power multiple personalized recommendations.

// You may use insights only for dashboards and recommendations for alerts/cards.

// User Experience:

// You might show insights in an analytics tab and recommendations in a “To-Do” or “Advisor” tab.
import mongoose, { Schema } from "mongoose";

const recommendationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "CREDIT_CARD_USAGE",
        "PAYMENT_REMINDER",
        "LOAN_CONSOLIDATION",
        "CREDIT_SCORE_BOOST",
        "EXPENSE_REDUCTION",
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    actionUrl: {
      type: String, // optional: link to helpful page, blog, or resource
    },
    isDismissed: {
      type: Boolean,
      default: false,
    },
    scoreImpact: {
      type: Number, // optional: potential estimated effect on credit score
    },
  },
  {
    timestamps: true,
  }
);

export const Recommendation = mongoose.model(
  "Recommendation",
  recommendationSchema
);
