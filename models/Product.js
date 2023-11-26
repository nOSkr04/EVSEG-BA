import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    parent: String,
    name: String,
    price: Number,
    description: String,
    size: [{
      name: String,
      quantity: Number
    }],
    color: String,
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
    subCategory: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: String,
    SKU: Number,
    barCode: String,
    season: String,
    cleanUp: String,
    material: String,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("Product", ProductSchema);
