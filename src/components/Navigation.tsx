import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { ShoppingBag, Menu, X, User, Shield } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/hooks/useAuth";
import { BRAND_NAME } from "@/const";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const cartCount = useCartStore((s) => s.getCount());
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 50);
      setHidden(currentY > lastScrollY && currentY > 100);
      setLastScrollY(currentY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isAdminPage = location.pathname.startsWith("/admin");
  if (isAdminPage) return null;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/forum", label: "Forum" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-black/5"
            : "bg-transparent"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="text-xl lg:text-2xl font-medium tracking-[-0.02em] text-black"
            >
              {BRAND_NAME}
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium tracking-wide uppercase transition-colors ${
                    location.pathname === link.to
                      ? "text-black"
                      : "text-black/50 hover:text-black"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden md:flex items-center gap-1.5 text-sm text-black/60 hover:text-black transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
              {user ? (
                <button
                  onClick={logout}
                  className="hidden md:flex items-center gap-1.5 text-sm text-black/60 hover:text-black transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:flex items-center gap-1.5 text-sm text-black/60 hover:text-black transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
              <Link
                to="/checkout"
                className="relative p-2 hover:bg-black/5 transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-black text-white text-[10px] font-medium flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 hover:bg-black/5 transition-colors"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-20 px-6 md:hidden">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-2xl font-medium tracking-tight"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" className="text-2xl font-medium tracking-tight flex items-center gap-2">
                <Shield className="w-5 h-5" /> Admin
              </Link>
            )}
            {user ? (
              <button onClick={logout} className="text-2xl font-medium tracking-tight text-left">
                Logout
              </button>
            ) : (
              <Link to="/login" className="text-2xl font-medium tracking-tight">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
