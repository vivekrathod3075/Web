import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Phone, MapPin, Mail, Send, MessageCircle, Globe } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { trpc } from "@/providers/trpc";
import { CONTACT_PHONE, CONTACT_ADDRESS, WHATSAPP_NUMBER } from "@/const";
import toast from "react-hot-toast";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const submitContact = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    },
  });

  const { data: visitorCount } = trpc.visitor.count.useQuery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    submitContact.mutate(form);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="pt-24 lg:pt-32 pb-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-black/40 hover:text-black transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] uppercase text-black/40 mb-3">
                Get in Touch
              </p>
              <h1 className="text-3xl lg:text-5xl font-medium tracking-tight mb-4">
                Contact Us
              </h1>
              <p className="text-black/50 max-w-lg mx-auto">
                Have a question or feedback? We would love to hear from you. Reach out through any of the channels below.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Contact Info */}
              <div>
                <h2 className="text-sm uppercase tracking-wider text-black/40 mb-6">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  <a
                    href={`tel:${CONTACT_PHONE}`}
                    className="flex items-start gap-4 p-4 bg-[#f3f3f3] hover:bg-black hover:text-white transition-colors group"
                  >
                    <Phone className="w-5 h-5 mt-0.5 text-black/40 group-hover:text-white/60" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-black/40 group-hover:text-white/60 mb-1">
                        Phone
                      </p>
                      <p className="font-medium">{CONTACT_PHONE}</p>
                    </div>
                  </a>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 bg-[#f3f3f3] hover:bg-green-600 hover:text-white transition-colors group"
                  >
                    <MessageCircle className="w-5 h-5 mt-0.5 text-black/40 group-hover:text-white/60" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-black/40 group-hover:text-white/60 mb-1">
                        WhatsApp
                      </p>
                      <p className="font-medium">+{WHATSAPP_NUMBER}</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-4 bg-[#f3f3f3]">
                    <MapPin className="w-5 h-5 mt-0.5 text-black/40" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-black/40 mb-1">
                        Address
                      </p>
                      <p className="font-medium">{CONTACT_ADDRESS}</p>
                    </div>
                  </div>

                  <a
                    href="mailto:epbrand@gmail.com"
                    className="flex items-start gap-4 p-4 bg-[#f3f3f3] hover:bg-black hover:text-white transition-colors group"
                  >
                    <Mail className="w-5 h-5 mt-0.5 text-black/40 group-hover:text-white/60" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-black/40 group-hover:text-white/60 mb-1">
                        Email
                      </p>
                      <p className="font-medium">epbrand@gmail.com</p>
                    </div>
                  </a>

                  <Link
                    to="/forum"
                    className="flex items-start gap-4 p-4 bg-[#f3f3f3] hover:bg-black hover:text-white transition-colors group"
                  >
                    <Globe className="w-5 h-5 mt-0.5 text-black/40 group-hover:text-white/60" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-black/40 group-hover:text-white/60 mb-1">
                        Community
                      </p>
                      <p className="font-medium">Visit Public Forum</p>
                    </div>
                  </Link>
                </div>

                {/* Visitor Counter */}
                {visitorCount && (
                  <div className="mt-8 p-4 border border-black/10 text-center">
                    <p className="text-xs uppercase tracking-wider text-black/40 mb-1">
                      Total Visitors
                    </p>
                    <p className="text-3xl font-mono font-medium">
                      {visitorCount.total.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-sm uppercase tracking-wider text-black/40 mb-6">
                  Send a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-black/40 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-[#f3f3f3] border-0 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-black/40 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-[#f3f3f3] border-0 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="Your email"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-black/40 mb-2">
                      Message
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-[#f3f3f3] border-0 text-sm focus:outline-none focus:ring-1 focus:ring-black resize-none"
                      placeholder="Your message..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitContact.isPending}
                    className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 text-sm font-medium uppercase tracking-wider hover:bg-black/80 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {submitContact.isPending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
