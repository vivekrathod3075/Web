import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Mail,
  ArrowRight,
  TrendingUp,
  Shield,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";

export default function AdminDashboard() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [user, isAdmin, isLoading, navigate]);

  const { data: products } = trpc.product.list.useQuery();
  const { data: orders } = trpc.order.list.useQuery(undefined, {
    enabled: isAdmin,
  });
  const { data: contacts } = trpc.contact.list.useQuery(undefined, {
    enabled: isAdmin,
  });
  const { data: subscribers } = trpc.subscriber.list.useQuery(undefined, {
    enabled: isAdmin,
  });
  const { data: visitorStats } = trpc.visitor.stats.useQuery(undefined, {
    enabled: isAdmin,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center">
        <p className="text-black/40">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  const stats = [
    {
      label: "Total Products",
      value: products?.length || 0,
      icon: Package,
      href: "/admin/products",
    },
    {
      label: "Total Orders",
      value: orders?.length || 0,
      icon: ShoppingCart,
      href: "/admin/orders",
    },
    {
      label: "Pending Orders",
      value: orders?.filter((o) => o.status === "pending").length || 0,
      icon: TrendingUp,
      href: "/admin/orders",
    },
    {
      label: "Contact Messages",
      value: contacts?.length || 0,
      icon: Mail,
      href: "#",
    },
    {
      label: "Subscribers",
      value: subscribers?.length || 0,
      icon: Users,
      href: "#",
    },
    {
      label: "Total Visitors",
      value: visitorStats?.total || 0,
      icon: Shield,
      href: "#",
    },
  ];

  const recentOrders = orders?.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      {/* Admin Header */}
      <header className="bg-black text-white">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-lg font-medium tracking-tight">
              EP BRAND
            </Link>
            <span className="text-white/40">|</span>
            <span className="text-sm text-white/60 flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Admin Panel
            </span>
          </div>
          <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors">
            Exit Admin
          </Link>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.href}
              className="bg-white p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <stat.icon className="w-5 h-5 text-black/40" />
                <ArrowRight className="w-4 h-4 text-black/20" />
              </div>
              <p className="text-3xl font-medium mb-1">{stat.value}</p>
              <p className="text-xs uppercase tracking-wider text-black/40">
                {stat.label}
              </p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 mb-8">
          <h2 className="text-sm uppercase tracking-wider text-black/40 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 bg-black text-white px-4 py-2.5 text-xs font-medium uppercase tracking-wider hover:bg-black/80 transition-colors"
            >
              <Package className="w-4 h-4" /> Manage Products
            </Link>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-2 bg-black text-white px-4 py-2.5 text-xs font-medium uppercase tracking-wider hover:bg-black/80 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" /> View Orders
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white">
          <div className="p-6 border-b border-black/10 flex items-center justify-between">
            <h2 className="text-sm uppercase tracking-wider text-black/40">
              Recent Orders
            </h2>
            <Link
              to="/admin/orders"
              className="text-xs uppercase tracking-wider text-black/40 hover:text-black transition-colors"
            >
              View All
            </Link>
          </div>
          {recentOrders && recentOrders.length > 0 ? (
            <div className="divide-y divide-black/5">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 flex items-center justify-between hover:bg-[#f3f3f3] transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">
                      Order #{String(order.id).padStart(4, "0")}
                    </p>
                    <p className="text-xs text-black/40">
                      {order.customerName} - {order.phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      Rs. {order.totalAmount}
                    </p>
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                        order.status === "pending"
                          ? "bg-yellow-50 text-yellow-700"
                          : order.status === "shipped"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-green-50 text-green-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-black/40">
              No orders yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
