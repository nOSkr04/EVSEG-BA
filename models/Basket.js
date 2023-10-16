import mongoose from "mongoose";

const BasketSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    description: String,
    size: [String],
    color: [String],
    available: {
      type: Boolean,
      default: true,
    },
    availableCount: Number,
    image: {
      blurHash: String,
      url: String,
    },
    images: [
      {
        blurHash: String,
        url: String,
      },
    ],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("Basket", BasketSchema);
