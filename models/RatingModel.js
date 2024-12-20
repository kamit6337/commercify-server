import { Schema, model } from "mongoose";

const ratingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    rate: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
    title: {
      type: String,
      default: null,
      trim: true,
      maxLength: [100, "Max character for Title is 100 words"],
    },
    comment: {
      type: String,
      default: null,
      trim: true,
      maxLength: [1000, "max character for Comment is 1000 words"],
    },
  },
  {
    timestamps: true,
  }
);

ratingSchema.pre("save", function (next) {
  if (!this.title && !this.comment) {
    return next();
  }

  if (this.title && this.comment) {
    return next();
  }

  next("Error in creating Rating. Either title or comment is missing");
});

const Rating = model("Rating", ratingSchema);

export default Rating;
