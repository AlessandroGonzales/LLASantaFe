import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProfilePagination({ pagination, label, gridId }) {
  const { page, pageCount, from, to, total, changePage } = pagination;
  const buttonClass = "inline-flex min-h-11 items-center justify-center gap-1 rounded-sm border border-liberty-border px-3 max-[359px]:px-2 sm:px-4 text-xs font-bold uppercase tracking-wider max-[359px]:tracking-normal text-white transition-colors hover:border-liberty-primary hover:text-liberty-primary disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-liberty-primary";

  return (
    <>
      <p role="status" className="sr-only">
        {total ? `${label}: mostrando ${from} a ${to} de ${total}. Página ${page} de ${pageCount}.` : `No hay ${label.toLowerCase()}.`}
      </p>
      {pageCount > 1 && (
        <nav aria-label={`Paginación de ${label.toLowerCase()}`} className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-6">
          <button type="button" className={buttonClass} disabled={page === 1} onClick={() => changePage(page - 1)} aria-controls={gridId}>
            <ChevronLeft size={16} aria-hidden="true" /> Anterior
          </button>
          <span className="order-first w-full sm:order-none sm:w-auto text-xs text-liberty-text-secondary text-center">Página {page} de {pageCount}</span>
          <button type="button" className={buttonClass} disabled={page === pageCount} onClick={() => changePage(page + 1)} aria-controls={gridId}>
            Siguiente <ChevronRight size={16} aria-hidden="true" />
          </button>
        </nav>
      )}
    </>
  );
}
