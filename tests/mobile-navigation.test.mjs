import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");
const mobileRules = css.slice(css.indexOf("@media (max-width: 900px)"));

test("mobile navigation keeps the hamburger visible above the dropdown", () => {
  assert.match(
    mobileRules,
    /\.menuButton\s*\{[^}]*display:\s*grid\s*!important;[^}]*visibility:\s*visible;[^}]*opacity:\s*1;[^}]*position:\s*relative;[^}]*z-index:\s*\d+;/s,
  );
});

test("mobile header actions stay in the right grid column beside the centered logo", () => {
  assert.match(mobileRules, /\.headerActions\s*\{[^}]*grid-column:\s*3;[^}]*justify-self:\s*end;/s);
});

test("closed mobile navigation cannot intercept taps and open navigation can", () => {
  assert.match(mobileRules, /\.navigation\s*\{[^}]*pointer-events:\s*none;/s);
  assert.match(mobileRules, /\.navigationOpen\s*\{[^}]*pointer-events:\s*auto;/s);
});

test("mobile category options are visible as soon as the hamburger menu opens", () => {
  assert.match(
    mobileRules,
    /\.categoryMenu\s*\{[^}]*display:\s*grid;[^}]*opacity:\s*1;[^}]*visibility:\s*visible;/s,
  );
});

test("mobile category links reset desktop positioning and span the full dropdown", () => {
  assert.match(mobileRules, /\.category\s*\{[^}]*width:\s*100%;/s);
  assert.match(
    mobileRules,
    /\.categoryMenu\s*\{[^}]*top:\s*auto;[^}]*left:\s*auto;[^}]*width:\s*100%;[^}]*padding:\s*0;/s,
  );
  assert.match(
    mobileRules,
    /\.category:hover\s+\.categoryMenu,\s*\.category:focus-within\s+\.categoryMenu\s*\{[^}]*transform:\s*none;/s,
  );
});
