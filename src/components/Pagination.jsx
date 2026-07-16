import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  limit,
  totalRecords,
  onPageChange,
  onLimitChange,
  isLoading = false,
}) {
  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      if (start > 2) {
        pages.push("ellipsis-start");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("ellipsis-end");
      }

      pages.push(totalPages);
    }
    return pages;
  };

  const startRecord = totalRecords > 0 ? (page - 1) * limit + 1 : 0;
  const endRecord = Math.min(page * limit, totalRecords);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-white border-t border-sand-200 rounded-b-xl">
      <div className="text-sm font-semibold text-forest-500">
        {totalRecords > 0 ? (
          <>
            Showing <span className="text-forest-900">{startRecord}</span> to{" "}
            <span className="text-forest-900">{endRecord}</span> of{" "}
            <span className="text-forest-900">{totalRecords}</span> entries
          </>
        ) : (
          "No entries to display"
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Limit Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-forest-400 uppercase tracking-wider">
            Rows per page
          </span>
          <div className="relative">
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              disabled={isLoading}
              className="h-9 pl-3 pr-8 rounded-lg border border-sand-200 text-[13px] font-semibold text-forest-700 outline-none focus:border-moss-400 bg-white appearance-none cursor-pointer disabled:opacity-50"
            >
              {[5, 10, 20, 50].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-400 h-3 w-3 rotate-90 pointer-events-none" />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-1">
          {/* Previous Page Button */}
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1 || isLoading}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-sand-200 text-forest-600 hover:bg-sand-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all cursor-pointer"
            aria-label="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((p, idx) => {
            if (p === "ellipsis-start" || p === "ellipsis-end") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex items-center justify-center w-9 h-9 text-forest-400 font-medium"
                >
                  •••
                </span>
              );
            }

            const isCurrent = page === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                disabled={isLoading}
                className={`flex items-center justify-center w-9 h-9 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-forest-950 text-white shadow-soft"
                    : "border border-transparent hover:border-sand-200 text-forest-600 hover:bg-sand-50"
                }`}
              >
                {p}
              </button>
            );
          })}

          {/* Next Page Button */}
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || isLoading}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-sand-200 text-forest-600 hover:bg-sand-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all cursor-pointer"
            aria-label="Next Page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
