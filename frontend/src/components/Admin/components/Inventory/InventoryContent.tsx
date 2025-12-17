"use client"
import { useState, useMemo } from "react"
import { IInventory } from "@/types/types"
import StatsCard from "./components/StatsCard"
import SearchAction from "./components/SearchAction"
import TableManagerInventory from "./components/TableInventory/TableManagerInventory"
import PaginationInventory from "./components/PaginationInventory"
import HeaderManagerInventory from "./components/HeaderManagerInventory"
import EditInventoryDialog from "./components/Dialog/EditInventory/EditInventoryDialog"
import ViewDetailsInventory from "./components/Dialog/ViewDetailsInventory/ViewDetailsInventory"
import { usePagination } from "@/context/PaginationContext"
import { useInventory } from "@/hooks/useInventory"

export default function InventoryContent() {
    const { inventories, loading, addInventory, updateInventory, deleteInventory, updateInventoryStatus } = useInventory()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedInventory, setSelectedInventory] = useState<IInventory | null>(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

    const { paginationState } = usePagination()

    const filteredInventories = useMemo(() => {
        return inventories.filter((inventory) => {
            const matchesSearch =
                (inventory.productName || inventory.product?.productName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                inventory.inventoryId.toString().includes(searchTerm.toLowerCase()) ||
                inventory.productId.toString().includes(searchTerm.toLowerCase())

            return matchesSearch
        })
    }, [inventories, searchTerm])

    const paginatedInventories = useMemo(() => {
        const startIndex = (paginationState.currentPage - 1) * paginationState.rowsPerPage
        const endIndex = startIndex + paginationState.rowsPerPage
        return filteredInventories.slice(startIndex, endIndex)
    }, [filteredInventories, paginationState.currentPage, paginationState.rowsPerPage])

    const totalInventories = inventories.length
    const lowStockInventories = inventories.filter(i => i.quantity < 10).length
    const outOfStockInventories = inventories.filter(i => i.quantity === 0).length

    const handleAddInventoryWrapper = async (data: IInventory) => {
        try {
            await addInventory(data)
            setIsAddDialogOpen(false)
        } catch (error) {
            // Error handled in hook
        }
    }

    const handleEditInventoryWrapper = async (data: IInventory) => {
        if (!selectedInventory) return

        try {
            // Merge existing inventory data with updates
            const updatedData = { ...selectedInventory, ...data }
            await updateInventory(selectedInventory.inventoryId, updatedData)
            setIsEditDialogOpen(false)
            setSelectedInventory(null)
        } catch (error) {
            // Error handled in hook
        }
    }

    const handleStatusChangeWrapper = async (productId: number, status: boolean) => {
        try {
            await updateInventoryStatus(productId)
        } catch (error) {
            // Error handled in hook
        }
    }

    const handleDeleteInventoryWrapper = async (inventoryId: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa tồn kho này?")) return

        try {
            await deleteInventory(inventoryId)
        } catch (error) {
            // Error handled in hook
        }
    }

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-blue-50 via-green-50 to-white p-6 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        )
    }

    return (
        <div className=" p-6">
            <div className="mx-auto space-y-6">
                <HeaderManagerInventory
                    isAddDialogOpen={isAddDialogOpen}
                    setIsAddDialogOpen={setIsAddDialogOpen}
                    handleAddInventory={handleAddInventoryWrapper}
                />
                <StatsCard
                    totalInventories={totalInventories}
                    lowStockInventories={lowStockInventories}
                    outOfStockInventories={outOfStockInventories}
                />
                <SearchAction
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
                <TableManagerInventory
                    inventories={inventories}
                    filteredInventories={paginatedInventories}
                    setSelectedInventory={setSelectedInventory}
                    setIsDetailDialogOpen={setIsDetailDialogOpen}
                    setIsEditDialogOpen={setIsEditDialogOpen}
                    handleDeleteInventory={handleDeleteInventoryWrapper}
                    onStatusChange={handleStatusChangeWrapper}
                />

                <PaginationInventory totalItems={filteredInventories.length} />

                <ViewDetailsInventory
                    isDetailDialogOpen={isDetailDialogOpen}
                    setIsDetailDialogOpen={setIsDetailDialogOpen}
                    selectedInventory={selectedInventory}
                    setSelectedInventory={setSelectedInventory}
                    setIsEditDialogOpen={setIsEditDialogOpen}
                />

                <EditInventoryDialog
                    isOpen={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    selectedInventory={selectedInventory}
                    onSubmit={async (data: IInventory) => {
                        await handleEditInventoryWrapper(data)
                        setSelectedInventory(null)
                    }}
                />
            </div>
        </div>
    )
}

