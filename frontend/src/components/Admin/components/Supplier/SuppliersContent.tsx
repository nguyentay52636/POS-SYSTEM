"use client"

import { useMemo } from "react"
import { IProduct } from "@/types/types"
import StatsCard from "./components/StatsCard"
import SearchAction from "./components/TableManagerSupplier/SearchAction"
import ManagerTableSuppliers from "./components/TableManagerSupplier/ManagerTableSuppliers"
import PaginationSuppliers from "./components/TableManagerSupplier/PaginationSuppliers"
import HeaderManagerSupplier from "./components/HeaderManagerSupplier"
import ImportCard from "./components/Dialog/ImportCard/ImportCard"
import ViewDetailsSuppliers from "./components/Dialog/ViewDetailsSuppliers/ViewDetailsSuppliers"
import DialogEditSupplier from "./components/Dialog/EditSupplier/DialogEditSupplier"
import { useSupplier } from "@/hooks/useSupplier"
import { usePagination } from "@/context/PaginationContext"
import { toast } from "sonner"
import { useProduct } from "@/hooks/useProduct"

export default function SuppliersContent() {
    const {
        suppliers,
        filteredSuppliers: allFilteredSuppliers,
        loading,
        totalSuppliers,
        activeSuppliers,
        inactiveSuppliers,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
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
        handleAddSupplier,
        handleEditSupplier,
        handleDeleteSupplier,
    } = useSupplier()

    const { paginationState } = usePagination()
    const { products } = useProduct()

    // Get products for selected supplier
    const supplierProducts = useMemo(() => {
        if (!selectedSupplier) return []
        const supplierId = selectedSupplier.supplierId
        return products.filter((product) => product.supplierId === supplierId || product.supplier?.supplierId === supplierId)
    }, [products, selectedSupplier])

    // Paginated suppliers
    const paginatedSuppliers = useMemo(() => {
        const startIndex = (paginationState.currentPage - 1) * paginationState.rowsPerPage
        const endIndex = startIndex + paginationState.rowsPerPage
        return allFilteredSuppliers.slice(startIndex, endIndex)
    }, [allFilteredSuppliers, paginationState.currentPage, paginationState.rowsPerPage])

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
            <div className="bg-white p-6 min-h-screen flex items-center justify-center">
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
                    filteredSuppliers={paginatedSuppliers}
                    setSelectedSupplier={setSelectedSupplier}
                    setIsImportDialogOpen={setIsImportDialogOpen}
                    setIsDetailDialogOpen={setIsDetailDialogOpen}
                    setIsEditDialogOpen={setIsEditDialogOpen}
                    handleDeleteSupplier={handleDeleteSupplier}
                />

                <PaginationSuppliers totalItems={allFilteredSuppliers.length} />

                <ViewDetailsSuppliers
                    supplierProducts={supplierProducts}
                    isDetailDialogOpen={isDetailDialogOpen}
                    setIsDetailDialogOpen={setIsDetailDialogOpen}
                    selectedSupplier={selectedSupplier}
                    setSelectedSupplier={setSelectedSupplier}
                    setIsEditDialogOpen={setIsEditDialogOpen}
                    setIsImportDialogOpen={setIsImportDialogOpen}
                />

                <ImportCard
                    isImportDialogOpen={isImportDialogOpen}
                    setIsImportDialogOpen={setIsImportDialogOpen}
                    selectedSupplier={selectedSupplier}
                    setSelectedSupplier={setSelectedSupplier}
                    handleImportGoods={handleImportGoods}
                />

                <DialogEditSupplier
                    isEditDialogOpen={isEditDialogOpen}
                    setIsEditDialogOpen={setIsEditDialogOpen}
                    selectedSupplier={selectedSupplier}
                    handleEditSupplier={handleEditSupplier}
                />
            </div>
        </div>
    )
}
