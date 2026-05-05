import { getDb } from "../api/queries/connection";
import { products } from "./schema";

const seedProducts = [
  {
    name: "Classic Black Tee",
    description: "The essential black T-shirt. Crafted from 100% organic cotton with a tailored fit that sits perfectly between slim and relaxed. Pre-shrunk and garment-washed for ultimate softness.",
    price: "899.00",
    discountPrice: "699.00",
    category: "Plain",
    sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
    images: JSON.stringify(["/product-black-folded.jpg"]),
    stock: 45,
    featured: true,
    trending: true,
  },
  {
    name: "Essential White Tee",
    description: "A wardrobe cornerstone. Our Essential White Tee is made from premium mid-weight cotton that holds its shape while feeling incredibly soft. The perfect base layer or standalone statement.",
    price: "799.00",
    discountPrice: null,
    category: "Plain",
    sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
    images: JSON.stringify(["/product-white-hanger.jpg"]),
    stock: 32,
    featured: true,
    trending: false,
  },
  {
    name: "Oversized Drop-Shoulder Black",
    description: "Embrace the oversized aesthetic. Features an exaggerated drop-shoulder silhouette, heavyweight cotton construction, and a relaxed drape that defines contemporary streetwear.",
    price: "1299.00",
    discountPrice: "999.00",
    category: "Oversized",
    sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
    images: JSON.stringify(["/product-oversized-black.jpg"]),
    stock: 28,
    featured: false,
    trending: true,
  },
  {
    name: "Abstract Art Print Tee",
    description: "Where fashion meets fine art. This statement piece features an exclusive abstract brushstroke design printed on premium cotton. Each piece is a wearable canvas.",
    price: "1499.00",
    discountPrice: "1199.00",
    category: "Printed",
    sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
    images: JSON.stringify(["/product-printed-abstract.jpg"]),
    stock: 18,
    featured: true,
    trending: true,
  },
  {
    name: "Navy Classic Fit",
    description: "Sophisticated simplicity in deep navy. A versatile piece that transitions effortlessly from day to night. Made with our signature pima cotton blend for all-day comfort.",
    price: "949.00",
    discountPrice: null,
    category: "Casual",
    sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
    images: JSON.stringify(["/product-navy-folded.jpg"]),
    stock: 55,
    featured: false,
    trending: false,
  },
  {
    name: "Charcoal Oversized",
    description: "Urban sophistication in charcoal gray. This oversized silhouette features extended sleeves and a boxy fit, perfect for layering or making a bold standalone statement.",
    price: "1199.00",
    discountPrice: "899.00",
    category: "Oversized",
    sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
    images: JSON.stringify(["/product-gray-oversized.jpg"]),
    stock: 22,
    featured: false,
    trending: true,
  },
  {
    name: "Sand Beige Casual",
    description: "Earth-toned elegance. This sand beige tee brings warmth to any outfit. Cut from breathable cotton jersey with a relaxed casual fit that's perfect for everyday wear.",
    price: "849.00",
    discountPrice: null,
    category: "Casual",
    sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
    images: JSON.stringify(["/product-beige-cream.jpg"]),
    stock: 38,
    featured: false,
    trending: false,
  },
  {
    name: "Line Art Portrait Tee",
    description: "Minimalist expression through continuous line art. This white tee features an elegant face illustration that captures the essence of modern design philosophy.",
    price: "1399.00",
    discountPrice: "1099.00",
    category: "Printed",
    sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
    images: JSON.stringify(["/product-printed-lineart.jpg"]),
    stock: 15,
    featured: true,
    trending: true,
  },
  {
    name: "Olive Green Oversized",
    description: "Nature-inspired tone meets urban design. This oversized tee in muted olive is crafted from heavyweight organic cotton with a garment-dyed finish for unique color depth.",
    price: "1099.00",
    discountPrice: null,
    category: "Oversized",
    sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
    images: JSON.stringify(["/product-olive-oversized.jpg"]),
    stock: 30,
    featured: false,
    trending: false,
  },
];

async function seed() {
  const db = getDb();
  console.log("Seeding products...");

  for (const product of seedProducts) {
    await db.insert(products).values(product);
  }

  console.log(`Seeded ${seedProducts.length} products.`);
}

seed().catch(console.error);
