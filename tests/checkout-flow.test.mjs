import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("cart checkout links to the shipping details page", () => {
  assert.match(read("src/app/cart/page.tsx"), /href="\/checkout"/);
});

test("checkout collects the required customer details", () => {
  const page = read("src/app/checkout/page.tsx");
  for (const label of ["Full name", "Phone number", "Street address", "Email", "Place Order"]) {
    assert.match(page, new RegExp(label));
  }
});

test("checkout clears the cart only after Bachs creates a payment session", () => {
  const page = read("src/app/checkout/page.tsx");
  const provider = read("src/components/cart-provider.tsx");

  assert.match(provider, /clearCart: \(\) => void/);
  assert.match(page, /const \{ items, subtotal, clearCart \} = useCart\(\)/);
  assert.match(page, /clearCart\(\);\s*window\.location\.assign\(data\.checkoutUrl\)/);
});

test("store footer exposes the requested social and contact links", () => {
  const footer = read("src/components/store-footer.tsx");
  const socialLinks = read("src/components/social-links.tsx");
  assert.match(socialLinks, /instagram\.com\/kaylashbeautyplace/);
  assert.match(socialLinks, /tiktok\.com\/@kaylashbeautyplace/);
  assert.match(footer, /\+23409011303399/);
  assert.match(footer, /chidalumbakwe2003@gmail\.com/);
});
