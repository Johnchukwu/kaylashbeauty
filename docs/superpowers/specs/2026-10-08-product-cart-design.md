# Product Details and Cart Design

## Goal

Complete the customer shopping flow before the admin backend is built. A customer can open a product, choose a quantity, add it to a cart, see a cart badge, edit the cart, and keep the cart after a browser refresh.

## Scope

- Add a shared cart store for the current Next.js frontend.
- Store cart items in browser storage under one application-owned key.
- Add product-details routes at `/products/[slug]`.
- Add a cart route at `/cart`.
- Update collection and lip-care product cards to open their matching detail page.
- Update every cart icon to show a quantity badge and link to `/cart`.
- Implement the product-details and cart layouts from the supplied references.

## Frontend Architecture

`CartProvider` will be mounted in the root layout and expose a small client-side interface:

- `items`: cart line items.
- `itemCount`: total units, used by the header badge.
- `addItem(product, quantity)`: adds a line or increases an existing line.
- `updateQuantity(slug, quantity)`: changes a line quantity and removes it at zero.
- `removeItem(slug)`: removes a line.
- `subtotal`: derives the total from product prices and quantities.

Product definitions stay in a small frontend catalog for this stage. Each product includes a slug, name, price, description, image, and collection type. The detail page resolves the slug from that catalog and renders a matching product page.

## User Experience

### Product details

- Large product image on the left and product information on the right on desktop.
- Product name, price, concise description, quantity stepper, Add to cart button, and wishlist control.
- Four related products below the main product.
- Mobile layout stacks the content while preserving the same actions.

### Cart

- Each line shows image, name, price, quantity controls, and remove control.
- A cart summary shows subtotal, shipping, tax, and total.
- Checkout is visual only until Paystack and backend checkout are implemented.
- Continue Shopping returns the customer to the collection page.

## Future Express and MongoDB Boundary

The client cart is intentionally local during the user-interface phase. When the Express/MongoDB admin system is introduced:

- Admin-managed product records replace the local frontend catalog.
- Product list and detail views read from the product API.
- The cart store can move from browser storage to authenticated server-side cart records without changing the page interactions.
- Paystack checkout will use the backend to create and verify transactions; it is not included in this UI phase.

## Verification

- Automated checks confirm product routes, cart route, catalog links, cart badge wiring, and cart persistence behavior.
- Run the full test set, lint, and Next.js production build.
