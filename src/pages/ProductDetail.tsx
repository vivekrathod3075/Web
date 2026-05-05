import { useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Minus, Plus, ShoppingBag, Heart, Truck, RotateCcw, Check } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { trpc } from "@/providers/trpc";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const { data: product, isLoading } = trpc.product.getById.useQuery({ id: productId });
  const { data: allProducts } = trpc.product.list.useQuery();
  const [selectedSize, setSelectedSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState<number[]>(() => {
    const saved = localStorage.getItem("ep-wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const addItem = useCartStore((s) => s.addItem);

  const toggleWishlist = (id: number) => {
    const updated = wishlist.includes(id)
      ? wishlist.filter((w) => w !== id)
      : [...wishlist, id];
    setWishlist(updated);
    localStorage.setItem("ep-wishlist", JSON.stringify(updated));
    toast.success(wishlist.includes(id) ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleAddToCart = () => {
    if (!product) return;
    const images = product.images as string[];
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.discountPrice || product.price),
      size: selectedSize,
      qty,
      image: images[0] || "",
    });
    toast.success(`${product.name} added to cart`);
  };

  // Related products (same category, excluding current)
  const related = allProducts
    ?.filter((p) => p.category === product?.category && p.id !== productId)
    .slice(0, 4);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-24 px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-[#f3f3f3]" />
            <div className="space-y-4">
              <div className="h-8 bg-[#f3f3f3] w-3/4" />
              <div className="h-4 bg-[#f3f3f3] w-1/2" />
              <div className="h-20 bg-[#f3f3f3]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-24 px-4 sm:px-6 lg:px-8 xl:px-12 text-center py-20">
          <h1 className="text-2xl font-medium mb-4">Product not found</h1>
          <Link to="/shop" className="text-sm underline">Back to shop</Link>
        </div>
      </div>
    );
  }

  const images = product.images as string[];
  const sizes = product.sizes as string[];
  const hasDiscount = product.discountPrice && Number(product.discountPrice) < Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round((1 - Number(product.discountPrice) / Number(product.price)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="pt-24 lg:pt-32 pb-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Breadcrumb */}
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm text-black/40 hover:text-black transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square bg-[#f3f3f3] overflow-hidden">
                <img
                  src={images[0] || ""}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className="text-[10px] tracking-[0.2em] uppercase text-black/40 mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl lg:text-4xl font-medium tracking-tight mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-medium">
                  Rs. {product.discountPrice || product.price}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-black/40 line-through">
                      Rs. {product.price}
                    </span>
                    <span className="bg-black text-white text-xs px-2 py-1 font-medium">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm text-black/60 leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Size Selection */}
              <div className="mb-8">
                <p className="text-xs uppercase tracking-wider text-black/40 mb-3">
                  Select Size
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 flex items-center justify-center text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? "bg-black text-white"
                          : "bg-[#f3f3f3] text-black/60 hover:bg-black/10"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <p className="text-xs uppercase tracking-wider text-black/40 mb-3">
                  Quantity
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-[#f3f3f3] hover:bg-black/10 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-medium w-8 text-center">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-[#f3f3f3] hover:bg-black/10 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 mb-8">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm text-black/60">
                  {product.stock > 10
                    ? "In Stock"
                    : `Only ${product.stock} left`}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-4 text-sm font-medium uppercase tracking-wider hover:bg-black/80 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-14 h-14 flex items-center justify-center border transition-colors ${
                    wishlist.includes(product.id)
                      ? "bg-red-50 border-red-200 text-red-500"
                      : "border-black/10 hover:border-black"
                  }`}
                >
                  <Heart
                    className="w-5 h-5"
                    fill={wishlist.includes(product.id) ? "currentColor" : "none"}
                  />
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-black/10">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-black/40 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Free Shipping</p>
                    <p className="text-xs text-black/40">On orders over Rs. 2000</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RotateCcw className="w-5 h-5 text-black/40 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Easy Returns</p>
                    <p className="text-xs text-black/40">7-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {related && related.length > 0 && (
            <div className="mt-20 pt-16 border-t border-black/10">
              <h2 className="text-2xl font-medium tracking-tight mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((p) => {
                  const pImages = p.images as string[];
                  return (
                    <Link key={p.id} to={`/product/${p.id}`} className="group">
                      <div className="aspect-square bg-[#f3f3f3] overflow-hidden">
                        <img
                          src={pImages[0] || ""}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-3">
                        <p className="text-[10px] tracking-[0.2em] uppercase text-black/40 mb-1">
                          {p.category}
                        </p>
                        <h3 className="text-sm font-medium">{p.name}</h3>
                        <p className="text-sm font-medium mt-1">
                          Rs. {p.discountPrice || p.price}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
