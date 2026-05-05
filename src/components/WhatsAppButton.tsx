import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/const";

export default function WhatsAppButton() {
  const handleClick = () => {
    const message = encodeURIComponent("Hello EP BRAND! I have a question.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors"
      title="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
}
