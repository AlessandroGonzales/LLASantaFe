import { useEffect,  useState } from "react";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  MessageCircle,
  Share2,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { newsData } from "../data/noticiasData";

const SITE_URL = "https://www.lalibertadavanzasantafe.com";
const SITE_NAME = "La Libertad Avanza Santa Fe";

const spanishMonths = {
  enero: "01",
  febrero: "02",
  marzo: "03",
  abril: "04",
  mayo: "05",
  junio: "06",
  julio: "07",
  agosto: "08",
  septiembre: "09",
  octubre: "10",
  noviembre: "11",
  diciembre: "12",
};

const articleContentClasses = `
  text-base leading-[1.85] text-liberty-text-secondary md:text-lg
  [&>p]:mb-7 [&>p:last-child]:mb-0
  [&>h2]:mb-6 [&>h2]:mt-14 [&>h2]:text-2xl [&>h2]:font-black [&>h2]:leading-tight [&>h2]:text-white md:[&>h2]:text-3xl
  [&>h3]:mb-5 [&>h3]:mt-12 [&>h3]:text-xl [&>h3]:font-black [&>h3]:leading-tight [&>h3]:text-white md:[&>h3]:text-2xl [&>h3]:uppercase
  [&>strong]:font-bold [&>strong]:text-white
  [&>a]:font-bold [&>a]:text-liberty-primary [&>a]:underline [&>a]:underline-offset-4
  [&>blockquote]:my-10 [&>blockquote]:border-l-2 [&>blockquote]:border-liberty-primary [&>blockquote]:pl-6 [&>blockquote]:text-xl [&>blockquote]:font-medium [&>blockquote]:leading-relaxed [&>blockquote]:text-white
  [&>ul]:my-7 [&>ul]:list-disc [&>ul]:space-y-3 [&>ul]:pl-6
  [&>ol]:my-7 [&>ol]:list-decimal [&>ol]:space-y-3 [&>ol]:pl-6
  [&>.final-salute]:mt-10 [&>.final-salute]:font-black [&>.final-salute]:uppercase [&>.final-salute]:tracking-[0.2em] [&>.final-salute]:text-liberty-cyan
`;

function parsePublishedDate(value) {
  if (!value) return null;

  const match = value
    .trim()
    .toLocaleLowerCase("es-AR")
    .match(/^(\d{1,2})\s+de\s+([a-záéíóúñ]+),?\s+(\d{4})$/u);

  if (!match) return null;

  const [, day, monthName, year] = match;
  const month = spanishMonths[monthName];
  if (!month) return null;

  return `${year}-${month}-${day.padStart(2, "0")}`;
}

