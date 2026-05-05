import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { Search, SlidersHorizontal, X, TrendingUp } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { trpc } from "@/providers/trpc";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

const categories = ["All", "Oversized", "Printed", "Plain", "Casual"];
const sizes = ["S", "M", "L", "XL", "XXL"];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All",
  );
  const [selectedSize, setSelectedSize] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: products, isLoading } = trpc.product.list.useQuery({
    category: selectedCategory === "All" ? undefined : selectedCategory,
    size: selectedSize || undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 5000 ? priceRange[1] : undefined,
    search: search || undefined,
  });

  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const handleAddToCart = (product: NonNullable<typeof products>[0]) => {
    const images = product.images as string[];
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.discountPrice || product.price),
      size: "M",
      qty: 1,
      image: images[0] || "",
    });
    toast.success(`${product.name} added to cart`);
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedSize("");
    setPriceRange([0, 5000]);
    setSearch("");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Header */}
      <div className="pt-24 lg:pt-32 pb-8 bg-[#f3f3f3]">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <p className="text-xs tracking-[0.3em] uppercase text-black/40 mb-2">
            Collection
          </p>
          <h1 className="text-4xl lg:text-6xl font-medium tracking-tight mb-6">
            Shop All
          </h1>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-black/10 text-sm focus:outline-none focus:border-black transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-black/40" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-black/10 text-sm hover:border-black transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="border-b border-black/10 bg-white">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Category */}
              <div>
                <p className="text-xs uppercase tracking-wider text-black/40 mb-3">
                  Category
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                        selectedCategory === cat
                          ? "bg-black text-white"
                          : "bg-[#f3f3f3] text-black/60 hover:bg-black/10"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <p className="text-xs uppercase tracking-wider text-black/40 mb-3">
                  Size
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() =>
                        setSelectedSize(selectedSize === size ? "" : size)
                      }
                      className={`w-10 h-10 flex items-center justify-center text-xs font-medium transition-colors ${
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

              {/* Price */}
              <div>
                <p className="text-xs uppercase tracking-wider text-black/40 mb-3">
                  Price Range: Rs. {priceRange[0]} - Rs. {priceRange[1]}
                </p>
                <input
                  type="range"
                  min={0}
                  max={5000}
                  step={100}
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-full"
                />
                <button
                  onClick={clearFilters}
                  className="mt-3 text-xs text-black/40 hover:text-black transition-colors underline"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-[#f3f3f3]" />
                <div className="mt-4 h-4 bg-[#f3f3f3] w-3/4" />
                <div className="mt-2 h-3 bg-[#f3f3f3] w-1/2" />
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <>
            <p className="text-sm text-black/40 mb-6">
              {products.length} product{products.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const images = product.images as string[];
                const hasDiscount =
                  product.discountPrice &&
                  Number(product.discountPrice) < Number(product.price);
                return (
                  <div key={product.id} className="group">
                    <Link to={`/product/${product.id}`}>
                      <div className="relative aspect-square bg-[#f3f3f3] overflow-hidden">
                        <img
                          src={images[0] || ""}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {hasDiscount && (
                          <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-medium px-2 py-1 uppercase tracking-wider">
                            Sale
                          </span>
                        )}
                        {product.trending && (
                          <span className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 text-black text-[10px] font-medium px-2 py-1">
                            <TrendingUp className="w-3 h-3" /> Trending
                          </span>
                        )}
                      </div>
                    </Link>
                    <div className="mt-4">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-black/40 mb-1">
                        {product.category}
                      </p>
                      <h3 className="text-sm font-medium mb-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            Rs. {product.discountPrice || product.price}
                          </span>
                          {hasDiscount && (
                            <span className="text-sm text-black/40 line-through">
                              Rs. {product.price}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="text-xs uppercase tracking-wider text-black/60 hover:text-black transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-black/40">No products found</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-sm underline hover:no-underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
