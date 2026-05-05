import { Link } from "react-router";
import { Phone, MapPin, Mail } from "lucide-react";
import { BRAND_NAME, CONTACT_PHONE, CONTACT_ADDRESS } from "@/const";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-medium tracking-tight mb-4">{BRAND_NAME}</h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Premium fashion brand specializing in high-quality T-shirts.
              Wear Your Style. Designed in Gujarat, made for the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest text-white/40 mb-6">
              Navigate
            </h4>
            <div className="flex flex-col gap-3">
              <Link to="/" className="text-sm text-white/70 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/shop" className="text-sm text-white/70 hover:text-white transition-colors">
                Shop All
              </Link>
              <Link to="/forum" className="text-sm text-white/70 hover:text-white transition-colors">
                Forum
              </Link>
              <Link to="/contact" className="text-sm text-white/70 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest text-white/40 mb-6">
              Categories
            </h4>
            <div className="flex flex-col gap-3">
              <Link to="/shop?category=Oversized" className="text-sm text-white/70 hover:text-white transition-colors">
                Oversized
              </Link>
              <Link to="/shop?category=Printed" className="text-sm text-white/70 hover:text-white transition-colors">
                Printed
              </Link>
              <Link to="/shop?category=Plain" className="text-sm text-white/70 hover:text-white transition-colors">
                Plain
              </Link>
              <Link to="/shop?category=Casual" className="text-sm text-white/70 hover:text-white transition-colors">
                Casual
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest text-white/40 mb-6">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-4">
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                {CONTACT_PHONE}
              </a>
              <div className="flex items-start gap-3 text-sm text-white/70">
                <MapPin className="w-4 h-4 mt-0.5" />
                {CONTACT_ADDRESS}
              </div>
              <a
                href="mailto:epbrand@gmail.com"
                className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                epbrand@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Designed with precision. Crafted with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
