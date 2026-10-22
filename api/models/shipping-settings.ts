import { Schema, model, models } from "mongoose";

const schema = new Schema({
  key: { type: String, default: "shipping", unique: true },
  rates: {
    mainland: { type: Number, default: 3500 },
    island: { type: Number, default: 5000 },
    outsideLagos: { type: Number, default: 7000 },
  },
});
export const ShippingSettings = models.ShippingSettings || model("ShippingSettings", schema);
