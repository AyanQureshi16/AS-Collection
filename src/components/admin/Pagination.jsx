import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage = 1,
  totalItems = 892,
  itemsPerPage = 10,
  onPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Determine the window of visible page buttons (max 5)
  const getPageNumbers = () => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getPageNumbers();
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <p className="text-white/50 text-sm font-inter">
        Showing {startIndex} to {endIndex} of {totalItems} results
      </p>
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={currentPage === 1}
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          aria-label="Previous page"
          title="Previous page"
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} />
        </motion.button>
        <div className="flex items-center gap-1">
          {visiblePages[0] > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange && onPageChange(1)}
                aria-label="Go to page 1"
                title="Go to page 1"
                className="w-10 h-10 rounded-lg font-poppins font-medium text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                1
              </motion.button>
              {visiblePages[0] > 2 && (
                <span className="text-white/30 px-1 text-sm">...</span>
              )}
            </>
          )}

          {visiblePages.map((page) => (
            <motion.button
              key={page}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange && onPageChange(page)}
              aria-label={`Go to page ${page}`}
              title={`Go to page ${page}`}
              className={`w-10 h-10 rounded-lg font-poppins font-medium text-sm transition-all duration-200
                ${currentPage === page
                  ? "bg-gold text-primary"
                  : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
            >
              {page}
            </motion.button>
          ))}

          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                <span className="text-white/30 px-1 text-sm">...</span>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange && onPageChange(totalPages)}
                aria-label={`Go to page ${totalPages}`}
                title={`Go to page ${totalPages}`}
                className="w-10 h-10 rounded-lg font-poppins font-medium text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                {totalPages}
              </motion.button>
            </>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          aria-label="Next page"
          title="Next page"
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </div>
  );
}
