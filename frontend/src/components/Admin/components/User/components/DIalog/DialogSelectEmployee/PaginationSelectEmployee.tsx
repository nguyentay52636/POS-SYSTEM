
import { useEffect } from 'react';
import Pagination from '@/components/ui/pagination';
import { usePagination } from '@/context/PaginationContext';

interface PaginationSelectEmployeeProps {
    totalItems: number;
    className?: string;
}

export default function PaginationSelectEmployee({
    totalItems,
    className = ""
}: PaginationSelectEmployeeProps) {
    const {
        paginationState,
        setCurrentPage,
        setRowsPerPage,
        setTotalItems
    } = usePagination();

    useEffect(() => {
        setTotalItems(totalItems)
    }, [setTotalItems, totalItems])

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