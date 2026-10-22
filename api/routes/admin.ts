import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { env } from "../config/env";
import { requireAdmin } from "../middleware/require-admin";
import { Order } from "../models/order";
import { Product } from "../models/product";
import { ShippingSettings } from "../models/shipping-settings";
import { sendDeliveryEmail } from "../services/email";

const upload = multer({
  dest: path.join(process.cwd(), "public", "uploads"),
  limits: { fileSize: 5 * 1024 * 1024 },
});
export const adminRouter = Router();

adminRouter.post("/login", async (request, response) => {
  const { adminEmail, adminPasswordHash, adminJwtSecret } = env;
  if (!adminEmail || !adminPasswordHash || !adminJwtSecret) {
    return response.status(500).json({ message: "Admin login is not configured." });
  }
  const emailMatches = Boolean(adminEmail && request.body.email === adminEmail);
  const passwordMatches = Boolean(
    adminPasswordHash && (await bcrypt.compare(request.body.password, adminPasswordHash)),
  );
  const valid = emailMatches && passwordMatches;

  console.info("Admin login attempt", {
    adminEmailConfigured: Boolean(adminEmail),
    passwordHashConfigured: Boolean(adminPasswordHash),
    jwtSecretConfigured: Boolean(adminJwtSecret),
    emailMatches,
    passwordMatches,
  });

  if (!valid) return response.status(401).json({ message: "Incorrect email or password." });
  response.json({ token: jwt.sign({ email: adminEmail }, adminJwtSecret, { expiresIn: "8h" }) });
});
adminRouter.post("/products", requireAdmin, upload.single("image"), async (request, response) =>
  response.status(201).json(
    await Product.create({
      ...request.body,
      price: Number(request.body.price),
      image: request.file ? `/api/uploads/${request.file.filename}` : request.body.image,
    }),
  ),
);
adminRouter.patch("/products/:id", requireAdmin, async (request, response) =>
  response.json(await Product.findByIdAndUpdate(request.params.id, request.body, { new: true })),
);
adminRouter.delete("/products/:id", requireAdmin, async (request, response) => {
  await Product.findByIdAndDelete(request.params.id);
  response.sendStatus(204);
});
adminRouter.get("/orders", requireAdmin, async (_request, response) =>
  response.json(await Order.find().sort({ createdAt: -1 })),
);
adminRouter.get("/shipping", requireAdmin, async (_request, response) =>
  response.json(
    await ShippingSettings.findOneAndUpdate(
      { key: "shipping" },
      {},
      { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
    ),
  ),
);
adminRouter.put("/shipping", requireAdmin, async (request, response) => {
  const rates = {
    mainland: Number(request.body.mainland),
    island: Number(request.body.island),
    outsideLagos: Number(request.body.outsideLagos),
  };
  if (Object.values(rates).some((rate) => !Number.isFinite(rate) || rate < 0))
    return response.status(400).json({ message: "Delivery prices must be valid amounts." });
  response.json(
    await ShippingSettings.findOneAndUpdate(
      { key: "shipping" },
      { rates },
      { returnDocument: "after", upsert: true },
    ),
  );
});
adminRouter.patch("/orders/:id/delivery", requireAdmin, async (request, response) => {
  const order = await Order.findById(request.params.id);
  if (!order || order.paymentStatus !== "successful")
    return response.status(400).json({ message: "Only paid orders can be sent for delivery." });
  try {
    await sendDeliveryEmail(order.customer, order.reference);
  } catch (error) {
    console.error("Delivery email could not be sent.", error);
    return response
      .status(502)
      .json({ message: "Could not send the delivery email. Check the Gmail app password." });
  }
  order.fulfilmentStatus = "sent-for-delivery";
  await order.save();
  response.json(order);
});
