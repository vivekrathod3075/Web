import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { ArrowRight, Star, TrendingUp, Shield, Truck, RotateCcw } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { trpc } from "@/providers/trpc";
import { useCartStore } from "@/store/cartStore";
import { BRAND_NAME } from "@/const";
import toast from "react-hot-toast";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <CollectionShowcase />
      <FeaturedProducts />
      <CategoriesSection />
      <EditorialDetails />
      <WhyChooseUs />
      <NewsletterSection />
      <Footer />
    </div>
  );
}

function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const eRef = useRef<HTMLSpanElement>(null);
  const pRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        eRef.current,
        { x: 0, rotateY: 0 },
        {
          x: -200,
          rotateY: 35,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      gsap.fromTo(
        pRef.current,
        { x: 0, rotateY: 0 },
        {
          x: 200,
          rotateY: -35,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden bg-white flex items-center justify-center perspective-1200"
    >
      {/* Background reveal word */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <span className="text-[3vw] tracking-[0.5em] uppercase text-black/10 font-medium">
          ELEVATE PREMIUM
        </span>
      </div>

      {/* Main 3D Text */}
      <div className="relative z-10 flex items-center justify-center preserve-3d">
        <div className="flex items-center">
          <span
            ref={eRef}
            className="text-[25vw] font-medium leading-none tracking-[-0.05em] text-black preserve-3d inline-block"
            style={{ transformStyle: "preserve-3d" }}
          >
            E
          </span>
          <span
            ref={pRef}
            className="text-[25vw] font-medium leading-none tracking-[-0.05em] text-black preserve-3d inline-block"
            style={{ transformStyle: "preserve-3d" }}
          >
            P
          </span>
        </div>
      </div>

      {/* Sub-text */}
      <div className="absolute bottom-12 left-0 right-0 text-center z-20">
        <p className="text-sm tracking-[0.3em] uppercase text-black/50 mb-4">
          Wear Your Style. Premium Tees.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 text-sm font-medium tracking-wide uppercase hover:bg-black/80 transition-colors"
        >
          Shop Collection <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

function CollectionShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "center center",
          scrub: true,
        },
      })
        .to(imageRef.current, { clipPath: "inset(0 0 0% 0)", duration: 1 }, 0)
        .to(imgRef.current, { scale: 1, filter: "blur(0px)", duration: 1 }, 0)
        .to(sectionRef.current, { backgroundColor: "#ffffff", duration: 1 }, 0);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-black py-20 lg:py-32"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3">New Collection</p>
          <h2 className="text-4xl lg:text-6xl font-medium tracking-tight text-white">
            The Essential Edit
          </h2>
        </div>
        <div
          ref={imageRef}
          className="w-[90%] lg:w-[80%] mx-auto overflow-hidden"
          style={{ clipPath: "inset(0 0 100% 0)" }}
        >
          <img
            ref={imgRef}
            src="/hero-editorial.jpg"
            alt="EP BRAND Collection"
            className="w-full h-auto object-cover"
            style={{ transform: "scale(1.2)", filter: "blur(10px)" }}
          />
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const { data: featured } = trpc.product.featured.useQuery();
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (product: NonNullable<typeof featured>[0]) => {
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

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-black/40 mb-3">
              Curated Selection
            </p>
            <h2 className="text-3xl lg:text-5xl font-medium tracking-tight">
              Featured Pieces
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden sm:flex items-center gap-2 text-sm font-medium hover:opacity-60 transition-opacity"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured?.slice(0, 4).map((product) => {
            const images = product.images as string[];
            const hasDiscount = product.discountPrice && Number(product.discountPrice) < Number(product.price);
            return (
              <div key={product.id} className="group relative">
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
                  <h3 className="text-sm font-medium mb-2">{product.name}</h3>
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
                </div>
                {/* Liquid Glass Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-400 flex items-end justify-center p-4"
                  style={{
                    borderRadius: "0",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.5) 100%)",
                      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                      mixBlendMode: "screen",
                      opacity: 0.3,
                    }}
                  />
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="relative z-10 bg-black text-white rounded-full px-6 py-2.5 text-xs font-medium uppercase tracking-wider hover:bg-black/80 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  const categories = [
    { name: "Oversized", image: "/product-oversized-black.jpg", count: "12 Products" },
    { name: "Printed", image: "/product-printed-abstract.jpg", count: "8 Products" },
    { name: "Plain", image: "/product-black-folded.jpg", count: "15 Products" },
    { name: "Casual", image: "/product-beige-cream.jpg", count: "10 Products" },
  ];

  return (
    <section className="py-20 lg:py-32 bg-[#f3f3f3]">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-black/40 mb-3">
            Browse by Style
          </p>
          <h2 className="text-3xl lg:text-5xl font-medium tracking-tight">
            Categories
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${cat.name}`}
              className="group relative aspect-[3/4] overflow-hidden bg-white"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white text-lg font-medium mb-1">{cat.name}</h3>
                <p className="text-white/70 text-xs">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function EditorialDetails() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  const details = [
    "100% Organic Cotton",
    "Reinforced Seams",
    "Pre-Shrunk Fabric",
    "Garment Washed",
    "Sustainable Production",
    "Made in India",
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = itemsRef.current?.querySelectorAll(".detail-item");
      items?.forEach((item) => {
        gsap.fromTo(
          item,
          { color: "rgba(0,0,0,0.2)" },
          {
            color: "rgba(0,0,0,1)",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              end: "top 40%",
              scrub: true,
            },
          },
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src="/fabric-texture.jpg"
              alt="Fabric Texture"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div ref={itemsRef} className="flex flex-col justify-center">
            <p className="text-xs tracking-[0.3em] uppercase text-black/40 mb-8">
              The Details
            </p>
            {details.map((detail, i) => (
              <div
                key={i}
                className="detail-item py-4 border-b border-black/10"
                style={{ color: "rgba(0,0,0,0.2)" }}
              >
                <span className="font-mono text-xs text-black/30 mr-4">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-2xl lg:text-4xl font-medium tracking-tight">
                  {detail}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const features = [
    { icon: Star, title: "Premium Quality", desc: "100% organic cotton, ethically sourced" },
    { icon: Truck, title: "Fast Delivery", desc: "Free shipping on orders over Rs. 2000" },
    { icon: RotateCcw, title: "Easy Returns", desc: "7-day hassle-free return policy" },
    { icon: Shield, title: "Secure Payment", desc: "Your data is always protected" },
  ];

  return (
    <section className="py-20 lg:py-32 bg-black text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3">
            Why EP BRAND
          </p>
          <h2 className="text-3xl lg:text-5xl font-medium tracking-tight">
            The EP Difference
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f) => (
            <div key={f.title} className="text-center">
              <f.icon className="w-8 h-8 mx-auto mb-4 text-white/60" />
              <h3 className="text-lg font-medium mb-2">{f.title}</h3>
              <p className="text-sm text-white/50">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const subscribe = trpc.subscriber.subscribe.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setEmail("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) subscribe.mutate({ email });
  };

  return (
    <section className="py-20 lg:py-32 bg-[#f3f3f3]">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-black/40 mb-3">
            Stay Connected
          </p>
          <h2 className="text-3xl lg:text-5xl font-medium tracking-tight mb-6">
            Join the Inner Circle
          </h2>
          <p className="text-black/50 mb-8">
            Subscribe for exclusive drops, early access to new collections, and member-only discounts.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white border border-black/10 text-sm focus:outline-none focus:border-black transition-colors"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-black/80 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
