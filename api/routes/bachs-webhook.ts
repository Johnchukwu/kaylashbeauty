import { Router } from "express";
import crypto from "crypto";
import { env } from "../config/env";
import { Order } from "../models/order";
import { sendPaidOrderNotification } from "../services/email";

export const bachsWebhookRouter = Router();
bachsWebhookRouter.post("/", async (request, response) => {
  const signature = request.header("X-Bachs-Signature") ?? "";
  const timestamp = request.header("X-Bachs-Timestamp") ?? "";
  const rawBody = request.body as Buffer;
  const expected = crypto
    .createHmac("sha256", env.bachsWebhookSecret ?? "")
    .update(`${timestamp}.${rawBody.toString()}`, "utf8")
    .digest("hex");
  if (
    !env.bachsWebhookSecret ||
    !timestamp ||
    signature.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    console.warn("Bachs webhook rejected: signature verification failed.");
    return response.status(401).send("Invalid signature");
  }
  const event = JSON.parse(rawBody.toString()) as {
    type?: string;
    data?: {
      metadata?: { order_reference?: string };
      reference?: string;
      checkout_id?: string;
      id?: string;
      checkout?: {
        metadata?: { order_reference?: string };
        reference?: string;
        checkout_id?: string;
        id?: string;
      };
    };
  };
  const reference =
    event.data?.metadata?.order_reference ??
    event.data?.checkout?.metadata?.order_reference ??
    event.data?.reference ??
    event.data?.checkout?.reference;
  const checkoutId =
    event.data?.checkout_id ??
    event.data?.id ??
    event.data?.checkout?.checkout_id ??
    event.data?.checkout?.id;
  const order = await Order.findOne(reference ? { reference } : { bachsCheckoutId: checkoutId });
  if (order) {
    const isSuccessfulPayment =
      event.type === "collection.succeeded" || event.type === "checkout.completed";
    order.paymentStatus = isSuccessfulPayment ? "successful" : "failed";
    await order.save();
    if (isSuccessfulPayment && !order.ownerNotificationSentAt) {
      try {
        await sendPaidOrderNotification(order);
        order.ownerNotificationSentAt = new Date();
        await order.save();
      } catch (error) {
        console.error("Paid order email could not be sent.", error);
      }
    }
  }
  console.info("Bachs webhook processed", { eventType: event.type, orderFound: Boolean(order) });
  response.sendStatus(200);
});
