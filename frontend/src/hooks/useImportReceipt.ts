import { useState, useEffect, useMemo } from "react"
import { IImportReceipt } from "@/types/types"
import { getAllImportReceipts, addImportReceipt, updateImportReceipt, deleteImportReceipt, updateStatusImportReceipt, CreateImportReceiptDTO, UpdateImportReceiptDTO } from "@/apis/importReceiptApi"
import { toast } from "sonner"
import { usePagination } from "@/context/PaginationContext"

export const useImportReceipt = () => {
    const [receipts, setReceipts] = useState<IImportReceipt[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [selectedReceipt, setSelectedReceipt] = useState<IImportReceipt | null>(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

    const { paginationState } = usePagination()

    // Fetch receipts on component mount
    useEffect(() => {
        fetchReceipts()
    }, [])

    const fetchReceipts = async () => {
        try {
            setLoading(true)
            const data = await getAllImportReceipts()
            setReceipts(data)
        } catch (error) {
            console.error("Error fetching receipts:", error)
            toast.error("Không thể tải danh sách phiếu nhập")
        } finally {
            setLoading(false)
        }
    }

    const filteredReceipts = useMemo(() => {
        return receipts.filter((receipt) => {
            const receiptId = (receipt.importId || receipt.import_id || 0).toString()
            const matchesSearch =
                receiptId.includes(searchTerm.toLowerCase()) ||
                (receipt.supplierName || receipt.supplier?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                receipt.note?.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus = statusFilter === "all" || receipt.status === statusFilter

            return matchesSearch && matchesStatus
        })
    }, [receipts, searchTerm, statusFilter])

    const paginatedReceipts = useMemo(() => {
        const startIndex = (paginationState.currentPage - 1) * paginationState.rowsPerPage
        const endIndex = startIndex + paginationState.rowsPerPage
        return filteredReceipts.slice(startIndex, endIndex)
    }, [filteredReceipts, paginationState.currentPage, paginationState.rowsPerPage])

    const totalReceipts = receipts.length
    const pendingReceipts = receipts.filter(r => r.status === "pending").length
    const completedReceipts = receipts.filter(r => r.status === "completed").length

    const handleAddReceipt = async (data: CreateImportReceiptDTO) => {
        try {
            const newReceipt = await addImportReceipt(data)
            setReceipts([...receipts, newReceipt])
            setIsAddDialogOpen(false)
            toast.success("Thêm phiếu nhập thành công!")
            fetchReceipts()
        } catch (error) {
            console.error("Error adding receipt:", error)
            toast.error("Không thể thêm phiếu nhập")
            throw error
        }
    }

    const handleEditReceipt = async (data: UpdateImportReceiptDTO) => {
        if (!selectedReceipt) return

        const receiptId = selectedReceipt.importId || selectedReceipt.import_id
        if (!receiptId) return

        try {
            const updatedReceipt = await updateImportReceipt(receiptId, data)
            const currentReceiptId = (r: IImportReceipt) => r.importId || r.import_id
            setReceipts(receipts.map((r) =>
                currentReceiptId(r) === receiptId ? updatedReceipt : r
            ))
            setIsEditDialogOpen(false)
            setSelectedReceipt(null)
            toast.success("Cập nhật phiếu nhập thành công!")
            fetchReceipts()
        } catch (error) {
            console.error("Error updating receipt:", error)
            toast.error("Không thể cập nhật phiếu nhập")
        }
    }

    const handleDeleteReceipt = async (receiptId: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa phiếu nhập này?")) return

        try {
            await deleteImportReceipt(receiptId)
            setReceipts(receipts.filter((r) => (r.importId || r.import_id) !== receiptId))
            toast.success("Xóa phiếu nhập thành công!")
            fetchReceipts()
        } catch (error) {
            console.error("Error deleting receipt:", error)
            toast.error("Không thể xóa phiếu nhập")
        }
    }

    const handleUpdateStatus = async (receiptId: number, status: string) => {
        try {
            const updatedReceipt = await updateStatusImportReceipt(receiptId, status)
            const currentReceiptId = (r: IImportReceipt) => r.importId || r.import_id
            setReceipts(receipts.map((r) =>
                currentReceiptId(r) === receiptId ? updatedReceipt : r
            ))
            toast.success("Cập nhật trạng thái thành công!")
            fetchReceipts()
        } catch (error) {
            console.error("Error updating status:", error)
            toast.error("Không thể cập nhật trạng thái")
        }
    }

    return {
        receipts,
        loading,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        selectedReceipt,
        setSelectedReceipt,
        isAddDialogOpen,
        setIsAddDialogOpen,
        isEditDialogOpen,
        setIsEditDialogOpen,
        isDetailDialogOpen,
        setIsDetailDialogOpen,
        filteredReceipts,
        paginatedReceipts,
        totalReceipts,
        pendingReceipts,
        completedReceipts,
        handleAddReceipt,
        handleEditReceipt,
        handleDeleteReceipt,
        handleUpdateStatus,
        fetchReceipts
    }
}
