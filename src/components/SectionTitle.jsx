import "./SectionTitle.css";

export default function SectionTitle({ as: Tag = "h1", title, accent, tone = "dark", breakLine = false, className = "", ...props }) {
  const text = title.trim(), words = text.split(/\s+/);
  const base = accent ? text : words.length > 1 ? words.slice(0, -1).join(" ") : "";
  const highlighted = accent || words.at(-1);
  return <Tag {...props} className={`section-title section-title--${tone} ${className}`}>
    {base ? <>{base}{breakLine && <br className="section-title-break" />}{" "}<span className="section-title-accent">{highlighted}</span></> : <span className="section-title-single">{highlighted}</span>}
  </Tag>;
}
