import chatbot from "../assets/chatbot-rosario.webp";
import chatbotSmall from "../assets/chatbot-rosario-small.webp";
import SectionTitle from "./SectionTitle.jsx";

export default function ChatbotPreview() {
  return (
    <section aria-labelledby="chatbot-preview-title" className="px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto grid max-w-3xl grid-cols-[88px_minmax(0,1fr)] items-center gap-4 min-[390px]:grid-cols-[104px_minmax(0,1fr)] sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-8 md:grid-cols-[180px_minmax(0,1fr)]">
        <img
          src={chatbotSmall}
          srcSet={`${chatbotSmall} 240w, ${chatbot} 480w`}
          sizes="(min-width: 768px) 180px, (min-width: 640px) 160px, (min-width: 390px) 104px, 88px"
          width="480"
          height="717"
          alt=""
          loading="lazy"
          decoding="async"
          className="block h-auto w-full object-contain"
        />
        <div className="min-w-0 max-w-lg">
          <SectionTitle as="h2" id="chatbot-preview-title" title="El chatbot de" accent="La Libertad Avanza" className="section-title--compact" />
          <p className="mt-3 text-sm leading-relaxed text-liberty-text-secondary sm:text-base">
            Recibe tus reclamos sobre la ciudad de Rosario.
          </p>
          <a
            href="https://llareclamosrosario.com/"
            className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-liberty-primary px-5 py-3 text-center text-sm font-bold leading-snug text-white transition-colors hover:bg-liberty-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-liberty-bg"
          >
            Hacer un reclamo<span className="sr-only"> en Rosario</span>
          </a>
        </div>
      </div>
    </section>
  );
}
