import Pagination from '@/components/ui/pagination';

// Pagination component for Order management
interface PaginationManagerOrderProps {
    currentPage: number;
    totalPages: number;
    rowsPerPage: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rows: number) => void;
    totalItems: number;
    className?: string;
}

export default function PaginationManagerOrder({
    currentPage,
    totalPages,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    totalItems,
    className = ""
}: PaginationManagerOrderProps) {
    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            totalItems={totalItems}
            className={className}
        />
    );
}
