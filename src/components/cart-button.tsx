"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";

export function CartButton() {
  const { itemCount } = useCart();

  return (
    <Link
      className="cartButton"
      href="/cart"
      aria-label={`Shopping bag with ${itemCount} item${itemCount === 1 ? "" : "s"}`}
    >
      <ShoppingBag size={17} strokeWidth={1.7} />
      {itemCount > 0 && <span className="cartBadge">{itemCount}</span>}
    </Link>
  );
}
