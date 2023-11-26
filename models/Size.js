import mongoose from "mongoose";

const SizeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    quantity: Number,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
export default mongoose.model("Size", SizeSchema);
