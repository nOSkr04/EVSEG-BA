import mongoose from "mongoose";

const SizeSchema = new mongoose.Schema(
  {
    isRight: {
      type: Boolean,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
export default mongoose.model("Size", SizeSchema);
