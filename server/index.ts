import "dotenv/config";
import crypto from "node:crypto";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import { Product } from "./models/Product.js";

const app = express();
const port = Number(process.env.PORT || 4000);
const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

app.use(cors({ origin: clientUrl, credentials: true }));

app.post("/api/payments/webhook", express.raw({ type: "application/json" }), async (request, response) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return response.status(503).json({ message: "Paystack is not configured" });

  const signature = crypto.createHmac("sha512", secret).update(request.body).digest("hex");
  if (signature !== request.header("x-paystack-signature")) {
    return response.status(401).json({ message: "Invalid webhook signature" });
  }

  const event = JSON.parse(request.body.toString("utf8"));
  if (event.event === "charge.success") {
    console.info("Verified successful Paystack charge", event.data.reference);
    // Persist an Order and trigger a confirmation email here once checkout fields are finalized.
  }
  return response.sendStatus(200);
});

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, service: "kaylash-api" });
});

app.get("/api/products", async (request, response, next) => {
  try {
    const category = typeof request.query.category === "string" ? request.query.category : undefined;
    const products = await Product.find({ active: true, ...(category ? { category } : {}) }).sort({ featured: -1, createdAt: -1 }).lean();
    response.json({ products });
  } catch (error) {
    next(error);
  }
});

app.get("/api/products/:slug", async (request, response, next) => {
  try {
    const product = await Product.findOne({ slug: request.params.slug, active: true }).lean();
    if (!product) return response.status(404).json({ message: "Product not found" });
    return response.json({ product });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/payments/initialize", async (request, response, next) => {
  try {
    const { email, amount, metadata } = request.body;
    if (!email || !Number.isFinite(amount) || amount <= 0) {
      return response.status(400).json({ message: "A valid email and amount are required" });
    }
    if (!process.env.PAYSTACK_SECRET_KEY) {
      return response.status(503).json({ message: "Paystack is not configured" });
    }

    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100),
        callback_url: `${process.env.APP_URL || clientUrl}/checkout/verify`,
        metadata,
      }),
    });

    const payload = await paystackResponse.json();
    return response.status(paystackResponse.ok ? 200 : 400).json(payload);
  } catch (error) {
    return next(error);
  }
});

app.get("/api/payments/verify/:reference", async (request, response, next) => {
  try {
    if (!process.env.PAYSTACK_SECRET_KEY) {
      return response.status(503).json({ message: "Paystack is not configured" });
    }
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(request.params.reference)}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });
    const payload = await paystackResponse.json();
    return response.status(paystackResponse.ok ? 200 : 400).json(payload);
  } catch (error) {
    return next(error);
  }
});

function gmailAuth() {
  const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN } = process.env;
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) return null;
  const auth = new google.auth.OAuth2(GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET);
  auth.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });
  return auth;
}

app.post("/api/email/send", async (request, response, next) => {
  try {
    const auth = gmailAuth();
    if (!auth || !process.env.GMAIL_USER) {
      return response.status(503).json({ message: "Gmail is not configured" });
    }
    const accessToken = await auth.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token || "",
      },
    });

    const { to, subject, text, html } = request.body;
    if (!to || !subject || (!text && !html)) {
      return response.status(400).json({ message: "Recipient, subject and message are required" });
    }
    const result = await transport.sendMail({ from: process.env.GMAIL_USER, to, subject, text, html });
    return response.status(201).json({ messageId: result.messageId });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/email/inbox", async (request, response, next) => {
  try {
    const auth = gmailAuth();
    if (!auth) return response.status(503).json({ message: "Gmail is not configured" });
    const gmail = google.gmail({ version: "v1", auth });
    const maxResults = Math.min(Number(request.query.limit) || 20, 50);
    const list = await gmail.users.messages.list({ userId: "me", maxResults, q: "in:inbox" });
    const messages = await Promise.all(
      (list.data.messages || []).map(async ({ id }) => {
        if (!id) return null;
        const message = await gmail.users.messages.get({ userId: "me", id, format: "metadata", metadataHeaders: ["From", "Subject", "Date"] });
        const headers = Object.fromEntries((message.data.payload?.headers || []).map((header) => [header.name?.toLowerCase(), header.value]));
        return { id, threadId: message.data.threadId, snippet: message.data.snippet, ...headers };
      }),
    );
    return response.json({ messages: messages.filter(Boolean) });
  } catch (error) {
    return next(error);
  }
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error(error);
  response.status(500).json({ message: "An unexpected server error occurred" });
});

async function start() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => console.info(`Kaylash API listening on port ${port}`));
}

start().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
