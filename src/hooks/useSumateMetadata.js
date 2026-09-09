import { useEffect } from "react";
import image from "../assets/militantes.webp";

const siteUrl = "https://www.lalibertadavanzasantafe.com";
const pageUrl = `${siteUrl}/sumate`;
const title = "Sumate | La Libertad Avanza Santa Fe";
const description =
  "Sumate a La Libertad Avanza Santa Fe. Conocé cómo participar y dejá tus datos para que un referente de tu localidad se contacte con vos.";

export default function useSumateMetadata() {
  useEffect(() => {
    const previousTitle = document.title;
    const cleanups = [];
    const imageUrl = new URL(image, siteUrl).href;

    function update(selector, tag, attributes) {
      let element = document.head.querySelector(selector);
      const created = !element;
      if (created) {
        element = document.createElement(tag);
        document.head.appendChild(element);
      }
      const previous = Object.keys(attributes).map((key) => [
        key, element.getAttribute(key),
      ]);
      Object.entries(attributes).forEach(([key, value]) =>
        element.setAttribute(key, value),
      );
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
      "og:image:width": "1280",
      "og:image:height": "816",
      "og:image:alt": "Encuentro de militantes con banderas argentinas y de La Libertad Avanza",
      "twitter:card": "summary_large_image",
      "twitter:title": title,
      "twitter:description": description,
      "twitter:image": imageUrl,
      "twitter:image:alt": "Encuentro de militantes de La Libertad Avanza",
    };
    Object.entries(tags).forEach(([name, content]) => {
      const attribute = name.startsWith("og:") ? "property" : "name";
      update(`meta[${attribute}="${name}"]`, "meta", { [attribute]: name, content });
    });

    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": pageUrl,
      url: pageUrl,
      name: title,
      description,
      inLanguage: "es-AR",
      isPartOf: { "@id": `${siteUrl}/#website` },
      primaryImageOfPage: { "@type": "ImageObject", url: imageUrl },
    });
    document.head.appendChild(schema);
    return () => {
      document.title = previousTitle;
      schema.remove();
      cleanups.reverse().forEach((cleanup) => cleanup());
    };
  }, []);
}
