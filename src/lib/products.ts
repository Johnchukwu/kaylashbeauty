export type Collection = "lipgloss" | "lip-care";

export type Product = {
  slug: string;
  name: string;
  price: number;
  image: string;
  description: string;
  collection: Collection;
  availability?: "available" | "sold-out" | "unavailable";
};

type StoredProduct = {
  _id: string;
  name: string;
  price: number;
  image: string;
  productCollection: Collection;
  availability: "available" | "sold-out" | "unavailable";
};

export function fromStoredProduct(product: StoredProduct): Product {
  return {
    slug: product._id,
    name: product.name,
    price: product.price,
    image: product.image,
    collection: product.productCollection,
    availability: product.availability,
    description: "A beauty essential from Kaylash Beauty Place.",
  };
}

const glossImage =
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=90&w=900";
const careImage =
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=90&w=900";

export const products: Product[] = [
  {
    slug: "choco-gloss",
    name: "Choco Gloss",
    price: 3500,
    image: glossImage,
    description: "A rich chocolate shade for bold, confident beauty.",
    collection: "lipgloss",
  },
  {
    slug: "kay-gloss",
    name: "Kay Gloss",
    price: 3500,
    image: glossImage,
    description: "A smooth, high-shine gloss made for everyday glow.",
    collection: "lipgloss",
  },
  {
    slug: "barbie-doll-gloss",
    name: "Barbie Doll Gloss",
    price: 3500,
    image: glossImage,
    description: "A playful pink gloss with a soft, glassy finish.",
    collection: "lipgloss",
  },
  {
    slug: "seduction-gloss",
    name: "Seduction Gloss",
    price: 3500,
    image: glossImage,
    description: "A flattering gloss that brings a touch of confidence.",
    collection: "lipgloss",
  },
  {
    slug: "sugar-lip-scrub",
    name: "Sugar Lip Scrub",
    price: 3500,
    image: careImage,
    description: "Gently exfoliates dry lips to leave them soft and smooth.",
    collection: "lip-care",
  },
  {
    slug: "hydrating-lip-balm",
    name: "Hydrating Lip Balm",
    price: 3500,
    image: careImage,
    description: "Daily moisture and comfort for beautifully nourished lips.",
    collection: "lip-care",
  },
  {
    slug: "lip-care-duo",
    name: "Lip Care Duo",
    price: 5500,
    image: careImage,
    description: "A simple two-step ritual for soft, hydrated lips.",
    collection: "lip-care",
  },
  {
    slug: "overnight-lip-mask",
    name: "Overnight Lip Mask",
    price: 4500,
    image: careImage,
    description: "An overnight treatment for a plush, hydrated feel by morning.",
    collection: "lip-care",
  },
  {
    slug: "rose-lip-oil",
    name: "Rose Lip Oil",
    price: 4000,
    image: careImage,
    description: "A lightweight lip oil with a comforting rose-inspired finish.",
    collection: "lip-care",
  },
  {
    slug: "vanilla-lip-balm",
    name: "Vanilla Lip Balm",
    price: 3500,
    image: careImage,
    description: "A sweetly scented balm for lasting daily hydration.",
    collection: "lip-care",
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter((item) => item.collection === product.collection && item.slug !== product.slug)
    .slice(0, limit);
}

export function formatNaira(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}
