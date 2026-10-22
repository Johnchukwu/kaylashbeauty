import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("Bachs webhook verification signs the timestamp and unchanged raw body", () => {
  const source = readFileSync(
    new URL("../backend/routes/bachs-webhook.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /X-Bachs-Timestamp/);
  assert.match(source, /\$\{timestamp\}\.\$\{rawBody\.toString\(\)\}/);
});

test("confirmed payments notify the owner and delivery is marked only after customer email sends", () => {
  const webhook = readFileSync(
    new URL("../backend/routes/bachs-webhook.ts", import.meta.url),
    "utf8",
  );
  const admin = readFileSync(new URL("../backend/routes/admin.ts", import.meta.url), "utf8");
  const email = readFileSync(new URL("../backend/services/email.ts", import.meta.url), "utf8");

  assert.match(webhook, /sendPaidOrderNotification\(order\)/);
  assert.match(email, /sendPaidOrderNotification/);
  assert.match(
    admin,
    /await sendDeliveryEmail\(order\.customer, order\.reference\);[\s\S]*order\.fulfilmentStatus = "sent-for-delivery"/,
  );
});

test("admin separates waiting orders from orders already sent for delivery", () => {
  const adminPage = readFileSync(new URL("../src/app/admin/page.tsx", import.meta.url), "utf8");

  assert.match(adminPage, /const customerOrders = orders\.filter\(/);
  assert.match(adminPage, /const sentOrders = orders\.filter\(/);
  assert.match(adminPage, /<h2>Orders sent<\/h2>/);
  assert.match(adminPage, /sentOrders\.map/);
});

test("admin delivery action shows a visible result when the request fails", () => {
  const adminPage = readFileSync(new URL("../src/app/admin/page.tsx", import.meta.url), "utf8");

  assert.match(adminPage, /const \[sendingOrderId, setSendingOrderId\] = useState/);
  assert.match(adminPage, /Could not send delivery email\. Please try again\./);
  assert.match(adminPage, /type="button"/);
});

test("delivery email failures return a safe message instead of an SMTP stack trace", () => {
  const admin = readFileSync(new URL("../backend/routes/admin.ts", import.meta.url), "utf8");

  assert.match(admin, /Could not send the delivery email\. Check the Gmail app password\./);
  assert.match(admin, /return response\s*\.status\(502\)\s*\.json/);
});
