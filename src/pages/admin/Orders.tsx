import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  ShoppingCart,
  Eye,
  ChevronDown,
  Package,
  Truck,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [user, isAdmin, isLoading, navigate]);

  const utils = trpc.useUtils();
  const { data: orders, isLoading: ordersLoading } = trpc.order.list.useQuery(
    undefined,
    { enabled: isAdmin },
  );

  const updateStatus = trpc.order.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated!");
      utils.order.list.invalidate();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center">
        <p className="text-black/40">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  const selectedOrderData = orders?.find((o) => o.id === selectedOrder);

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
            <span className="text-sm text-white/60">Orders</span>
          </div>
          <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors">
            Exit Admin
          </Link>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/admin"
            className="text-sm text-black/40 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4 inline mr-1" /> Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 text-center">
            <Clock className="w-5 h-5 mx-auto mb-2 text-yellow-600" />
            <p className="text-2xl font-medium">
              {orders?.filter((o) => o.status === "pending").length || 0}
            </p>
            <p className="text-xs uppercase tracking-wider text-black/40">Pending</p>
          </div>
          <div className="bg-white p-4 text-center">
            <Truck className="w-5 h-5 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-medium">
              {orders?.filter((o) => o.status === "shipped").length || 0}
            </p>
            <p className="text-xs uppercase tracking-wider text-black/40">Shipped</p>
          </div>
          <div className="bg-white p-4 text-center">
            <CheckCircle className="w-5 h-5 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-medium">
              {orders?.filter((o) => o.status === "delivered").length || 0}
            </p>
            <p className="text-xs uppercase tracking-wider text-black/40">Delivered</p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white">
          {ordersLoading ? (
            <div className="p-8 text-center text-black/40">Loading...</div>
          ) : orders && orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/10">
                    <th className="text-left p-4 text-xs uppercase tracking-wider text-black/40 font-medium">
                      Order ID
                    </th>
                    <th className="text-left p-4 text-xs uppercase tracking-wider text-black/40 font-medium">
                      Customer
                    </th>
                    <th className="text-left p-4 text-xs uppercase tracking-wider text-black/40 font-medium">
                      Phone
                    </th>
                    <th className="text-left p-4 text-xs uppercase tracking-wider text-black/40 font-medium">
                      Total
                    </th>
                    <th className="text-left p-4 text-xs uppercase tracking-wider text-black/40 font-medium">
                      Status
                    </th>
                    <th className="text-left p-4 text-xs uppercase tracking-wider text-black/40 font-medium">
                      Date
                    </th>
                    <th className="text-right p-4 text-xs uppercase tracking-wider text-black/40 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {orders.map((order) => {
                    const orderItems = order.items as Array<{
                      name: string;
                      size: string;
                      qty: number;
                      price: number;
                    }>;
                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-[#f3f3f3] transition-colors"
                      >
                        <td className="p-4 text-sm font-mono">
                          #{String(order.id).padStart(4, "0")}
                        </td>
                        <td className="p-4 text-sm font-medium">
                          {order.customerName}
                        </td>
                        <td className="p-4 text-sm">{order.phone}</td>
                        <td className="p-4 text-sm font-medium">
                          Rs. {order.totalAmount}
                        </td>
                        <td className="p-4">
                          <span
                            className={`text-[10px] uppercase tracking-wider px-2 py-1 font-medium ${
                              order.status === "pending"
                                ? "bg-yellow-50 text-yellow-700"
                                : order.status === "shipped"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-green-50 text-green-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-black/40">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                updateStatus.mutate({
                                  id: order.id,
                                  status: e.target.value as
                                    | "pending"
                                    | "shipped"
                                    | "delivered",
                                })
                              }
                              className="text-xs bg-transparent border border-black/10 px-2 py-1 focus:outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                            </select>
                            <button
                              onClick={() =>
                                setSelectedOrder(
                                  selectedOrder === order.id ? null : order.id,
                                )
                              }
                              className="p-2 hover:bg-black/5 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-black/40">
              <ShoppingCart className="w-8 h-8 mx-auto mb-4" />
              <p>No orders yet</p>
            </div>
          )}
        </div>

        {/* Order Detail Modal */}
        {selectedOrderData && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-black/10 flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Order #{String(selectedOrderData.id).padStart(4, "0")}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-[#f3f3f3] transition-colors"
                >
                  Close
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-black/40 mb-1">
                    Customer
                  </p>
                  <p className="text-sm font-medium">
                    {selectedOrderData.customerName}
                  </p>
                  <p className="text-sm text-black/60">
                    {selectedOrderData.phone}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-black/40 mb-1">
                    Address
                  </p>
                  <p className="text-sm">{selectedOrderData.address}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-black/40 mb-2">
                    Items
                  </p>
                  {(selectedOrderData.items as Array<{
                    name: string;
                    size: string;
                    qty: number;
                    price: number;
                  }>).map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-black/5"
                    >
                      <div>
                        <p className="text-sm">{item.name}</p>
                        <p className="text-xs text-black/40">
                          Size: {item.size} x {item.qty}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        Rs. {item.price * item.qty}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t-2 border-black">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total</span>
                    <span className="text-xl font-medium">
                      Rs. {selectedOrderData.totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