function formatPublishedDate(value, isoDate) {
  if (!isoDate) return value;

  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T12:00:00Z`));
}

function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}



function setMetaTag(attribute, name, content) {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  const wasCreated = !element;
  const previousContent = element?.getAttribute("content");

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);

  return () => {
    if (wasCreated) {
      element.remove();
    } else if (previousContent === null) {
      element.removeAttribute("content");
    } else {
      element.setAttribute("content", previousContent);
    }
  };
}

function setCanonicalUrl(url) {
  let element = document.head.querySelector('link[rel="canonical"]');
  const wasCreated = !element;
  const previousHref = element?.getAttribute("href");

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", url);

  return () => {
    if (wasCreated) {
      element.remove();
    } else if (previousHref === null) {
      element.removeAttribute("href");
    } else {
      element.setAttribute("href", previousHref);
    }
  };
}

function temporarilyRemoveMetaTag(attribute, name) {
  const element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) return () => {};

  const parent = element.parentNode;
  const nextSibling = element.nextSibling;
  element.remove();

  return () => {
    parent?.insertBefore(element, nextSibling);
  };
}

function useArticleMetadata(news, id) {
  useEffect(() => {
    const previousTitle = document.title;
    const cleanups = [];

    if (!news) {
      document.title = `Noticia no encontrada | ${SITE_NAME}`;
      cleanups.push(setMetaTag("name", "robots", "noindex, nofollow"));

      return () => {
        document.title = previousTitle;
        cleanups.reverse().forEach((cleanup) => cleanup());
      };
    }

    const canonicalUrl = `${SITE_URL}/noticia/${news.id}`;
    const imageUrl = new URL(news.image, SITE_URL).href;
    const title = `${news.title} | Noticias | ${SITE_NAME}`;
    const description = stripHtml(news.description).slice(0, 160);
    const publishedDate = parsePublishedDate(news.fecha);

    document.title = title;
    cleanups.push(setCanonicalUrl(canonicalUrl));
    cleanups.push(setMetaTag("name", "description", description));
    cleanups.push(setMetaTag("name", "robots", "index, follow"));
    cleanups.push(setMetaTag("property", "og:type", "article"));
    cleanups.push(setMetaTag("property", "og:title", title));
    cleanups.push(setMetaTag("property", "og:description", description));
    cleanups.push(setMetaTag("property", "og:url", canonicalUrl));
    cleanups.push(setMetaTag("property", "og:image", imageUrl));
    cleanups.push(setMetaTag("property", "og:image:secure_url", imageUrl));
    cleanups.push(setMetaTag("property", "og:image:type", "image/webp"));
    cleanups.push(temporarilyRemoveMetaTag("property", "og:image:width"));
    cleanups.push(temporarilyRemoveMetaTag("property", "og:image:height"));
    cleanups.push(
      setMetaTag("property", "og:image:alt", `Imagen de ${news.title}`),
    );
    cleanups.push(setMetaTag("name", "twitter:title", title));
    cleanups.push(setMetaTag("name", "twitter:description", description));
    cleanups.push(setMetaTag("name", "twitter:image", imageUrl));
    cleanups.push(
      setMetaTag("name", "twitter:image:alt", `Imagen de ${news.title}`),
    );

    if (publishedDate) {
      cleanups.push(
        setMetaTag("property", "article:published_time", publishedDate),
      );
    }

    const structuredData = document.createElement("script");
    structuredData.id = "news-article-structured-data";
    structuredData.type = "application/ld+json";
    structuredData.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: news.title,
      description,
      image: [imageUrl],
      ...(publishedDate ? { datePublished: publishedDate } : {}),
      mainEntityOfPage: canonicalUrl,
      author: {
        "@type": "Organization",
        name: SITE_NAME,
      },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logoweb.jpg`,
        },
      },
    });
    document.head
      .querySelector("#news-article-structured-data")
      ?.remove();
    document.head.appendChild(structuredData);

    return () => {
      document.title = previousTitle;
      structuredData.remove();
      cleanups.reverse().forEach((cleanup) => cleanup());
    };
  }, [id, news]);
}

function ArticleContent({ content }) {
  if (!content?.trim()) return null;

  const containsHtml = /<\/?[a-z][\s\S]*>/i.test(content);

  if (containsHtml) {
    return (
      <div
        className={articleContentClasses}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div className={articleContentClasses}>
      {content
        .trim()
        .split(/\n\s*\n/)
        .filter(Boolean)
        .map((paragraph) => (
          <p key={paragraph} className="whitespace-pre-line">
            {paragraph.trim()}
          </p>
        ))}
    </div>
  );
}

function XIcon({ className }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.25H5.078z" />
    </svg>
  );
}

