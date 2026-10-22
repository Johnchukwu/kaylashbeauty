import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function read(path) {
  return readFile(new URL(path, root), "utf8");
}

test("customer cart flow has a shared catalog, cart provider, detail route, and cart route", async () => {
  const requiredFiles = [
    "src/lib/products.ts",
    "src/components/cart-provider.tsx",
    "src/components/cart-button.tsx",
    "src/app/products/[slug]/page.tsx",
    "src/app/cart/page.tsx",
  ];

  await Promise.all(requiredFiles.map((path) => access(new URL(path, root))));

  const [catalog, cartProvider, detailPage, cartPage] = await Promise.all([
    read("src/lib/products.ts"),
    read("src/components/cart-provider.tsx"),
    read("src/app/products/[slug]/page.tsx"),
    read("src/app/cart/page.tsx"),
  ]);

  assert.match(catalog, /getProductBySlug/);
  assert.match(cartProvider, /localStorage/);
  assert.match(cartProvider, /addItem/);
  assert.match(detailPage, /Add to cart/);
  assert.match(cartPage, /Order Summary/);
});

test("collection pages route product selection to details and show a cart destination", async () => {
  const [collection, lipCare, productCard] = await Promise.all([
    read("src/app/collection/page.tsx"),
    read("src/app/lip-care/page.tsx"),
    read("src/components/product-card.tsx"),
  ]);

  assert.match(productCard, /\/products\//);
  assert.match(collection, /CartButton/);
  assert.match(lipCare, /CartButton/);
});
