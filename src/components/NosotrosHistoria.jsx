import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Expand, X } from "lucide-react";
import { historiaData, historiaPhotos } from "../data/historiaData";
import useHistoriaMetadata from "../hooks/useHistoriaMetadata";
import styles from "./NosotrosHistoria.module.css";

const heroPhoto = historiaData[1].photos[0];
const total = historiaData.length;
const chapterStart = historiaData.map((_, index) =>
  historiaData.slice(0, index).reduce((sum, chapter) => sum + chapter.photos.length, 0),
);

function HistoryPhoto({ photo, index, onOpen, featured = false }) {
  return (
    <figure className={featured ? styles.featuredPhoto : styles.photo}>
      <button
        type="button"
        className={styles.photoButton}
        onClick={() => onOpen(index)}
        aria-label={`Ampliar fotografía: ${photo.caption}`}
        aria-haspopup="dialog"
      >
        <img
          src={photo.src}
          srcSet={photo.srcSet}
          sizes={featured
            ? "(min-width: 1440px) 768px, (min-width: 960px) 56vw, calc(100vw - 40px)"
            : "(min-width: 1440px) 372px, (min-width: 960px) 27vw, (min-width: 600px) 45vw, calc(100vw - 40px)"}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          decoding="async"
        />
        <span className={styles.expandIcon} aria-hidden="true"><Expand size={17} /></span>
      </button>
      <figcaption>{photo.caption}</figcaption>
    </figure>
  );
}

function PhotoViewer({ initialIndex, onClose }) {
  const [index, setIndex] = useState(initialIndex);
  const dialogRef = useRef(null);
  const photo = historiaPhotos[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, []);

  const previous = () => setIndex((current) => (current - 1 + historiaPhotos.length) % historiaPhotos.length);
  const next = () => setIndex((current) => (current + 1) % historiaPhotos.length);

  return createPortal(
    <dialog
      ref={dialogRef}
      className={styles.viewer}
      aria-labelledby="historia-visor-title"
      aria-describedby="historia-visor-caption"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); previous(); }
        if (event.key === "ArrowRight") { event.preventDefault(); next(); }
      }}
    >
      <div className={styles.viewerHeader}>
        <h2 id="historia-visor-title">Archivo fotográfico</h2>
        <button type="button" onClick={onClose} aria-label="Cerrar galería"><X size={23} /></button>
      </div>
      <figure className={styles.viewerFigure}>
        <img key={photo.src} src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} />
        <figcaption id="historia-visor-caption" aria-live="polite" aria-atomic="true">
          <span>{photo.year} · {photo.chapter}</span>
          {photo.caption}
        </figcaption>
      </figure>
      <div className={styles.viewerControls}>
        <button type="button" onClick={previous} aria-label="Fotografía anterior"><ArrowLeft size={21} /></button>
        <span aria-live="polite" aria-atomic="true">{index + 1} / {historiaPhotos.length}</span>
        <button type="button" onClick={next} aria-label="Fotografía siguiente"><ArrowRight size={21} /></button>
      </div>
    </dialog>,
    document.body,
  );
}

