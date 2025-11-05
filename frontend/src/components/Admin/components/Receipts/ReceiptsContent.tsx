"use client"

import { useState, useEffect } from "react"
import { IImportReceipt } from "@/types/types"
import StatsCard from "./components/StatsCard"
import SearchAction from "./components/SearchAction"
import TableManagerReceipts from "./components/TableManagerReceipts"
import PaginationReceipts from "./components/PaginationReceipts"
import HeaderManagerReceipts from "./components/HeaderManagerReceipts"
import { getAllImportReceipts, addImportReceipt, updateImportReceipt, deleteImportReceipt, CreateImportReceiptDTO, UpdateImportReceiptDTO } from "@/apis/importReceiptApi"
import { toast } from "sonner"
import ViewDetailsReceipts from "./components/Dialog/ViewDetailsReceipts/ViewDetailsReceipts"
import EditReceiptDialog from "./components/Dialog/EditReceiptDialog"

export default function ReceiptsContent() {
    const [receipts, setReceipts] = useState<IImportReceipt[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [selectedReceipt, setSelectedReceipt] = useState<IImportReceipt | null>(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

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

    const filteredReceipts = receipts.filter((receipt) => {
        const receiptId = (receipt.importId || receipt.import_id || 0).toString()
        const matchesSearch =
            receiptId.includes(searchTerm.toLowerCase()) ||
            (receipt.supplierName || receipt.supplier?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            receipt.note?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || receipt.status === statusFilter

        return matchesSearch && matchesStatus
    })

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

    if (loading) {
        return (
            <div className=" p-6 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        )
    }

    return (
        <div className=" p-6">
            <div className="mx-auto space-y-6">
                <HeaderManagerReceipts
                    isAddDialogOpen={isAddDialogOpen}
                    setIsAddDialogOpen={setIsAddDialogOpen}
                    handleAddReceipt={handleAddReceipt}
                />
                <StatsCard
                    totalReceipts={totalReceipts}
                    pendingReceipts={pendingReceipts}
                    completedReceipts={completedReceipts}
                />
                <SearchAction
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />
                <TableManagerReceipts
                    receipts={receipts}
                    filteredReceipts={filteredReceipts}
                    setSelectedReceipt={setSelectedReceipt}
                    setIsDetailDialogOpen={setIsDetailDialogOpen}
                    setIsEditDialogOpen={setIsEditDialogOpen}
                    handleDeleteReceipt={handleDeleteReceipt}
                />

                <PaginationReceipts totalItems={filteredReceipts.length} />

                <ViewDetailsReceipts
                    isDetailDialogOpen={isDetailDialogOpen}
                    setIsDetailDialogOpen={setIsDetailDialogOpen}
                    selectedReceipt={selectedReceipt}
                    setSelectedReceipt={setSelectedReceipt}
                    setIsEditDialogOpen={setIsEditDialogOpen}
                />

                <EditReceiptDialog
                    isOpen={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    selectedReceipt={selectedReceipt}
                    onSubmit={async (data: UpdateImportReceiptDTO) => {
                        await handleEditReceipt(data)
                        setSelectedReceipt(null)
                    }}
                />
            </div>
        </div>
    )
}

