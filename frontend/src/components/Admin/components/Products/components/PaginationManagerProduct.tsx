
import Pagination from '@/components/ui/pagination';
import { usePagination } from '@/context/PaginationContext';

interface PaginationManagerProductProps {
    totalItems: number;
    className?: string;
}

export default function PaginationSuppliers({
    totalItems,
    className = ""
}: PaginationManagerProductProps) {
    const {
        paginationState,
        setCurrentPage,
        setRowsPerPage
    } = usePagination();

    return (
        <Pagination
            currentPage={paginationState.currentPage}
            totalPages={paginationState.totalPages}
            rowsPerPage={paginationState.rowsPerPage}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={setRowsPerPage}
            totalItems={totalItems}
            className={className}
        />
    );
}