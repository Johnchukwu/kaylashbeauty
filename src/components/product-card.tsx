"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatNaira, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const isAvailable = product.availability !== "sold-out" && product.availability !== "unavailable";

  return (
    <article className="collectionCard">
      <Link
        className="collectionImage"
        href={`/products/${product.slug}`}
        aria-label={`View ${product.name}`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          loading="eager"
          sizes="(max-width: 600px) 46vw, (max-width: 900px) 30vw, 260px"
        />
      </Link>
      <h2>{product.name}</h2>
      <div className="collectionMeta">
        <button type="button" onClick={() => addItem(product)} disabled={!isAvailable}>
          {isAvailable ? "ADD TO CART" : "SOLD OUT"}
        </button>
        <span>{formatNaira(product.price)}</span>
      </div>
    </article>
  );
}
