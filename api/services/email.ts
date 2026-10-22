import nodemailer from "nodemailer";
import { env } from "../config/env";

type OrderEmailDetails = {
  reference: string;
  customer: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    streetAddress?: string;
    state?: string;
  };
  items: { name?: string; quantity?: number }[];
  total?: number;
};

function createTransporter() {
  if (!env.gmailUser || !env.gmailAppPassword)
    throw new Error("Gmail delivery configuration is missing.");
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: env.gmailUser, pass: env.gmailAppPassword },
  });
}

export async function sendPaidOrderNotification(order: OrderEmailDetails) {
  const transporter = createTransporter();
  const itemSummary = order.items
    .map((item) => `${item.name ?? "Product"} × ${item.quantity ?? 1}`)
    .join(", ");
  await transporter.sendMail({
    from: env.gmailUser,
    to: env.gmailUser,
    subject: `New paid order ${order.reference}`,
    text: [
      "A customer has completed payment.",
      `Order: ${order.reference}`,
      `Customer: ${order.customer.fullName ?? "Not provided"}`,
      `Email: ${order.customer.email ?? "Not provided"}`,
      `Phone: ${order.customer.phoneNumber ?? "Not provided"}`,
      `Delivery address: ${order.customer.streetAddress ?? "Not provided"}, ${order.customer.state ?? ""}`,
      `Items: ${itemSummary || "Not provided"}`,
      `Total: ₦${(order.total ?? 0).toLocaleString("en-NG")}`,
    ].join("\n"),
  });
}

export async function sendDeliveryEmail(
  customer: { fullName?: string; email?: string },
  reference: string,
) {
  if (!customer.email)
    throw new Error("Gmail delivery configuration is missing.");
  const transporter = createTransporter();
  await transporter.sendMail({
    from: env.gmailUser,
    to: customer.email,
    subject: "Your Kaylash Beauty Place order is on its way",
    text: `Hello ${customer.fullName ?? "there"}, your order ${reference} has been sent out for delivery.`,
  });
}