export default function NosotrosHistoria() {
  const [activeChapter, setActiveChapter] = useState(historiaData[0].id);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const pageRef = useRef(null);
  useHistoriaMetadata();

  useEffect(() => {
    const page = pageRef.current;
    const navigation = page.querySelector("nav");
    if (!("ResizeObserver" in window)) return undefined;
    const observer = new ResizeObserver(() => {
      page.style.setProperty("--history-nav-height", `${navigation.getBoundingClientRect().height}px`);
    });
    observer.observe(navigation);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const chapters = [...pageRef.current.querySelectorAll("[data-history-chapter]")];
    if (!("IntersectionObserver" in window)) return undefined;
    const observer = new IntersectionObserver(() => {
      const readingLine = Math.max(160, window.innerHeight * 0.4);
      const current = [...chapters].reverse().find((chapter) =>
        chapter.getBoundingClientRect().top <= readingLine,
      );
      setActiveChapter(current?.id ?? historiaData[0].id);
    }, { rootMargin: "-140px 0px -45% 0px", threshold: 0 });
    chapters.forEach((chapter) => observer.observe(chapter));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // La página se carga de forma diferida; resolvemos el ancla al montar.
    const frame = requestAnimationFrame(() => {
      const id = window.location.hash.slice(1);
      const target = id && document.getElementById(id);
      if (target && pageRef.current?.contains(target)) {
        target.scrollIntoView({ behavior: "instant", block: "start" });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div ref={pageRef} className={styles.page}>
      <header className={styles.hero} id="historia-inicio" tabIndex={-1}>
        <div className={styles.heroImage}>
          <img
            src={heroPhoto.src}
            srcSet={heroPhoto.srcSet}
            sizes="100vw"
            alt={heroPhoto.alt}
            width={heroPhoto.width}
            height={heroPhoto.height}
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>La Libertad Avanza Santa Fe</p>
          <h1>Nuestra<br /><span>historia.</span></h1>
          <div className={styles.heroBottom}>
            <p>Los inicios, los encuentros y cada etapa.<br />Un recorrido por nuestra historia en Santa Fe.</p>
            <a className={styles.textLink} href={`#${historiaData[0].id}`}>
              Recorrer la historia <ArrowDown size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
        <span className={styles.heroDates} aria-hidden="true">2023 — 2025</span>
      </header>

      <nav className={styles.timeline} aria-label="Capítulos de nuestra historia">
        <ol>
          {historiaData.map((chapter) => (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                aria-current={activeChapter === chapter.id ? "step" : undefined}
                style={{ "--chapter-accent": chapter.accent }}
                onClick={() => setActiveChapter(chapter.id)}
              >
                <span>{chapter.year}</span>
                <span>{chapter.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className={styles.chapters}>
        {historiaData.map((chapter, index) => {
          const nextChapter = historiaData[index + 1];
          return (
            <section
              key={chapter.id}
              id={chapter.id}
              data-history-chapter
              tabIndex={-1}
              aria-labelledby={`${chapter.id}-title`}
              className={styles.chapter}
              style={{ "--chapter-accent": chapter.accent }}
            >
              <header className={styles.chapterHeading}>
                <time dateTime={chapter.year} className={styles.year}>{chapter.year}</time>
                <div>
                  <p className={styles.eyebrow}>Capítulo {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · {chapter.label}</p>
                  <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
                </div>
              </header>
              <div className={styles.chapterBody}>
                <div className={styles.story}>
                  <div className={styles.storyInner}>
                    {chapter.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
                    <span className={styles.storyRule} aria-hidden="true" />
                  </div>
                </div>
                <div className={styles.gallery}>
                  <HistoryPhoto photo={chapter.photos[0]} index={chapterStart[index]} onOpen={setSelectedPhoto} featured />
                  <div className={styles.photoPair}>
                    {chapter.photos.slice(1).map((photo, photoIndex) => (
                      <HistoryPhoto key={photo.src} photo={photo} index={chapterStart[index] + photoIndex + 1} onOpen={setSelectedPhoto} />
                    ))}
                  </div>
                </div>
              </div>
              {nextChapter && (
                <a className={styles.nextChapter} href={`#${nextChapter.id}`}>
                  <span>Siguiente capítulo <span>{nextChapter.year} · {nextChapter.label}</span></span>
                  <ArrowDown size={23} aria-hidden="true" />
                </a>
              )}
            </section>
          );
        })}
      </div>

      <footer className={styles.ending}>
        <p className={styles.eyebrow}>La Libertad Avanza Santa Fe</p>
        <p className={styles.endingTitle}>Nuestra historia,<br />año a año.</p>
        <a className={styles.textLink} href="#historia-inicio">Volver al inicio <ArrowUp size={18} aria-hidden="true" /></a>
      </footer>
      {selectedPhoto !== null && <PhotoViewer initialIndex={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
    </div>
  );
}
