"use client"

import { useState, useEffect } from "react"
import { ISupplier } from "@/types/types"
import StatsCard from "./components/StatsCard"
import SearchAction from "./components/TableManagerSupplier/SearchAction"
import ManagerTableSuppliers from "./components/TableManagerSupplier/ManagerTableSuppliers"
import PaginationSuppliers from "./components/TableManagerSupplier/PaginationSuppliers"
import HeaderManagerSupplier from "./components/HeaderManagerSupplier"
import ImportCard from "./components/Dialog/ImportCard/ImportCard"
import { getAllSuppliers, addSupplier, updateSupplier, deleteSupplier, CreateSupplierDTO, UpdateSupplierDTO } from "@/apis/supplierApi"
import { toast } from "sonner"

export default function SuppliersContent() {
    const [suppliers, setSuppliers] = useState<ISupplier[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [selectedSupplier, setSelectedSupplier] = useState<ISupplier | null>(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

    // Fetch suppliers on component mount
    useEffect(() => {
        fetchSuppliers()
    }, [])

    const fetchSuppliers = async () => {
        try {
            setLoading(true)
            const data = await getAllSuppliers()
            setSuppliers(data)
        } catch (error) {
            console.error("Error fetching suppliers:", error)
            toast.error("Không thể tải danh sách nhà cung cấp")
        } finally {
            setLoading(false)
        }
    }

    const filteredSuppliers = suppliers.filter((supplier) => {
        const matchesSearch =
            supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.supplier_id.toString().includes(searchTerm.toLowerCase()) ||
            supplier.email.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || supplier.trangThai === statusFilter

        return matchesSearch && matchesStatus
    })

    const totalSuppliers = suppliers.length
    const activeSuppliers = suppliers.filter(s => s.trangThai === "active").length
    const inactiveSuppliers = suppliers.filter(s => s.trangThai === "inactive").length

    const handleAddSupplier = async (data: CreateSupplierDTO) => {
        try {
            const newSupplier = await addSupplier(data)
            setSuppliers([...suppliers, newSupplier])
            setIsAddDialogOpen(false)
            toast.success("Thêm nhà cung cấp thành công!")
        } catch (error) {
            console.error("Error adding supplier:", error)
            toast.error("Không thể thêm nhà cung cấp")
            throw error
        }
    }

    const handleEditSupplier = async (data: UpdateSupplierDTO) => {
        if (!selectedSupplier) return

        try {
            const updatedSupplier = await updateSupplier(selectedSupplier.supplier_id, data)
            setSuppliers(suppliers.map((s) =>
                s.supplier_id === selectedSupplier.supplier_id ? updatedSupplier : s
            ))
            setIsEditDialogOpen(false)
            setSelectedSupplier(null)
            toast.success("Cập nhật nhà cung cấp thành công!")
        } catch (error) {
            console.error("Error updating supplier:", error)
            toast.error("Không thể cập nhật nhà cung cấp")
        }
    }

    const handleDeleteSupplier = async (supplierId: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa nhà cung cấp này?")) return

        try {
            await deleteSupplier(supplierId)
            setSuppliers(suppliers.filter((s) => s.supplier_id !== supplierId))
            toast.success("Xóa nhà cung cấp thành công!")
        } catch (error) {
            console.error("Error deleting supplier:", error)
            toast.error("Không thể xóa nhà cung cấp")
        }
    }

    const handleImportGoods = (data: {
        ngayNhap: string
        chiTietPhieuNhap: any[]
        tongTien: number
    }) => {
        console.log("Import goods data:", data)
        setIsImportDialogOpen(false)
        setSelectedSupplier(null)
        toast.success("Nhập hàng thành công!")
    }

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-green-50 via-blue-50 to-white p-6 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-br from-green-50 via-blue-50 to-white p-6">
            <div className="mx-auto space-y-6">
                <HeaderManagerSupplier
                    isAddDialogOpen={isAddDialogOpen}
                    setIsAddDialogOpen={setIsAddDialogOpen}
                    handleAddSupplier={handleAddSupplier}
                />
                <StatsCard
                    totalSuppliers={totalSuppliers}
                    activeSuppliers={activeSuppliers}
                    inactiveSuppliers={inactiveSuppliers}
                />
                <SearchAction
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />
                <ManagerTableSuppliers
                    suppliers={suppliers}
                    filteredSuppliers={filteredSuppliers}
                    setSelectedSupplier={setSelectedSupplier}
                    setIsImportDialogOpen={setIsImportDialogOpen}
                    setIsDetailDialogOpen={setIsDetailDialogOpen}
                    setIsEditDialogOpen={setIsEditDialogOpen}
                    handleDeleteSupplier={handleDeleteSupplier}
                />

                <PaginationSuppliers totalItems={filteredSuppliers.length} />

                <ImportCard
                    isImportDialogOpen={isImportDialogOpen}
                    setIsImportDialogOpen={setIsImportDialogOpen}
                    selectedSupplier={selectedSupplier}
                    setSelectedSupplier={setSelectedSupplier}
                    handleImportGoods={handleImportGoods}
                />
            </div>
        </div>
    )
}
