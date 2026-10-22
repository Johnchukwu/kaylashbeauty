"use client";

import { ChevronDown, Heart, Menu, Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { CartButton } from "@/components/cart-button";
import { StoreFooter } from "@/components/store-footer";
import { SocialLinks } from "@/components/social-links";
import { useCart } from "@/components/cart-provider";
import { ProductCard } from "@/components/product-card";
import { formatNaira, fromStoredProduct, type Product } from "@/lib/products";

export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = use(params);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    void fetch(`/api/products/${slug}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((item) => {
        const currentProduct = item ? fromStoredProduct(item) : null;
        setProduct(currentProduct);
        if (!currentProduct) return;
        return fetch("/api/products")
          .then((response) => response.json())
          .then((products) =>
            setRelatedProducts(
              products
                .map(fromStoredProduct)
                .filter(
                  (item: Product) =>
                    item.collection === currentProduct.collection &&
                    item.slug !== currentProduct.slug,
                )
                .slice(0, 4),
            ),
          );
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <main className="productLoading">Loading product…</main>;
  if (!product)
    return (
      <main className="productLoading">
        This product is no longer available. <Link href="/collection">Browse products</Link>
      </main>
    );

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
          <a href="#productFooter">Contact</a>
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

      <section className="productDetail pageWidth">
        <div className="productMainImage">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 800px) 100vw, 560px"
            priority
          />
        </div>
        <div className="productInfo">
          <h1>{product.name}</h1>
          <p className="productPrice">{formatNaira(product.price)}</p>
          <h2>Detail</h2>
          <p className="productDescription">• &nbsp;{product.description}</p>
          <span className="quantityLabel">Quantity</span>
          <div className="quantityControl" aria-label="Product quantity">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              aria-label="Decrease quantity"
            >
              <Minus size={13} />
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((value) => value + 1)}
              aria-label="Increase quantity"
            >
              <Plus size={13} />
            </button>
          </div>
          <div className="productActions">
            <button
              className="addToCartButton"
              type="button"
              onClick={() => addItem(product, quantity)}
            >
              Add to cart
            </button>
            <button className="wishButton" type="button" aria-label="Add to wishlist">
              <Heart size={17} />
            </button>
          </div>
        </div>
      </section>

      <section className="relatedSection pageWidth">
        <h2>You might also like</h2>
        <p>Similar products</p>
        <div className="relatedGrid">
          {relatedProducts.map((item) => (
            <ProductCard product={item} key={item.slug} />
          ))}
        </div>
      </section>

      <StoreFooter id="productFooter" />
    </main>
  );
}