export default function NoticiaDetalle() {
  const { id } = useParams();
  const [shareStatus, setShareStatus] = useState("");
  const noticia = newsData.find((news) => String(news.id) === id);

  useArticleMetadata(noticia, id);

  const publishedDate = parsePublishedDate(noticia?.fecha);
  const displayedDate = formatPublishedDate(noticia?.fecha, publishedDate);
  const canonicalUrl = noticia ? `${SITE_URL}/noticia/${noticia.id}` : SITE_URL;
  const shareText = noticia
    ? `${noticia.title}\n\n${noticia.description}\n\nLeé la nota completa:`
    : "";
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareText} ${canonicalUrl}`,
  )}`;
  const xShareUrl = `https://x.com/intent/post?${new URLSearchParams({
    text: shareText,
    url: canonicalUrl,
  }).toString()}`;

  const copyArticleLink = async () => {
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      setShareStatus("Enlace copiado");
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = canonicalUrl;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      const copied = document.execCommand("copy");
      textArea.remove();
      setShareStatus(copied ? "Enlace copiado" : "No se pudo copiar el enlace");
    }
  };

  const shareArticle = async () => {
    if (!navigator.share || !noticia) {
      await copyArticleLink();
      return;
    }

    try {
      await navigator.share({
        title: noticia.title,
        text: noticia.description,
        url: canonicalUrl,
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        setShareStatus("No se pudo abrir el menú para compartir");
      }
    }
  };

  if (!noticia) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center bg-liberty-bg px-6 pt-24 text-center text-white">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-liberty-primary">
          Noticias
        </p>
        <h1 className="mt-4 text-4xl font-black uppercase md:text-6xl">
          Noticia no encontrada
        </h1>
        <p className="mt-5 max-w-xl text-lg text-liberty-text-secondary">
          La publicación que buscás no está disponible.
        </p>
        <Link
          to="/#noticias"
          className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full border border-liberty-border bg-liberty-card px-6 py-3 text-sm font-black uppercase tracking-[0.12em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Volver a noticias
        </Link>
      </section>
    );
  }

  return (
    <article className="min-h-screen bg-liberty-bg pb-20 text-white">
      <header className="relative isolate flex min-h-[52svh] overflow-hidden md:min-h-[50svh]">
        <img
          src={noticia.image}
          alt={`Imagen principal de ${noticia.title}`}
          width="1600"
          height="900"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
          sizes="100vw"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-liberty-bg/40 via-liberty-bg/10 to-liberty-bg"
        />

        <div className="relative z-10 mx-auto flex min-h-full w-full max-w-7xl flex-col justify-end px-5 pb-12 pt-24 sm:px-6 md:pb-16 md:pt-28 lg:px-8">

          <div className="max-w-5xl">
            <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-bold uppercase tracking-[0.16em] text-white/75 sm:text-sm">
              <span className="text-liberty-primary">{noticia.category}</span>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/50" />
              <time dateTime={publishedDate ?? undefined}>{displayedDate}</time>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/50" />
            </div>

            <h1 className="max-w-5xl text-[clamp(2.6rem,5vw,5rem)] font-black uppercase leading-[0.92] tracking-[-0.04em] text-white [text-wrap:balance]">
              {noticia.title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-white/85 sm:text-xl md:text-2xl">
              {noticia.description}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-14 px-5 py-14 sm:px-6 md:py-20 lg:grid-cols-[minmax(0,46rem)_18rem] lg:justify-between lg:gap-20 lg:px-8">
        <div>
          <ArticleContent content={noticia.contenidoParte1} />

          {noticia.imagenSecundaria && (
            <figure className="my-12 overflow-hidden rounded-2xl border border-white/10 bg-liberty-card md:my-16">
              <img
                src={noticia.imagenSecundaria}
                alt={`Imagen complementaria de ${noticia.title}`}
                width="1600"
                height="900"
                loading="lazy"
                decoding="async"
                className="aspect-video h-auto w-full object-cover"
                sizes="(min-width: 1024px) 736px, 100vw"
              />
            </figure>
          )}

          <ArticleContent content={noticia.contenidoParte2} />

          <div className="mt-16 border-t border-liberty-border/50 pt-8">
            <Link
              to="/#noticias"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-white transition-colors hover:text-liberty-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Volver a últimas noticias
            </Link>
          </div>
        </div>

        <aside aria-labelledby="share-heading" className="relative">
          <div className="border-y border-liberty-border/60 py-7 lg:sticky lg:top-24">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-liberty-primary">
              Difundí la noticia
            </p>
            <h2 id="share-heading" className="mt-3 text-xl font-black text-white">
              Compartir esta nota
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={shareArticle}
                className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-liberty-border bg-liberty-card/60 px-4 text-left text-sm font-bold text-white transition-colors hover:border-liberty-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Share2 aria-hidden="true" className="h-4 w-4 text-liberty-primary" />
                Compartir
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-liberty-border bg-liberty-card/60 px-4 text-sm font-bold text-white transition-colors hover:border-liberty-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4 text-liberty-primary" />
                WhatsApp
              </a>
              <a
                href={xShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-liberty-border bg-liberty-card/60 px-4 text-sm font-bold text-white transition-colors hover:border-liberty-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <XIcon className="h-4 w-4 text-liberty-primary" />
                Compartir en X
              </a>
              <button
                type="button"
                onClick={copyArticleLink}
                className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-liberty-border bg-liberty-card/60 px-4 text-left text-sm font-bold text-white transition-colors hover:border-liberty-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Copy aria-hidden="true" className="h-4 w-4 text-liberty-primary" />
                Copiar enlace
              </button>
            </div>

            <p aria-live="polite" className="mt-3 min-h-5 text-sm text-liberty-text-secondary">
              {shareStatus}
            </p>

            {(noticia.linkX || noticia.linkInstagram) && (
              <div className="mt-6 border-t border-liberty-border/40 pt-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-liberty-text-secondary">
                  Publicación relacionada
                </p>
                <div className="flex flex-col gap-2">
                  {noticia.linkX && (
                    <a
                      href={noticia.linkX}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-white hover:text-liberty-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      Ver publicación en X
                      <ExternalLink aria-hidden="true" className="h-4 w-4" />
                    </a>
                  )}
                  {noticia.linkInstagram && (
                    <a
                      href={noticia.linkInstagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-white hover:text-liberty-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      Ver publicación en Instagram
                      <ExternalLink aria-hidden="true" className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}
