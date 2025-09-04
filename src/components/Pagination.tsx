import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  scrollToTop?: boolean;
  position?: 'top' | 'bottom';
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  scrollToTop = false,
  position = 'bottom'
}) => {
  const { isArabic } = useLanguage();

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    onPageChange(page);
    
    // Scroll to top if enabled (typically for bottom pagination)
    if (scrollToTop) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <motion.div
      className={`flex flex-col items-center gap-6 ${position === 'top' ? 'mb-8' : 'mt-12'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Items info */}
      <div className="text-gray-600 text-sm">
        {isArabic 
          ? `عرض ${startItem} إلى ${endItem} من ${totalItems} منتج`
          : `Showing ${startItem} to ${endItem} of ${totalItems} products`
        }
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <motion.button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center px-3 py-2 rounded-lg border transition-all duration-200 ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          }`}
          whileHover={currentPage !== 1 ? { scale: 1.05 } : undefined}
          whileTap={currentPage !== 1 ? { scale: 0.95 } : undefined}
        >
          {isArabic ? (
            <>
              <span className="text-sm font-medium ml-1">السابق</span>
              <ChevronRight className="h-4 w-4" />
            </>
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm font-medium ml-1">Previous</span>
            </>
          )}
        </motion.button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-400">...</span>
              ) : (
                <motion.button
                  onClick={() => handlePageChange(page as number)}
                  className={`px-3 py-2 rounded-lg border transition-all duration-200 min-w-[40px] ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={currentPage === page ? { scale: 1.1 } : undefined}
                  animate={currentPage === page ? { scale: 1 } : undefined}
                >
                  <span className="text-sm font-medium">{page}</span>
                </motion.button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next button */}
        <motion.button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center px-3 py-2 rounded-lg border transition-all duration-200 ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          }`}
          whileHover={currentPage !== totalPages ? { scale: 1.05 } : undefined}
          whileTap={currentPage !== totalPages ? { scale: 0.95 } : undefined}
        >
          {isArabic ? (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm font-medium mr-1">التالي</span>
            </>
          ) : (
            <>
              <span className="text-sm font-medium mr-1">Next</span>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};