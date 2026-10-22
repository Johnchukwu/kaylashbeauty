import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

test("keeps Express internals outside Vercel's reserved root api directory", () => {
  const rootApiDirectory = new URL("../api/", import.meta.url);

  assert.equal(
    existsSync(rootApiDirectory),
    false,
    "The root api directory is reserved for Vercel Functions and causes each backend file to count toward the Hobby limit.",
  );
});
