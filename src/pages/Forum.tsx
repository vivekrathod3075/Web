import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Send, MessageSquare, User, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { trpc } from "@/providers/trpc";
import toast from "react-hot-toast";

export default function Forum() {
  const { data: messages, isLoading } = trpc.message.list.useQuery();
  const utils = trpc.useUtils();
  const [form, setForm] = useState({ name: "", email: "", content: "" });

  const createMessage = trpc.message.create.useMutation({
    onSuccess: () => {
      toast.success("Message posted!");
      setForm({ name: "", email: "", content: "" });
      utils.message.list.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.content) return;
    createMessage.mutate(form);
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

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.3em] uppercase text-black/40 mb-3">
                Community
              </p>
              <h1 className="text-3xl lg:text-5xl font-medium tracking-tight mb-4">
                Public Forum
              </h1>
              <p className="text-black/50 max-w-lg mx-auto">
                Share your thoughts, ask questions, or connect with other EP BRAND enthusiasts. No login required.
              </p>
            </div>

            {/* Post Form */}
            <div className="bg-[#f3f3f3] p-6 lg:p-8 mb-12">
              <h2 className="text-sm uppercase tracking-wider text-black/40 mb-6">
                Post a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    required
                    className="w-full px-4 py-3 bg-white border-0 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Your email"
                    required
                    className="w-full px-4 py-3 bg-white border-0 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write your message..."
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white border-0 text-sm focus:outline-none focus:ring-1 focus:ring-black resize-none"
                />
                <button
                  type="submit"
                  disabled={createMessage.isPending}
                  className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 text-sm font-medium uppercase tracking-wider hover:bg-black/80 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {createMessage.isPending ? "Posting..." : "Post Message"}
                </button>
              </form>
            </div>

            {/* Messages List */}
            <div>
              <h2 className="text-sm uppercase tracking-wider text-black/40 mb-6">
                Recent Messages ({messages?.length || 0})
              </h2>

              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-[#f3f3f3] h-24" />
                  ))}
                </div>
              ) : messages && messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="border border-black/10 p-6 hover:border-black/20 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-black/5 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-black/40" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-medium text-sm">
                              {msg.name}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-black/40">
                              <Clock className="w-3 h-3" />
                              {new Date(msg.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-black/70 leading-relaxed">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-[#f3f3f3]">
                  <MessageSquare className="w-8 h-8 mx-auto mb-4 text-black/20" />
                  <p className="text-black/40">No messages yet. Be the first to post!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
