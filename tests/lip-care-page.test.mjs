import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("Lip Care Essentials has its own route", async () => {
  const pageUrl = new URL("src/app/lip-care/page.tsx", projectRoot);
  await access(pageUrl);
  const page = await readFile(pageUrl, "utf8");

  assert.match(page, /Lip Care Essentials/);
  assert.match(page, /collectionGrid/);
});

test("all category links route to the Lip Care Essentials page", async () => {
  const [home, collection] = await Promise.all([
    readFile(new URL("src/app/page.tsx", projectRoot), "utf8"),
    readFile(new URL("src/app/collection/page.tsx", projectRoot), "utf8"),
  ]);

  assert.match(home, /href="\/lip-care"/);
  assert.match(collection, /href="\/lip-care"/);
});
