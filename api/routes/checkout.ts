import { Router } from "express";
import crypto from "crypto";
import { env } from "../config/env";
import { Order } from "../models/order";
import { ShippingSettings } from "../models/shipping-settings";

type CheckoutItem = {
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};
type CheckoutBody = {
  customer: {
    fullName: string;
    email: string;
    phoneNumber: string;
    streetAddress: string;
    state: string;
  };
  items: CheckoutItem[];
  subtotal: number;
  deliveryZone: "mainland" | "island" | "outsideLagos";
};
type BachsCheckoutResponse = { checkout_id: string; checkout_url: string };

export const checkoutRouter = Router();

checkoutRouter.post("/", async (request, response) => {
  const body = request.body as CheckoutBody;
  if (!env.bachsApiKey)
    return response.status(500).json({ message: "Bachs payment is not configured." });
  if (
    !body.customer?.email ||
    !body.customer?.fullName ||
    !body.customer?.phoneNumber ||
    !body.customer?.streetAddress ||
    !body.customer?.state ||
    !body.items?.length ||
    !Number.isFinite(body.subtotal) ||
    body.subtotal <= 0
  )
    return response
      .status(400)
      .json({ message: "Please complete your shipping details and cart." });
  const shippingSettings = await ShippingSettings.findOneAndUpdate(
    { key: "shipping" },
    {},
    { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
  );
  const shipping = shippingSettings.rates[body.deliveryZone];
  if (!Number.isFinite(shipping))
    return response.status(400).json({ message: "Choose a delivery location." });
  const total = body.subtotal + shipping;
  const reference = `KBP-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  const order = await Order.create({
    reference,
    customer: body.customer,
    items: body.items,
    subtotal: body.subtotal,
    tax: 0,
    total,
  });
  const apiBase = env.bachsApiKey.startsWith("sk_sandbox_")
    ? "https://sandbox-api.bachs.io"
    : "https://api.bachs.io";
  const bachsResponse = await fetch(`${apiBase}/v1/checkout-sessions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.bachsApiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      reference,
      customer: {
        email: body.customer.email,
        name: body.customer.fullName,
        phone_number: body.customer.phoneNumber,
      },
      pricing: { currency: "NGN", amount: total.toFixed(2), price_type: "fixed" },
      success_url: `${env.appUrl}/order-confirmation`,
      cancel_url: `${env.appUrl}/cart`,
      metadata: { order_reference: reference },
    }),
  });
  const checkout = (await bachsResponse.json()) as BachsCheckoutResponse & { detail?: string };
  if (!bachsResponse.ok || !checkout.checkout_url) {
    await Order.findByIdAndDelete(order._id);
    return response
      .status(502)
      .json({ message: checkout.detail ?? "Bachs could not create a payment session." });
  }
  order.bachsCheckoutId = checkout.checkout_id;
  await order.save();
  response.status(201).json({ checkoutUrl: checkout.checkout_url, reference });
});
