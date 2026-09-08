import { useEffect } from "react";
import { historiaData } from "../data/historiaData";

const siteUrl = "https://www.lalibertadavanzasantafe.com";
const pageUrl = `${siteUrl}/nosotros`;
const title = "Nuestra historia | La Libertad Avanza Santa Fe";
const description = "Recorré la historia de La Libertad Avanza Santa Fe: los inicios en 2023, la conformación del partido y UPL en 2024 y la consolidación en 2025.";

export default function useHistoriaMetadata() {
  useEffect(() => {
    const previousTitle = document.title;
    const cleanups = [];
    const photo = historiaData[1].photos[0];
    const imageUrl = new URL(photo.src, siteUrl).href;

    function update(selector, tag, attributes) {
      let element = document.head.querySelector(selector);
      const created = !element;
      if (created) {
        element = document.createElement(tag);
        document.head.appendChild(element);
      }
      const previous = Object.keys(attributes).map((key) => [key, element.getAttribute(key)]);
      Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
      cleanups.push(() => {
        if (created) element.remove();
        else previous.forEach(([key, value]) => {
          if (value === null) element.removeAttribute(key);
          else element.setAttribute(key, value);
        });
      });
    }

    document.title = title;
    update('link[rel="canonical"]', "link", { rel: "canonical", href: pageUrl });
    const tags = {
      description,
      "og:type": "website",
      "og:title": title,
      "og:description": description,
      "og:url": pageUrl,
      "og:image": imageUrl,
      "og:image:secure_url": imageUrl,
      "og:image:type": "image/webp",
      "og:image:width": "1440",
      "og:image:height": String(Math.round(photo.height * 1440 / photo.width)),
      "og:image:alt": photo.alt,
      "twitter:card": "summary_large_image",
      "twitter:title": title,
      "twitter:description": description,
      "twitter:image": imageUrl,
      "twitter:image:alt": photo.alt,
    };
    Object.entries(tags).forEach(([name, content]) => {
      const attribute = name.startsWith("og:") ? "property" : "name";
      update(`meta[${attribute}="${name}"]`, "meta", { [attribute]: name, content });
    });

    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "@id": pageUrl,
      url: pageUrl,
      name: title,
      description,
      inLanguage: "es-AR",
      isPartOf: { "@id": `${siteUrl}/#website` },
      primaryImageOfPage: { "@type": "ImageObject", url: imageUrl },
      hasPart: historiaData.map((chapter) => ({
        "@type": "WebPageElement",
        "@id": `${pageUrl}#${chapter.id}`,
        name: `${chapter.year} · ${chapter.title}`,
        url: `${pageUrl}#${chapter.id}`,
      })),
    });
    document.head.appendChild(schema);
    return () => {
      document.title = previousTitle;
      schema.remove();
      cleanups.reverse().forEach((cleanup) => cleanup());
    };
  }, []);
}
