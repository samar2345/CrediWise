import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "credit", "debit", "upi", "bank_transfer", "other"],
      default: "other",
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPayment: {
      type: Schema.Types.ObjectId,
      ref: "RecurringPayment",
      default: null,
    },
  },
  { timestamps: true }
);

export const Expense = mongoose.model("Expense", expenseSchema);
