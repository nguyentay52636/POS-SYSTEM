import Pagination from '@/components/ui/pagination'
import { usePagination } from '@/context/PaginationContext'

interface PaginationInventoryProps {
    totalItems: number
    className?: string
}

export default function PaginationInventory({
    totalItems,
    className = ""
}: PaginationInventoryProps) {
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

