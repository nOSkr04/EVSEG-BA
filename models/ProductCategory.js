import mongoose from "mongoose";

const ProductCategorySchema = new mongoose.Schema(
  {
    name: String,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("ProductCategory", ProductCategorySchema);
