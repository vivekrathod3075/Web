import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, LogIn, UserPlus, Shield } from "lucide-react";
import { trpc } from "@/providers/trpc";
import toast from "react-hot-toast";

function getOAuthUrl() {
  const authUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(authUrl);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({
    username: "",
    password: "",
    displayName: "",
  });

  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("local_auth_token", data.token);
      toast.success("Logged in successfully!");
      setTimeout(() => {
        window.location.href = "/";
      }, 300);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const registerMutation = trpc.localAuth.register.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("local_auth_token", data.token);
      toast.success("Account created!");
      setTimeout(() => {
        window.location.href = "/";
      }, 300);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      loginMutation.mutate({
        username: form.username,
        password: form.password,
      });
    } else {
      registerMutation.mutate({
        username: form.username,
        password: form.password,
        displayName: form.displayName,
      });
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-black/40 hover:text-black transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-medium tracking-tight mb-2">EP BRAND</h1>
          <p className="text-sm text-black/40">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </p>
        </div>

        {/* OAuth Login */}
        <a
          href={getOAuthUrl()}
          className="w-full flex items-center justify-center gap-2 bg-[#f3f3f3] text-black py-3.5 text-sm font-medium hover:bg-black/5 transition-colors mb-6"
        >
          <Shield className="w-4 h-4" />
          Continue with Kimi OAuth
        </a>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-black/10" />
          <span className="text-xs text-black/40 uppercase tracking-wider">
            or
          </span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        {/* Local Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-black/40 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={form.displayName}
                onChange={(e) =>
                  setForm({ ...form, displayName: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#f3f3f3] border-0 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="Your display name"
              />
            </div>
          )}
          <div>
            <label className="block text-xs uppercase tracking-wider text-black/40 mb-2">
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              className="w-full px-4 py-3 bg-[#f3f3f3] border-0 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-black/40 mb-2">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-[#f3f3f3] border-0 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Enter password (min 6 chars)"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 bg-black text-white py-3.5 text-sm font-medium uppercase tracking-wider hover:bg-black/80 transition-colors disabled:opacity-50"
          >
            {mode === "login" ? (
              <>
                <LogIn className="w-4 h-4" />
                {isPending ? "Logging in..." : "Login"}
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                {isPending ? "Creating..." : "Create Account"}
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-black/40 mt-6">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setMode("register")}
                className="text-black underline hover:no-underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-black underline hover:no-underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
