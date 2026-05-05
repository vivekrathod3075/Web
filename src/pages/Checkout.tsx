import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useCartStore } from "@/store/cartStore";
import { trpc } from "@/providers/trpc";
import { WHATSAPP_NUMBER } from "@/const";
import toast from "react-hot-toast";

export default function Checkout() {
  const { items, updateQty, removeItem, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  const createOrder = trpc.order.create.useMutation({
    onSuccess: (data) => {
      // Build WhatsApp message
      const orderItems = items
        .map(
          (item) =>
            `- ${item.name} (Size: ${item.size}, Qty: ${item.qty}) - Rs. ${item.price * item.qty}`,
        )
        .join("\n");

      const message = `Hello EP BRAND, I want to order:\n\n${orderItems}\n\n*Total: Rs. ${getTotal()}*\n\n*Name:* ${form.fullName}\n*Phone:* ${form.phone}\n*Address:* ${form.address}\n\nPlease confirm my order.`;

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      clearCart();
      toast.success("Order placed successfully!");
      navigate("/order-confirmation", { state: { whatsappUrl, orderId: data[0]?.insertId } });
    },
    onError: () => {
      toast.error("Failed to place order. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    createOrder.mutate({
      customerName: form.fullName,
      phone: form.phone,
      address: form.address,
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        size: item.size,
        qty: item.qty,
        price: item.price,
      })),
      totalAmount: getTotal(),
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-24 px-4 sm:px-6 lg:px-8 xl:px-12 text-center py-20">
          <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-black/20" />
          <h1 className="text-2xl font-medium mb-4">Your cart is empty</h1>
          <p className="text-black/40 mb-8">Add some products to get started</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 text-sm font-medium uppercase tracking-wider"
          >
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="pt-24 lg:pt-32 pb-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm text-black/40 hover:text-black transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>

          <h1 className="text-3xl lg:text-4xl font-medium tracking-tight mb-12">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Cart Items */}
            <div>
              <h2 className="text-sm uppercase tracking-wider text-black/40 mb-6">
                Order Summary ({items.length} item{items.length !== 1 ? "s" : ""})
              </h2>
              <div className="space-y-6">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex gap-4 pb-6 border-b border-black/10"
                  >
                    <div className="w-24 h-24 bg-[#f3f3f3] overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium mb-1">{item.name}</h3>
                      <p className="text-xs text-black/40 mb-2">
                        Size: {item.size}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateQty(item.productId, item.size, item.qty - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center bg-[#f3f3f3] hover:bg-black/10 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() =>
                              updateQty(item.productId, item.size, item.qty + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center bg-[#f3f3f3] hover:bg-black/10 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium">
                            Rs. {item.price * item.qty}
                          </span>
                          <button
                            onClick={() =>
                              removeItem(item.productId, item.size)
                            }
                            className="text-black/40 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t-2 border-black">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-2xl font-medium">Rs. {getTotal()}</span>
                </div>
              </div>
            </div>

            {/* Shipping Form */}
            <div>
              <h2 className="text-sm uppercase tracking-wider text-black/40 mb-6">
                Shipping Details
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-black/40 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-[#f3f3f3] border-0 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-black/40 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-[#f3f3f3] border-0 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-black/40 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-[#f3f3f3] border-0 text-sm focus:outline-none focus:ring-1 focus:ring-black resize-none"
                    placeholder="Enter your complete address"
                  />
                </div>

                <div className="pt-4">
                  <p className="text-xs text-black/40 mb-4">
                    Your order will be sent via WhatsApp to our team for confirmation.
                  </p>
                  <button
                    type="submit"
                    disabled={createOrder.isPending}
                    className="w-full bg-black text-white py-4 text-sm font-medium uppercase tracking-wider hover:bg-black/80 transition-colors disabled:opacity-50"
                  >
                    {createOrder.isPending
                      ? "Processing..."
                      : "Place Order via WhatsApp"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
