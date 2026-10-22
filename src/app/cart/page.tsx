"use client";

import { ChevronDown, Menu, Minus, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CartButton } from "@/components/cart-button";
import { useCart } from "@/components/cart-provider";
import { StoreFooter } from "@/components/store-footer";
import { SocialLinks } from "@/components/social-links";
import { formatNaira } from "@/lib/products";

export default function CartPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const tax = items.length ? 1000 : 0;
  const total = subtotal + tax;

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
          <a href="#cartFooter">Contact</a>
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

      <section className="cartSection pageWidth">
        <div className="cartLines">
          <h1>Your cart</h1>
          {items.length === 0 ? (
            <div className="emptyCart">
              <p>Your cart is empty.</p>
              <Link href="/collection">Continue Shopping</Link>
            </div>
          ) : (
            items.map((item) => (
              <article className="cartLine" key={item.slug}>
                <div className="cartImage">
                  <Image src={item.image} alt={item.name} fill sizes="72px" />
                </div>
                <h2>{item.name}</h2>
                <strong>{formatNaira(item.price)}</strong>
                <div className="quantityControl">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                    aria-label={`Decrease ${item.name} quantity`}
                  >
                    <Minus size={13} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                    aria-label={`Increase ${item.name} quantity`}
                  >
                    <Plus size={13} />
                  </button>
                </div>
                <button
                  className="removeItem"
                  type="button"
                  onClick={() => removeItem(item.slug)}
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 size={15} />
                </button>
              </article>
            ))
          )}
        </div>
        <aside className="orderSummary">
          <h2>Order Summary</h2>
          <p>
            <span>Subtotal</span>
            <strong>{formatNaira(subtotal)}</strong>
          </p>
          <p>
            <span>Shipping:</span>
            <strong>Free</strong>
          </p>
          <p>
            <span>Tax:</span>
            <strong>{formatNaira(tax)}</strong>
          </p>
          <div className="summaryTotal">
            <span>Total</span>
            <strong>{formatNaira(total)}</strong>
          </div>
          {items.length ? (
            <Link className="checkoutButton" href="/checkout">
              Checkout
            </Link>
          ) : (
            <button type="button" disabled>
              Checkout
            </button>
          )}
          <Link href="/collection">Continue Shopping</Link>
        </aside>
      </section>

      <StoreFooter id="cartFooter" />
    </main>
  );
}
