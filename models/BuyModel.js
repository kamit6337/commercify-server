import mongoose from "mongoose";

const buySchema = new mongoose.Schema({
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
  rating: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rating",
    default: null,
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
  buyPrice: {
    type: Number,
    required: true,
  },
  currency_code: {
    type: String,
    required: true,
    enum: [
      "AUD",
      "BGN",
      "BRL",
      "CAD",
      "CHF",
      "CNY",
      "CZK",
      "DKK",
      "EUR",
      "GBP",
      "HKD",
      "HRK",
      "HUF",
      "IDR",
      "ILS",
      "INR",
      "ISK",
      "JPY",
      "KRW",
      "MXN",
      "MYR",
      "NOK",
      "NZD",
      "PHP",
      "PLN",
      "RON",
      "RUB",
      "SEK",
      "SGD",
      "THB",
      "TRY",
      "USD",
      "ZAR",
    ],
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
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
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

buySchema.index({ id: 1 });

const Buy = mongoose.model("Buy", buySchema);

export default Buy;
