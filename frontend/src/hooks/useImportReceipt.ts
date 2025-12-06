import { useState, useEffect, useMemo } from "react"
import { IImportReceipt } from "@/types/types"
import { getAllImportReceipts, addImportReceipt, updateImportReceipt, deleteImportReceipt, updateStatusImportReceipt, getImportReceiptById, CreateImportReceiptDTO, UpdateImportReceiptDTO } from "@/apis/importReceiptApi"
import { getAllInventory, addInventory, updateInventory } from "@/apis/inventoryApi"
import { IInventory } from "@/types/types"
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
            // Lấy thông tin receipt hiện tại để kiểm tra status cũ
            const currentReceipt = receipts.find((r) => (r.importId || r.import_id) === receiptId)
            const oldStatus = currentReceipt?.status

            // Cập nhật trạng thái
            const updatedReceipt = await updateStatusImportReceipt(receiptId, status)
            const currentReceiptId = (r: IImportReceipt) => r.importId || r.import_id
            setReceipts(receipts.map((r) =>
                currentReceiptId(r) === receiptId ? updatedReceipt : r
            ))
            toast.success("Cập nhật trạng thái thành công!")

            // Nếu chuyển từ pending/khác sang completed → Cập nhật inventory
            if (status === 'completed' && oldStatus !== 'completed') {
                try {
                    console.log("=== Cập nhật tồn kho sau khi duyệt phiếu nhập ===")
                    // Lấy thông tin đầy đủ của receipt (bao gồm items)
                    const fullReceipt = await getImportReceiptById(receiptId)
                    const items = fullReceipt.importItems || fullReceipt.import_items || []
                    
                    if (items.length === 0) {
                        console.warn("⚠️ Phiếu nhập không có items, bỏ qua cập nhật tồn kho")
                        fetchReceipts()
                        return
                    }

                    // Lấy danh sách inventory hiện tại
                    const allInventories = await getAllInventory()

                    // Cập nhật inventory cho từng item
                    let successCount = 0
                    let errorCount = 0
                    
                    for (const item of items) {
                        const productId = item.productId || item.product_id
                        const quantity = item.quantity || 0

                        if (!productId) {
                            console.warn(`⚠️ Item không có productId, bỏ qua`)
                            errorCount++
                            continue
                        }

                        if (quantity <= 0) {
                            console.warn(`⚠️ Item có số lượng <= 0 (${quantity}), bỏ qua`)
                            errorCount++
                            continue
                        }

                        try {
                            // Tìm inventory theo productId
                            const existingInventory = allInventories.find(
                                (inv: IInventory) => inv.productId === productId
                            )

                            if (existingInventory) {
                                // Sản phẩm đã có trong inventory → Cập nhật số lượng (cộng thêm)
                                const newQuantity = existingInventory.quantity + quantity

                                console.log(`📦 Sản phẩm đã có: Cập nhật inventory ${existingInventory.inventoryId}`)
                                console.log(`   Product ID: ${productId}`)
                                console.log(`   ${existingInventory.quantity} -> ${newQuantity} (nhập thêm ${quantity})`)

                                await updateInventory({
                                    ...existingInventory,
                                    quantity: newQuantity
                                })

                                console.log(`✅ Đã cập nhật tồn kho cho sản phẩm ID: ${productId}`)
                                successCount++
                            } else {
                                // Sản phẩm chưa có trong inventory → Tạo mới
                                console.log(`🆕 Sản phẩm chưa có: Tạo inventory mới cho productId: ${productId}`)

                                const newInventory: IInventory = {
                                    inventoryId: 0, // Will be set by backend
                                    productId: productId,
                                    quantity: quantity, // Số lượng nhập vào
                                    updatedAt: new Date().toISOString()
                                }

                                await addInventory(newInventory)

                                console.log(`✅ Đã tạo tồn kho mới cho sản phẩm ID: ${productId} với số lượng: ${quantity}`)
                                successCount++
                            }
                        } catch (itemError: any) {
                            console.error(`❌ Lỗi khi xử lý sản phẩm ID ${productId}:`, itemError)
                            errorCount++
                            // Tiếp tục xử lý các sản phẩm khác
                        }
                    }


                    toast.success("Đã cập nhật tồn kho thành công!")
                } catch (error: any) {
                    const errorMessage = error?.response?.data?.message ||
                        error?.response?.data?.error ||
                        error?.message ||
                        "Không thể cập nhật tồn kho"
                    toast.error(`Lỗi cập nhật tồn kho: ${errorMessage}`)
                    // Không throw error - trạng thái đã cập nhật thành công
                }
            }

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
