# Product Details and Cart Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build persistent frontend product details and cart flows for the customer storefront.

**Architecture:** Place reusable product catalog data and a browser-persisted cart context under `src/`. Mount the cart provider in the root layout, then consume it from shared header controls, collection cards, product detail routes, and the cart route. Product and cart interfaces remain frontend-only until Express/MongoDB APIs replace the local catalog and browser cart.

**Tech Stack:** Next.js App Router, React 19, TypeScript, CSS, `localStorage`, `lucide-react`.

**Spec:** `docs/superpowers/specs/2026-10-08-product-cart-design.md`

## Global Constraints

- Use the existing Next.js App Router project structure and `next/link` for internal navigation.
- Persist the user cart in browser storage for this UI phase.
- Do not add backend, authentication, Paystack, or checkout processing in this work.
- Preserve the existing pink storefront styling and responsive mobile navigation.
- Keep product data in a replaceable frontend catalog for later Express/MongoDB integration.

## Review Focus

- Reload after adding items: badge and cart lines restore from browser storage.
- Adding the same product twice: quantity increases instead of creating duplicate lines.
- Reducing a cart line to zero: it is removed and totals update.
- Unknown product slug: route does not render a broken product UI.
- Empty cart: clear empty state displays and checkout is not presented as functional.

---

### Task 1: Product catalog and cart store

**Files:**
- Create: `src/lib/products.ts`
- Create: `src/components/cart-provider.tsx`
- Modify: `src/app/layout.tsx`
- Test: `tests/cart-store.test.mjs`

**Interfaces:**
- Produces `Product`, `CartItem`, `products`, `getProductBySlug(slug)`, and `getRelatedProducts(product, limit)`.
- Produces `CartProvider` and `useCart()` with `items`, `itemCount`, `subtotal`, `addItem`, `updateQuantity`, and `removeItem`.

- [ ] **Step 1: Write failing catalog and cart-store tests**

Test product lookup, duplicate product additions, quantity updates, item count, subtotal, removal at zero, and browser-storage restore using a test storage double.

- [ ] **Step 2: Run the cart-store test to verify it fails**

Run: `node --test tests/cart-store.test.mjs`

Expected: FAIL because the catalog and cart provider do not exist.

- [ ] **Step 3: Implement catalog and `CartProvider`**

Create `Product` data for the current gloss and lip-care lists. Implement the cart operations as pure state updates; load and save the serializable cart array only after client mount.

- [ ] **Step 4: Run cart-store tests to verify they pass**

Run: `node --test tests/cart-store.test.mjs`

Expected: PASS.

- [ ] **Step 5: Mount `CartProvider` in the root layout**

Wrap `children` in `src/app/layout.tsx` so all storefront routes share cart state.

### Task 2: Shared cart badge and product-card navigation

**Files:**
- Create: `src/components/cart-button.tsx`
- Create: `src/components/product-card.tsx`
- Modify: `src/app/collection/page.tsx`
- Modify: `src/app/lip-care/page.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`
- Test: `tests/storefront-navigation.test.mjs`

**Interfaces:**
- Consumes `Product` and `useCart()` from Task 1.
- Produces `CartButton`, which links to `/cart` and renders `itemCount` when nonzero.
- Produces `ProductCard`, which links to `/products/[slug]` and calls `addItem(product, 1)`.

- [ ] **Step 1: Write failing navigation and badge tests**

Assert that collection and lip-care product cards use `/products/` slugs, add-to-cart actions call the shared cart store, and each header uses the cart-button component.

- [ ] **Step 2: Run the navigation test to verify it fails**

Run: `node --test tests/storefront-navigation.test.mjs`

Expected: FAIL because product-card and cart-button components do not exist.

- [ ] **Step 3: Implement `CartButton` and `ProductCard`**

Make the card image/title open the detail route. Keep the add button independent so it adds without navigating. Render the badge only for positive cart counts.

- [ ] **Step 4: Replace existing card and header cart markup**

Use `ProductCard` in both collection pages and `CartButton` in all current headers.

- [ ] **Step 5: Run navigation tests to verify they pass**

Run: `node --test tests/storefront-navigation.test.mjs`

Expected: PASS.

### Task 3: Product detail route

**Files:**
- Create: `src/app/products/[slug]/page.tsx`
- Modify: `src/app/globals.css`
- Test: `tests/product-detail-route.test.mjs`

**Interfaces:**
- Consumes `getProductBySlug`, `getRelatedProducts`, `ProductCard`, and `useCart()`.
- Produces a product-detail view for valid catalog slugs and a not-found result for invalid slugs.

- [ ] **Step 1: Write failing product-detail route tests**

Assert the route resolves a valid slug, renders quantity controls and Add to cart, uses four related products, and handles an invalid slug as not found.

- [ ] **Step 2: Run the product-detail test to verify it fails**

Run: `node --test tests/product-detail-route.test.mjs`

Expected: FAIL because the product detail route does not exist.

- [ ] **Step 3: Implement `/products/[slug]`**

Follow the first supplied reference: image and content side-by-side on desktop, stacked on mobile, quantity limited to integers of one or more, and Add to cart using the selected quantity.

- [ ] **Step 4: Add product-detail styling**

Use the existing collection colors, typography, buttons, responsive breakpoints, and related-product grid.

- [ ] **Step 5: Run product-detail tests to verify they pass**

Run: `node --test tests/product-detail-route.test.mjs`

Expected: PASS.

### Task 4: Cart route and summary

**Files:**
- Create: `src/app/cart/page.tsx`
- Modify: `src/app/globals.css`
- Test: `tests/cart-route.test.mjs`

**Interfaces:**
- Consumes `useCart()` and `CartButton` from Tasks 1 and 2.
- Produces `/cart`, with cart lines, quantity controls, remove action, empty state, and non-functional checkout presentation.

- [ ] **Step 1: Write failing cart-route tests**

Assert that cart lines render image/name/price, the summary is derived from subtotal, quantity and remove controls call shared cart methods, and empty-cart content is rendered when no items exist.

- [ ] **Step 2: Run the cart-route test to verify it fails**

Run: `node --test tests/cart-route.test.mjs`

Expected: FAIL because the cart route does not exist.

- [ ] **Step 3: Implement `/cart`**

Follow the second supplied reference: cart lines at left, summary card at right on desktop, stacking on mobile. Set shipping to Free and show tax as a UI-only calculated placeholder until checkout integration.

- [ ] **Step 4: Add cart styling and Continue Shopping link**

Keep the summary and checkout button visual only; the Continue Shopping link returns to `/collection`.

- [ ] **Step 5: Run cart-route tests to verify they pass**

Run: `node --test tests/cart-route.test.mjs`

Expected: PASS.

### Task 5: Full verification

**Files:**
- Modify: test files only if a cross-route assertion is needed.

**Interfaces:**
- Verifies the final routes `/collection`, `/lip-care`, `/products/[slug]`, and `/cart` together.

- [ ] **Step 1: Run all Node tests**

Run: `node --test tests/*.test.mjs`

Expected: PASS with zero failures.

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Expected: exit code 0.

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: exit code 0 and static routes for `/cart` and product details where applicable.
