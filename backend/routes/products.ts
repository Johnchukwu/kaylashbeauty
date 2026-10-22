import { Router } from "express";
import { Product } from "../models/product";

export const productsRouter = Router();
productsRouter.get("/", async (_request, response) =>
  response.json(
    await Product.find({ availability: { $ne: "unavailable" } }).sort({ createdAt: -1 }),
  ),
);
productsRouter.get("/:id", async (request, response) => {
  const product = await Product.findOne({
    _id: request.params.id,
    availability: { $ne: "unavailable" },
  });
  if (!product) return response.status(404).json({ message: "Product not found." });
  response.json(product);
});
