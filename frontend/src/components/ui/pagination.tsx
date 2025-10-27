import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  rowsPerPage?: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange?: (rows: number) => void;
  totalItems: number;
  className?: string;
}

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  totalItems = 0,
  className = ""
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];

    // Always show first page
    if (currentPage > 3) {
      pages.push(1);
      if (currentPage > 4) {
        pages.push('...');
      }
    }

    // Calculate range of pages to show around current page
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Always show last page
    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  // Calculate the range of items being displayed
  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  const handleRowsPerPageChange = (value: string) => {
    if (onRowsPerPageChange) {
      onRowsPerPageChange(Number(value));
      // Reset to first page when changing rows per page
      onPageChange(1);
    }
  };

  return (
    <div className={`flex flex-col md:flex-row justify-between items-center mt-6 px-4 py-4  rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {/* Rows per page selector */}
      <div className="flex items-center space-x-3 mb-4 md:mb-0">
        <span className="text-sm text-gray-700">Hiển thị</span>
        <Select
          value={rowsPerPage.toString()}
          onValueChange={handleRowsPerPageChange}
        >
          <SelectTrigger className="w-[80px] h-8 text-sm cursor-pointer">
            <SelectValue placeholder={rowsPerPage} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5" className="cursor-pointer">5</SelectItem>
            <SelectItem value="10" className="cursor-pointer">10</SelectItem>
            <SelectItem value="20" className="cursor-pointer">20</SelectItem>
            <SelectItem value="50" className="cursor-pointer">50</SelectItem>
            <SelectItem value="100" className="cursor-pointer">100</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-700">dòng mỗi trang</span>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-2 mb-4 md:mb-0">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="h-8 w-8 rounded-md border-gray-200 bg-white text-gray-500 hover:bg-green-50 hover:border-green-300 hover:text-green-700 disabled:bg-gray-50 disabled:text-gray-400 cursor-pointer"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="h-8 w-8 rounded-md border-gray-200 bg-white text-gray-500 hover:bg-green-50 hover:border-green-300 hover:text-green-700 disabled:bg-gray-50 disabled:text-gray-400 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <Button
                key={index}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={`h-8 w-8 p-0 rounded-md cursor-pointer ${page === currentPage
                  ? 'bg-green-700 text-white hover:bg-green-800'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                  }`}
              >
                {page}
              </Button>
            ) : (
              <span key={index} className="text-gray-400 px-1">...</span>
            )
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="h-8 w-8 rounded-md border-gray-200 bg-white text-gray-500 hover:bg-green-500 hover:border-white-300 hover:text-white disabled:bg-gray-50 disabled:text-gray-400 cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 rounded-md border-gray-200 bg-white text-gray-500 bg-green-700 hover:bg-green-800 hover:border-white-300 hover:text-white disabled:bg-gray-50 disabled:text-gray-400 cursor-pointer"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Page info */}
      <div className="text-sm font-medium text-gray-700">
        Hiển thị <span className="text-green-700 font-semibold">{startItem}-{endItem}</span> trên <span className="text-green-700 font-semibold">{totalItems}</span> kết quả
      </div>
    </div>
  );
} 