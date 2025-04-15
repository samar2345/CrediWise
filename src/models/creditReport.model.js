// creditScore is a derived metric from credit reports and activity. Budgeting is user-defined and goal-driven.
import mongoose from "mongoose";

const creditReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  creditScore: {
    type: Number,
    required: true,
  },
  paymentHistory: [
    {
      date: Date,
      status: String,
      amount: Number,
    },
  ],
  creditUtilization: {
    type: Number,
    required: true,
    default: 0,
  },
  creditMix: [
    {
      type: String,
    },
  ],
  newCreditInquiries: [
    {
      type: Date,
    },
  ],
  lengthOfCreditHistory: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, { timestamps: true });

export const CreditReport = mongoose.model("CreditReport", creditReportSchema);
