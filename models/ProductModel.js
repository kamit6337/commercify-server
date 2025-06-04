import { Schema, model } from "mongoose";
import Stock from "./StockModel.js";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide title to product"],
    },
    description: {
      type: String,
      required: [true, "Please provide description to product"],
    },
    price: {
      type: Number,
      required: [true, "Price should be provided to product"],
    },
    deliveryCharge: {
      type: Number,
      required: [true, "Delivery Charge should be provided to product"],
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    deliveredBy: {
      type: Number,
      default: null,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    thumbnail: {
      type: String,
      required: [true, "You must provide thumbnail for your product"],
    },
    rate: {
      type: Number,
      default: 0,
    },
    rateCount: {
      type: Number,
      default: 0,
    },
    isReadyToSale: {
      type: Boolean,
      default: true,
    },
    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

productSchema.index({ title: 1, category: 1 });

productSchema.post("save", async (doc, next) => {
  try {
    await Stock.create({
      product: doc._id,
      stock: 0,
    });

    next();
  } catch (error) {
    next("Error in creating stock of new product");
  }
});

const Product = model("Product", productSchema);

export default Product;
