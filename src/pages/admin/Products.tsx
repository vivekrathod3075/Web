import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Package,
  X,
  Image,
  Search,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import toast from "react-hot-toast";

const CATEGORIES = ["Oversized", "Printed", "Plain", "Casual"];
const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function AdminProducts() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "Plain",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [""],
    stock: "50",
    featured: false,
    trending: false,
  });

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [user, isAdmin, isLoading, navigate]);

  const utils = trpc.useUtils();
  const { data: products, isLoading: productsLoading } =
    trpc.product.list.useQuery();

  const createProduct = trpc.product.create.useMutation({
    onSuccess: () => {
      toast.success("Product created!");
      resetForm();
      utils.product.list.invalidate();
    },
    onError: () => toast.error("Failed to create product"),
  });

  const updateProduct = trpc.product.update.useMutation({
    onSuccess: () => {
      toast.success("Product updated!");
      resetForm();
      utils.product.list.invalidate();
    },
    onError: () => toast.error("Failed to update product"),
  });

  const deleteProduct = trpc.product.delete.useMutation({
    onSuccess: () => {
      toast.success("Product deleted!");
      utils.product.list.invalidate();
    },
    onError: () => toast.error("Failed to delete product"),
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      price: "",
      discountPrice: "",
      category: "Plain",
      sizes: ["S", "M", "L", "XL", "XXL"],
      images: [""],
      stock: "50",
      featured: false,
      trending: false,
    });
  };

  const handleEdit = (product: NonNullable<typeof products>[0]) => {
    const imgs = product.images as string[];
    const sz = product.sizes as string[];
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      discountPrice: product.discountPrice || "",
      category: product.category,
      sizes: sz,
      images: imgs,
      stock: product.stock.toString(),
      featured: product.featured,
      trending: product.trending,
    });
    setEditingId(product.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      category: form.category,
      sizes: form.sizes,
      images: form.images.filter((i) => i.trim()),
      stock: Number(form.stock),
      featured: form.featured,
      trending: form.trending,
    };

    if (editingId) {
      updateProduct.mutate({ id: editingId, ...data });
    } else {
      createProduct.mutate(data);
    }
  };

  const toggleSize = (size: string) => {
    setForm({
      ...form,
      sizes: form.sizes.includes(size)
        ? form.sizes.filter((s) => s !== size)
        : [...form.sizes, size],
    });
  };

  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center">
        <p className="text-black/40">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      {/* Header */}
      <header className="bg-black text-white">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-lg font-medium tracking-tight">
              EP BRAND
            </Link>
            <span className="text-white/40">|</span>
            <span className="text-sm text-white/60">Products</span>
          </div>
          <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors">
            Exit Admin
          </Link>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="text-sm text-black/40 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1" /> Dashboard
            </Link>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 bg-black text-white px-4 py-2.5 text-xs font-medium uppercase tracking-wider hover:bg-black/80 transition-colors"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? "Cancel" : "Add Product"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white p-6 mb-8">
            <h2 className="text-sm uppercase tracking-wider text-black/40 mb-6">
              {editingId ? "Edit Product" : "New Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-black/40 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-[#f3f3f3] border-0 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-black/40 mb-2">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#f3f3f3] border-0 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-black/40 mb-2">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-[#f3f3f3] border-0 text-sm focus:outline-none focus:ring-1 focus:ring-black resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-black/40 mb-2">
                    Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    required
                    min={0}
                    className="w-full px-4 py-3 bg-[#f3f3f3] border-0 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-black/40 mb-2">
                    Discount Price
                  </label>
                  <input
                    type="number"
                    value={form.discountPrice}
                    onChange={(e) =>
                      setForm({ ...form, discountPrice: e.target.value })
                    }
                    min={0}
                    className="w-full px-4 py-3 bg-[#f3f3f3] border-0 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-black/40 mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    required
                    min={0}
                    className="w-full px-4 py-3 bg-[#f3f3f3] border-0 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-black/40 mb-2">
                  Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`w-10 h-10 flex items-center justify-center text-xs font-medium transition-colors ${
                        form.sizes.includes(size)
                          ? "bg-black text-white"
                          : "bg-[#f3f3f3] text-black/40"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-black/40 mb-2">
                  Image URL *
                </label>
                <input
                  type="text"
                  value={form.images[0] || ""}
                  onChange={(e) =>
                    setForm({ ...form, images: [e.target.value] })
                  }
                  required
                  placeholder="/product-image.jpg"
                  className="w-full px-4 py-3 bg-[#f3f3f3] border-0 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm({ ...form, featured: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.trending}
                    onChange={(e) =>
                      setForm({ ...form, trending: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  Trending
                </label>
              </div>

              <button
                type="submit"
                disabled={createProduct.isPending || updateProduct.isPending}
                className="bg-black text-white px-6 py-3 text-sm font-medium uppercase tracking-wider hover:bg-black/80 transition-colors disabled:opacity-50"
              >
                {createProduct.isPending || updateProduct.isPending
                  ? "Saving..."
                  : editingId
                    ? "Update Product"
                    : "Create Product"}
              </button>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="bg-white p-4 mb-4 flex items-center gap-3">
          <Search className="w-4 h-4 text-black/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 text-sm focus:outline-none"
          />
        </div>

        {/* Products Table */}
        <div className="bg-white">
          {productsLoading ? (
            <div className="p-8 text-center text-black/40">Loading...</div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/10">
                    <th className="text-left p-4 text-xs uppercase tracking-wider text-black/40 font-medium">
                      Product
                    </th>
                    <th className="text-left p-4 text-xs uppercase tracking-wider text-black/40 font-medium">
                      Category
                    </th>
                    <th className="text-left p-4 text-xs uppercase tracking-wider text-black/40 font-medium">
                      Price
                    </th>
                    <th className="text-left p-4 text-xs uppercase tracking-wider text-black/40 font-medium">
                      Stock
                    </th>
                    <th className="text-left p-4 text-xs uppercase tracking-wider text-black/40 font-medium">
                      Status
                    </th>
                    <th className="text-right p-4 text-xs uppercase tracking-wider text-black/40 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {filteredProducts.map((product) => {
                    const imgs = product.images as string[];
                    return (
                      <tr key={product.id} className="hover:bg-[#f3f3f3] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#f3f3f3] overflow-hidden flex-shrink-0">
                              {imgs[0] ? (
                                <img
                                  src={imgs[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Image className="w-full h-full p-2 text-black/20" />
                              )}
                            </div>
                            <span className="text-sm font-medium">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-black/60">
                          {product.category}
                        </td>
                        <td className="p-4 text-sm">
                          Rs. {product.discountPrice || product.price}
                          {product.discountPrice && (
                            <span className="text-black/40 line-through ml-2">
                              Rs. {product.price}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-sm">{product.stock}</td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            {product.featured && (
                              <span className="text-[10px] bg-black text-white px-1.5 py-0.5">
                                Featured
                              </span>
                            )}
                            {product.trending && (
                              <span className="text-[10px] bg-[#f3f3f3] text-black/60 px-1.5 py-0.5">
                                Trending
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 hover:bg-black/5 transition-colors mr-1"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Delete this product?")) {
                                deleteProduct.mutate({ id: product.id });
                              }
                            }}
                            className="p-2 hover:bg-red-50 text-black/40 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-black/40">
              <Package className="w-8 h-8 mx-auto mb-4" />
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
