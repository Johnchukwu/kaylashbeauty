import { InferSchemaType, Schema, model, models } from "mongoose";

const orderSchema = new Schema(
  {
    reference: { type: String, unique: true, required: true },
    customer: {
      fullName: String,
      email: String,
      phoneNumber: String,
      streetAddress: String,
      state: String,
    },
    items: [{ productId: String, name: String, price: Number, quantity: Number, image: String }],
    subtotal: Number,
    tax: Number,
    total: Number,
    paymentStatus: { type: String, enum: ["pending", "successful", "failed"], default: "pending" },
    fulfilmentStatus: {
      type: String,
      enum: ["not-ready", "sent-for-delivery"],
      default: "not-ready",
    },
    ownerNotificationSentAt: Date,
    bachsCheckoutId: String,
  },
  { timestamps: true },
);

export type OrderDocument = InferSchemaType<typeof orderSchema>;
export const Order = models.Order || model("Order", orderSchema);
