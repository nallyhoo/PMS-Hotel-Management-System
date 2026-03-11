import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showPageSize?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  showPageSize = true,
}: PaginationProps) {
  const pageSizeOptions = [10, 25, 50, 100, 999999];

  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  const getLabel = (size: number) => {
    if (size === 999999) return 'All';
    return String(size);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-[#1a1a1a]/5">
      <div className="flex items-center gap-4">
        <span className="text-xs text-[#1a1a1a]/60">
          Showing <span className="font-medium text-[#1a1a1a]">{start}</span> to{' '}
          <span className="font-medium text-[#1a1a1a]">{end}</span> of{' '}
          <span className="font-medium text-[#1a1a1a]">{total}</span> results
        </span>
      </div>

      <div className="flex items-center gap-4">
        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#1a1a1a]/60">Show</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="text-xs border border-[#1a1a1a]/10 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {getLabel(size)}
                </option>
              ))}
            </select>
            <span className="text-xs text-[#1a1a1a]/60">entries</span>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-[#1a1a1a]/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (
                totalPages <= 7 ||
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 text-xs rounded-lg transition-colors ${
                      page === currentPage
                        ? 'bg-[#1a1a1a] text-white'
                        : 'hover:bg-[#1a1a1a]/5 text-[#1a1a1a]/60'
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (
                page === currentPage - 2 ||
                page === currentPage + 2
              ) {
                return (
                  <span key={page} className="text-[#1a1a1a]/40">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg hover:bg-[#1a1a1a]/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
