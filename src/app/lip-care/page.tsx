"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CartButton } from "@/components/cart-button";
import { StoreFooter } from "@/components/store-footer";
import { SocialLinks } from "@/components/social-links";
import { ProductCard } from "@/components/product-card";
import { fromStoredProduct, type Product } from "@/lib/products";

export default function LipCarePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [lipCareProducts, setLipCareProducts] = useState<Product[]>([]);
  useEffect(() => {
    void fetch("/api/products")
      .then((response) => response.json())
      .then((products) =>
        setLipCareProducts(
          products
            .filter(
              (product: { productCollection: string }) => product.productCollection === "lip-care",
            )
            .map(fromStoredProduct),
        ),
      )
      .catch(() => setLipCareProducts([]));
  }, []);

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
          <div className={categoriesOpen ? "category categoryOpen" : "category"}>
            <button
              type="button"
              aria-expanded={categoriesOpen}
              aria-controls="category-menu"
              onClick={() => setCategoriesOpen((open) => !open)}
            >
              Categories <ChevronDown size={14} />
            </button>
            <div className="categoryMenu" id="category-menu">
              <Link href="/collection" onClick={() => setMenuOpen(false)}>
                Lipgloss Collection
              </Link>
              <Link href="/lip-care" onClick={() => setMenuOpen(false)}>
                Lip Care Essentials
              </Link>
            </div>
          </div>
          <Link className="logo desktopLogo" href="/" aria-label="Kaylash Beauty Place">
            <Image className="logoImage" src="/logo.png" alt="" fill sizes="132px" priority />
          </Link>
          <Link href="/#about" onClick={() => setMenuOpen(false)}>
            About
          </Link>
          <a href="#lipCareFooter" onClick={() => setMenuOpen(false)}>
            Contact
          </a>
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

      <section className="collectionSection">
        <div className="collectionInner pageWidth">
          <h1>Lip Care Essentials</h1>
          <div className="collectionGrid">
            {lipCareProducts.map((product) => (
              <ProductCard product={product} key={product.slug} />
            ))}
          </div>
          {!lipCareProducts.length && (
            <p className="collectionEmpty">No lip care products are available yet.</p>
          )}
        </div>
      </section>

      <StoreFooter id="lipCareFooter" />
    </main>
  );
}
