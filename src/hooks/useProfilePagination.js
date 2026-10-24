import { useLayoutEffect, useRef, useState } from "react";
import { paginateProfiles } from "../utils/profilePagination";

export default function useProfilePagination(items, pageSize, gridRef) {
  const [requestedPage, setPage] = useState(1);
  const focusAfterChange = useRef(false);
  const pagination = paginateProfiles(items, requestedPage, pageSize);

  useLayoutEffect(() => {
    if (!focusAfterChange.current) return;
    focusAfterChange.current = false;
    gridRef.current?.focus({ preventScroll: true });
    gridRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [pagination.page, gridRef]);

  function changePage(nextPage) {
    const next = paginateProfiles(items, nextPage, pageSize).page;
    if (next === pagination.page) return;
    focusAfterChange.current = true;
    setPage(next);
  }

  return { ...pagination, changePage, resetPage: () => setPage(1) };
}
