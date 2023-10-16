import mongoose from "mongoose";

const SavedProductSchema = new mongoose.Schema(
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
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("SavedProduct", SavedProductSchema);
