import { useState, useEffect, useMemo, useCallback } from "react"
import { getAllSuppliers, addSupplier, updateSupplier, deleteSupplier, CreateSupplierDTO, UpdateSupplierDTO } from "@/apis/supplierApi"
import { ISupplier } from "@/types/types"
import { toast } from "sonner"

/**
 * Normalize supplier data to handle naming convention inconsistency
 */
const normalizeSupplier = (supplier: any): ISupplier => {
    return {
        ...supplier,
        // Đảm bảo luôn có supplierId dù API trả về supplierId hay supplier_id
        supplierId: supplier.supplierId ?? supplier.supplier_id,
    }
}

export const useSupplier = () => {
    const [suppliers, setSuppliers] = useState<ISupplier[]>([])
    const [loading, setLoading] = useState(true)

    // Filter states
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")

    // Dialog states
    const [selectedSupplier, setSelectedSupplier] = useState<ISupplier | null>(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

    // Fetch suppliers
    const fetchSuppliers = useCallback(async () => {
        try {
            setLoading(true)
            const data = await getAllSuppliers()
            const normalizedData = data.map(normalizeSupplier)
            setSuppliers(normalizedData)
        } catch (error) {
            console.error("Error fetching suppliers:", error)
            toast.error("Không thể tải danh sách nhà cung cấp")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchSuppliers()
    }, [fetchSuppliers])

    // Filter suppliers
    const filteredSuppliers = useMemo(() => {
        return suppliers.filter((supplier) => {
            const id =
                supplier.supplierId ??
                // fallback nếu backend trả về supplier_id mà type chưa có
                (supplier as any).supplier_id

            const matchesSearch =
                supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (id ? id.toString().includes(searchTerm.toLowerCase()) : false) ||
                supplier.email.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus = statusFilter === "all" || supplier.trangThai === statusFilter

            return matchesSearch && matchesStatus
        })
    }, [suppliers, searchTerm, statusFilter])

    // Calculate stats
    const stats = useMemo(() => {
        return {
            total: suppliers.length,
            active: suppliers.filter((s) => s.trangThai === "active").length,
            inactive: suppliers.filter((s) => s.trangThai === "inactive").length,
        }
    }, [suppliers])

    // Handlers
    const handleAddSupplier = useCallback(
        async (data: CreateSupplierDTO) => {
            try {
                const newSupplier = await addSupplier(data)
                const normalizedSupplier = normalizeSupplier(newSupplier)
                setSuppliers((prev) => [...prev, normalizedSupplier])
                setIsAddDialogOpen(false)
                toast.success("Thêm nhà cung cấp thành công!")
            } catch (error) {
                console.error("Error adding supplier:", error)
                toast.error("Không thể thêm nhà cung cấp")
                throw error
            }
        },
        []
    )

    const handleEditSupplier = useCallback(
        async (supplierId: number, data: UpdateSupplierDTO) => {
            if (!supplierId) {
                toast.error("Lỗi: Không tìm thấy mã nhà cung cấp")
                return
            }

            try {
                const updatedSupplier = await updateSupplier(supplierId, data)
                const normalizedSupplier = normalizeSupplier(updatedSupplier)

                setSuppliers((prev) =>
                    prev.map((s) => {
                        const currentId = s.supplierId 
                        return currentId === supplierId ? normalizedSupplier : s
                    })
                )

                setIsEditDialogOpen(false)
                setSelectedSupplier(null)
                toast.success("Cập nhật nhà cung cấp thành công!")
            } catch (error) {
                console.error("Error updating supplier:", error)
                toast.error("Không thể cập nhật nhà cung cấp")
            }
        },
        []
    )

    const handleDeleteSupplier = useCallback(
        async (supplierId: number) => {
            if (!confirm("Bạn có chắc chắn muốn xóa nhà cung cấp này?")) return

            try {
                await deleteSupplier(supplierId)
                setSuppliers((prev) =>
                    prev.filter((s) => {
                        const currentId = s.supplierId
                        return currentId !== supplierId
                    })
                )
                toast.success("Xóa nhà cung cấp thành công!")
            } catch (error) {
                console.error("Error deleting supplier:", error)
                toast.error("Không thể xóa nhà cung cấp")
            }
        },
        []
    )

    return {
        // Data
        suppliers,
        filteredSuppliers,
        loading,

        // Stats
        totalSuppliers: stats.total,
        activeSuppliers: stats.active,
        inactiveSuppliers: stats.inactive,

        // Filter State
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,

        // Dialog State
        selectedSupplier,
        setSelectedSupplier,
        isAddDialogOpen,
        setIsAddDialogOpen,
        isEditDialogOpen,
        setIsEditDialogOpen,
        isDetailDialogOpen,
        setIsDetailDialogOpen,
        isImportDialogOpen,
        setIsImportDialogOpen,

        // Handlers
        fetchSuppliers,
        handleAddSupplier,
        handleEditSupplier,
        handleDeleteSupplier,
    }
}

