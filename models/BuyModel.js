import mongoose from "mongoose";

const buySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      select: false,
    },
    stripeId: {
      type: String,
      required: true,
      select: false,
    },
    price: {
      type: Number,
      required: true,
    },
    exchangeRate: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredDate: {
      type: Date,
      default: null,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
    reasonForCancelled: {
      type: String,
      default: "",
      trim: true,
    },
    isReturned: {
      type: Boolean,
      default: false,
    },
    reasonForReturned: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Buy = mongoose.model("Buy", buySchema);

export default Buy;
