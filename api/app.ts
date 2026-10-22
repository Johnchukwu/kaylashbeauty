import express from "express";
import path from "path";
import { adminRouter } from "./routes/admin";
import { bachsWebhookRouter } from "./routes/bachs-webhook";
import { checkoutRouter } from "./routes/checkout";
import { productsRouter } from "./routes/products";
import { shippingRouter } from "./routes/shipping";

export function createApi() {
  const api = express();
  api.use("/webhooks/bachs", express.raw({ type: "application/json" }), bachsWebhookRouter);
  api.use(express.json());
  api.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));
  api.use("/admin", adminRouter);
  api.use("/checkout", checkoutRouter);
  api.use("/products", productsRouter);
  api.use("/shipping", shippingRouter);
  return api;
}
