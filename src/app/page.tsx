"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { CartButton } from "@/components/cart-button";
import { SocialLinks } from "@/components/social-links";

const shadeProducts = [
  {
    name: "Clear Gloss",
    price: "₦6,500",
    image:
      "https://images.unsplash.com/photo-1631214524115-9942bf927d4a?auto=format&fit=crop&q=85&w=1000",
  },
  {
    name: "Choco Gloss",
    price: "₦7,200",
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=85&w=1000",
  },
  {
    name: "Hot Pink Gloss",
    price: "₦7,000",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=85&w=1000",
  },
  {
    name: "Light Pink Gloss",
    price: "₦6,800",
    image:
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=85&w=1000",
  },
  {
    name: "Berry Gloss",
    price: "₦7,500",
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=85&w=1000",
  },
  {
    name: "Nude Gloss",
    price: "₦7,200",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=85&w=1000",
  },
];

const popularProducts = [
  { ...shadeProducts[1], label: "Choco Gloss" },
  { ...shadeProducts[2], label: "Pink Crush" },
  { ...shadeProducts[3], label: "Lip Care Duo" },
  { ...shadeProducts[5], label: "Nude Bloom" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  return (
    <main>
      <header className="header">
        <SocialLinks />

        <nav
          className={menuOpen ? "navigation navigationOpen" : "navigation"}
          id="primary-navigation"
        >
          <a href="#home" onClick={() => setMenuOpen(false)}>
            Home
          </a>
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
              <a href="/collection" onClick={() => setMenuOpen(false)}>
                Lipgloss Collection
              </a>
              <a href="/lip-care" onClick={() => setMenuOpen(false)}>
                Lip Care Essentials
              </a>
            </div>
          </div>
          <a className="logo desktopLogo" href="#home" aria-label="Kaylash Beauty Place">
            <Image className="logoImage" src="/logo.png" alt="" fill sizes="132px" priority />
          </a>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>
          <a href="#footer" onClick={() => setMenuOpen(false)}>
            Contact
          </a>
        </nav>

        <a className="logo mobileLogo" href="#home" aria-label="Kaylash Beauty Place">
          <Image className="logoImage" src="/logo.png" alt="" fill sizes="104px" priority />
        </a>

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

      <section className="hero" id="home">
        <div className="heroHeading">
          <p>Welcome To</p>
          <h1>Kaylashbeautyplace</h1>
        </div>
        <Image
          className="heroImage"
          src="/image 2.png"
          alt="Glossy lips beside a soft pink rose"
          width={1440}
          height={520}
          sizes="100vw"
          priority
        />
      </section>

      <section className="shadeSection pageWidth" id="shades">
        <h2>Explore by Shades</h2>
        <div className="shadeContent">
          <aside className="shadeList" aria-label="Gloss shades">
            <a href="#clear-gloss">Clear Gloss</a>
            <a href="#choco-gloss">Choco Gloss</a>
            <a href="#hot-pink-gloss">Hot Pink Gloss</a>
            <a href="#light-pink-gloss">Light Pink Gloss</a>
          </aside>

          <div className="shadeGrid">
            {shadeProducts.map((product, index) => (
              <article
                className="shadeCard"
                id={product.name.toLowerCase().replaceAll(" ", "-")}
                key={`${product.name}-${index}`}
              >
                <a href="#popular" aria-label={`View ${product.name}`}>
                  {/* Figma image export is unavailable; these are temporary UI images. */}
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 500px"
                  />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="popularSection" id="popular">
        <div className="pageWidth">
          <h2>Popular Products</h2>
          <div className="popularGrid">
            {popularProducts.map((product) => (
              <article className="popularCard" key={product.label}>
                <Image
                  src={product.image}
                  alt={product.label}
                  fill
                  sizes="(max-width: 600px) 82vw, (max-width: 900px) 50vw, 295px"
                />
                <div className="popularCopy">
                  <h3>Lipgloss</h3>
                  <p>{product.price}</p>
                </div>
              </article>
            ))}
          </div>
          <a className="viewCollection" href="/collection">
            Explore all items <span>→</span>
          </a>
        </div>
      </section>

      <section className="about pageWidth" id="about">
        <div>
          <p>Kaylash Beauty Place</p>
          <h2>Beauty made to shine with you.</h2>
        </div>
        <p>
          Nourishing, high-shine lip essentials created for every mood, every shade, and every
          beautiful version of you.
        </p>
      </section>

      <footer id="footer">
        <div className="footerInner pageWidth">
          <div className="footerBrand">
            <strong>Kaylash</strong>
            <span>Beauty Place</span>
            <div className="homeFooterContact">
              <SocialLinks className="collectionSocials" />
              <a href="tel:+23409011303399">+23409011303399</a>
              <a href="mailto:chidalumbakwe2003@gmail.com">chidalumbakwe2003@gmail.com</a>
            </div>
          </div>
          <div>
            <h3>Shop</h3>
            <a href="#shades">Lipgloss</a>
            <a href="/lip-care">Lip care</a>
            <a href="#popular">Bestsellers</a>
          </div>
          <div className="newsletter">
            <h3>Stay in the glow</h3>
            <p>New drops and beauty notes, sent softly.</p>
            <div>
              <input type="email" placeholder="Email address" aria-label="Email address" />
              <button type="button" aria-label="Join newsletter">
                →
              </button>
            </div>
          </div>
        </div>
        <p className="copyright">© 2026 Kaylash Beauty Place. All rights reserved.</p>
      </footer>
    </main>
  );
}
