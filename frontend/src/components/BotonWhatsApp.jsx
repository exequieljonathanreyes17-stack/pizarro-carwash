import { MessageCircle } from "lucide-react";

export default function BotonWhatsApp() {
  return (
    <a
      href="https://wa.me/5493804111152"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-400"
      aria-label="Escribinos por WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}
