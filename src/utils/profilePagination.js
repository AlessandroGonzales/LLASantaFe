export const DEPUTIES_PAGE_SIZE = 6;
export const COUNCILLORS_PAGE_SIZE = 8;

export function paginateProfiles(items, requestedPage, pageSize) {
  if (!Number.isInteger(pageSize) || pageSize < 1) {
    throw new RangeError("El tamaño de página debe ser un entero positivo.");
  }
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(pageCount, Math.max(1, Math.trunc(requestedPage) || 1));
  const start = (page - 1) * pageSize;
  return {
    page,
    pageCount,
    items: items.slice(start, start + pageSize),
    total: items.length,
    from: items.length ? start + 1 : 0,
    to: Math.min(start + pageSize, items.length),
  };
}
