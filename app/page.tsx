"use client";

import { useMemo, useState } from "react";

const shades = ["All shades", "Clear Gloss", "Choco Gloss", "Hot Pink Gloss", "Light Pink Gloss"];

const products = [
  { name: "Crystal Kiss", shade: "Clear Gloss", price: 6500, image: "https://images.unsplash.com/photo-1631214524115-9942bf927d4a?auto=format&fit=crop&q=85&w=900" },
  { name: "Cocoa Glow", shade: "Choco Gloss", price: 7200, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=85&w=900" },
  { name: "Pink Crush", shade: "Hot Pink Gloss", price: 7000, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=85&w=900" },
  { name: "Rosé Veil", shade: "Light Pink Gloss", price: 6800, image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=85&w=900" },
  { name: "Berry Glaze", shade: "Hot Pink Gloss", price: 7500, image: "https://images.unsplash.com/photo-1590156206657-a4cd1c4c0b11?auto=format&fit=crop&q=85&w=900" },
  { name: "Nude Bloom", shade: "Choco Gloss", price: 7200, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=85&w=900" },
];

const popular = [
  { name: "Kaylash Lipgloss Set", image: products[0].image },
  { name: "Pink Crush Gloss", image: products[2].image },
  { name: "Lip Care Duo", image: products[3].image },
  { name: "Nude Bloom Gloss", image: products[5].image },
];

const money = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

export default function Home() {
  const [activeShade, setActiveShade] = useState("All shades");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const visibleProducts = useMemo(
    () => activeShade === "All shades" ? products : products.filter((product) => product.shade === activeShade),
    [activeShade],
  );

  return (
    <main>
      <header className="site-header">
        <div className="social-links" aria-label="Social media">
          <a href="#footer" aria-label="Facebook">f</a>
          <a href="#footer" aria-label="Instagram">◎</a>
        </div>

        <nav aria-label="Main navigation" className={menuOpen ? "main-nav open" : "main-nav"}>
          <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <div className="category-wrap">
            <button className="category-button" type="button">Categories <span>⌄</span></button>
            <div className="category-menu">
              <a href="#shades">Lipgloss Collection</a>
              <a href="#popular">Lip Care Essentials</a>
            </div>
          </div>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#footer" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>

        <a className="brand-mark" href="#home" aria-label="Kaylash Beauty Place home">
          <span className="brand-lips">💋</span>
          <strong>Beauty<br />by Kay</strong>
        </a>

        <div className="header-actions">
          <button className="cart-button" type="button" aria-label={`Shopping cart with ${cartCount} items`}>
            ♡ <span className="cart-count">{cartCount}</span>
          </button>
          <button className="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <p>Welcome To</p>
          <h1>Kaylashbeautyplace</h1>
        </div>
        <div className="hero-image" role="img" aria-label="Beauty portrait with glossy lips and a rose" />
      </section>

      <section className="shade-section section-shell" id="shades">
        <p className="eyebrow">Find your perfect finish</p>
        <h2>Explore by Shades</h2>
        <div className="shade-layout">
          <aside className="shade-filter" aria-label="Filter by lip gloss shade">
            {shades.map((shade) => (
              <button
                className={activeShade === shade ? "active" : ""}
                key={shade}
                onClick={() => setActiveShade(shade)}
                type="button"
              >
                {shade}
              </button>
            ))}
          </aside>

          <div className="product-grid">
            {visibleProducts.map((product) => (
              <article className="product-card" key={product.name}>
                <div className="product-image-wrap">
                  <img src={product.image} alt={`${product.name} ${product.shade}`} />
                  <button type="button" onClick={() => setCartCount((count) => count + 1)}>Add to bag</button>
                </div>
                <div className="product-meta">
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.shade}</p>
                  </div>
                  <strong>{money.format(product.price)}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="popular-section" id="popular">
        <div className="section-shell">
          <p className="eyebrow">Loved by our gloss girls</p>
          <h2>Popular Products</h2>
          <div className="popular-grid">
            {popular.map((item, index) => (
              <article className="popular-card" key={item.name}>
                <img src={item.image} alt={item.name} />
                <div className="popular-overlay">
                  <span>0{index + 1}</span>
                  <h3>{item.name}</h3>
                  <button type="button" onClick={() => setCartCount((count) => count + 1)}>Shop now</button>
                </div>
              </article>
            ))}
          </div>
          <a className="collection-link" href="#shades">View collection <span>→</span></a>
        </div>
      </section>

      <section className="about-section section-shell" id="about">
        <div>
          <p className="eyebrow">Gloss with intention</p>
          <h2>Made to shine<br />with you.</h2>
        </div>
        <p>Kaylash Beauty Place creates nourishing, high-shine lip essentials designed for every mood, every shade and every beautiful version of you.</p>
      </section>

      <footer id="footer">
        <div className="footer-brand">
          <span>Kaylash</span>
          <p>Beauty Place</p>
        </div>
        <div>
          <h3>Explore</h3>
          <a href="#home">Home</a>
          <a href="#shades">Lipgloss</a>
          <a href="#popular">Lip care</a>
        </div>
        <div>
          <h3>Help</h3>
          <a href="mailto:hello@kaylashbeautyplace.com">Contact</a>
          <a href="#footer">Delivery</a>
          <a href="#footer">Returns</a>
        </div>
        <div>
          <h3>Stay in the glow</h3>
          <p>Join for new drops and beauty notes.</p>
          <form onSubmit={(event) => event.preventDefault()}>
            <label className="sr-only" htmlFor="newsletter">Email address</label>
            <input id="newsletter" type="email" placeholder="Email address" required />
            <button type="submit" aria-label="Subscribe">→</button>
          </form>
        </div>
      </footer>
      <div className="copyright">© 2026 Kaylash Beauty Place. All rights reserved.</div>
    </main>
  );
}
