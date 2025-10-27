import Pagination from '@/components/ui/pagination'
import { usePagination } from '@/context/PaginationContext'

interface PaginationReceiptsProps {
    totalItems: number
    className?: string
}

export default function PaginationReceipts({
    totalItems,
    className = ""
}: PaginationReceiptsProps) {
    const {
        paginationState,
        setCurrentPage,
        setRowsPerPage
    } = usePagination()

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
    )
}

