import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="text-[20vw] font-medium leading-none tracking-tight text-black/10">
          404
        </h1>
        <p className="text-lg text-black/40 mb-8">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-black/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
