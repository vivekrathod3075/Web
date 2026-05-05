import { useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router";
import { CheckCircle, MessageCircle, Home, ShoppingBag } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { whatsappUrl } = (location.state as { whatsappUrl?: string }) || {};

  useEffect(() => {
    if (!whatsappUrl) {
      navigate("/");
    }
  }, [whatsappUrl, navigate]);

  if (!whatsappUrl) return null;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="pt-24 lg:pt-32 pb-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-3xl lg:text-4xl font-medium tracking-tight mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-black/50 mb-8 leading-relaxed">
              Thank you for your order. Click the button below to send your order details via WhatsApp for quick confirmation. Our team will process your order shortly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 text-sm font-medium uppercase tracking-wider hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Send Order on WhatsApp
              </a>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-sm font-medium uppercase tracking-wider hover:bg-black/80 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-black/40 hover:text-black transition-colors"
            >
              <Home className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
