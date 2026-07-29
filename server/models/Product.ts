import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    shade: { type: String, required: true },
    category: { type: String, enum: ["lipgloss", "lip-care"], required: true },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String, required: true }],
    stock: { type: Number, default: 0, min: 0 },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Product = models.Product || model("Product", productSchema);
