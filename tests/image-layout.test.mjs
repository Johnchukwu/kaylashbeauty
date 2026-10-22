import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("product image wrappers have an explicit height for fill images", async () => {
  const css = await readFile(new URL("src/app/globals.css", root), "utf8");
  assert.match(css, /\.collectionImage\s*\{[^}]*display:\s*block;[^}]*height:\s*[^;]+;/s);
});

test("the app declares its intentional smooth scroll behavior to Next.js", async () => {
  const layout = await readFile(new URL("src/app/layout.tsx", root), "utf8");
  assert.match(layout, /data-scroll-behavior="smooth"/);
});
