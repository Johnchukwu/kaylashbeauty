import { InferSchemaType, Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    productCollection: { type: String, enum: ["lipgloss", "lip-care"], required: true },
    availability: {
      type: String,
      enum: ["available", "sold-out", "unavailable"],
      default: "available",
    },
  },
  { timestamps: true },
);

export type ProductDocument = InferSchemaType<typeof productSchema>;
export const Product = models.Product || model("Product", productSchema);
