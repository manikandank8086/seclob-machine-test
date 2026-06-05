import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  ram: { type: String, required: true },
  price: { type: String, required: true },
  qty: { type: Number, required: true, default: 1 },
});
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    subCategory: { type: String, required: true },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      default: null,
    },

    description: { type: String, required: true },

    variants: [variantSchema],

    images: {
      type: [String],
      required: true,
    },
     /* WISHLIST */
    wishlist: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);