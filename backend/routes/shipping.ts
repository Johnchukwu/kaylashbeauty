import { Router } from "express";
import { ShippingSettings } from "../models/shipping-settings";
export const shippingRouter = Router();
shippingRouter.get("/", async (_request, response) =>
  response.json(
    (
      await ShippingSettings.findOneAndUpdate(
        { key: "shipping" },
        {},
        { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
      )
    ).rates,
  ),
);
