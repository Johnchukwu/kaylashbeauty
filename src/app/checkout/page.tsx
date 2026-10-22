"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { CartButton } from "@/components/cart-button";
import { useCart } from "@/components/cart-provider";
import { StoreFooter } from "@/components/store-footer";
import { SocialLinks } from "@/components/social-links";
import { formatNaira } from "@/lib/products";

export default function CheckoutPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryZone, setDeliveryZone] = useState<"mainland" | "island" | "outsideLagos">(
    "mainland",
  );
  const [rates, setRates] = useState({ mainland: 3500, island: 5000, outsideLagos: 7000 });
  const { items, subtotal, clearCart } = useCart();
  useEffect(() => {
    void fetch("/api/shipping")
      .then((response) => (response.ok ? response.json() : null))
      .then((shippingRates) => {
        if (shippingRates) setRates(shippingRates);
      });
  }, []);
  const shipping = items.length ? rates[deliveryZone] : 0;
  const total = subtotal + shipping;
  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPaymentMessage("");
    setIsSubmitting(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: {
          streetAddress: form.get("streetAddress"),
          state: form.get("state"),
          email: form.get("email"),
          fullName: form.get("fullName"),
          phoneNumber: form.get("phoneNumber"),
        },
        items: items.map((item) => ({
          productId: item.slug,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal,
        deliveryZone,
      }),
    });
    const data = await response.json().catch(() => ({
      message: "Payment service is unavailable. Restart npm run dev, then try again.",
    }));
    if (!response.ok) {
      setPaymentMessage(data.message ?? "Unable to start your payment.");
      setIsSubmitting(false);
      return;
    }
    clearCart();
    window.location.assign(data.checkoutUrl);
  };

  return (
    <main>
      <header className="header">
        <SocialLinks />
        <nav
          className={menuOpen ? "navigation navigationOpen" : "navigation"}
          id="primary-navigation"
        >
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <div className="category">
            <button type="button">
              Categories <ChevronDown size={14} />
            </button>
            <div className="categoryMenu">
              <Link href="/collection">Lipgloss Collection</Link>
              <Link href="/lip-care">Lip Care Essentials</Link>
            </div>
          </div>
          <Link className="logo desktopLogo" href="/" aria-label="Kaylash Beauty Place">
            <Image className="logoImage" src="/logo.png" alt="" fill sizes="132px" priority />
          </Link>
          <Link href="/#about">About</Link>
          <a href="#checkoutFooter">Contact</a>
        </nav>
        <Link className="logo mobileLogo" href="/" aria-label="Kaylash Beauty Place">
          <Image className="logoImage" src="/logo.png" alt="" fill sizes="104px" priority />
        </Link>
        <div className="headerActions">
          <CartButton />
          <button
            className="menuButton"
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <section className="checkoutSection pageWidth">
        <form className="shippingForm" id="shipping-form" onSubmit={submitOrder}>
          <h1>Shipping Address</h1>
          <div className="checkoutFields">
            <label className="checkoutField checkoutFieldWide">
              Street address
              <input name="streetAddress" required autoComplete="street-address" />
            </label>
            <label className="checkoutField">
              State
              <input name="state" required autoComplete="address-level1" />
            </label>
            <label className="checkoutField">
              Email
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label className="checkoutField">
              Full name
              <input name="fullName" required autoComplete="name" />
            </label>
            <label className="checkoutField checkoutFieldWide">
              Phone number
              <input name="phoneNumber" type="tel" required autoComplete="tel" />
            </label>
            <label className="checkoutField checkoutFieldWide">
              Delivery location
              <select
                value={deliveryZone}
                onChange={(event) => setDeliveryZone(event.target.value as typeof deliveryZone)}
              >
                <option value="mainland">Lagos Mainland — {formatNaira(rates.mainland)}</option>
                <option value="island">Lagos Island — {formatNaira(rates.island)}</option>
                <option value="outsideLagos">
                  Outside Lagos — {formatNaira(rates.outsideLagos)}
                </option>
              </select>
            </label>
          </div>
        </form>
        <aside className="checkoutSummary">
          <h2>Your Order</h2>
          <div className="checkoutItems">
            {items.length ? (
              items.map((item) => (
                <div className="checkoutItem" key={item.slug}>
                  <div>
                    <Image src={item.image} alt={item.name} fill sizes="42px" />
                  </div>
                  <span>
                    {item.quantity} × {item.name}
                  </span>
                </div>
              ))
            ) : (
              <p>Your cart is empty.</p>
            )}
          </div>
          <div className="checkoutTotals">
            <p>
              <span>Subtotal:</span>
              <strong>{formatNaira(subtotal)}</strong>
            </p>
            <p>
              <span>Delivery:</span>
              <strong>{formatNaira(shipping)}</strong>
            </p>
            <div>
              <span>Total</span>
              <strong>{formatNaira(total)}</strong>
            </div>
          </div>
          <button
            className="placeOrderButton"
            form="shipping-form"
            type="submit"
            disabled={items.length === 0 || isSubmitting}
          >
            {isSubmitting ? "Opening Bachs…" : "Place Order"}
          </button>
          {paymentMessage && <p className="paymentError">{paymentMessage}</p>}
        </aside>
      </section>
      <StoreFooter id="checkoutFooter" />
    </main>
  );
}
