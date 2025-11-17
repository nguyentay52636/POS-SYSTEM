"use client"

import { useState, useEffect, useMemo } from "react"
import { IInventory } from "@/types/types"
import StatsCard from "./components/StatsCard"
import SearchAction from "./components/SearchAction"
import TableManagerInventory from "./components/TableInventory/TableManagerInventory"
import PaginationInventory from "./components/PaginationInventory"
import { getAllInventories, addInventory, updateInventory, deleteInventory, CreateInventoryDTO, UpdateInventoryDTO } from "@/apis/inventoryApi"
import { toast } from "sonner"
import HeaderManagerInventory from "./components/HeaderManagerInventory"
import EditInventoryDialog from "./components/Dialog/EditInventory/EditInventoryDialog"
import ViewDetailsInventory from "./components/Dialog/ViewDetailsInventory/ViewDetailsInventory"
import { usePagination } from "@/context/PaginationContext"

export default function InventoryContent() {
    const [inventories, setInventories] = useState<IInventory[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedInventory, setSelectedInventory] = useState<IInventory | null>(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

    // Fetch inventories on component mount
    useEffect(() => {
        fetchInventories()
    }, [])

    const fetchInventories = async () => {
        try {
            setLoading(true)
            const data = await getAllInventories()
            setInventories(data)
        } catch (error) {
            console.error("Error fetching inventories:", error)
            toast.error("Không thể tải danh sách tồn kho")
        } finally {
            setLoading(false)
        }
    }

    const { paginationState } = usePagination()

    const filteredInventories = useMemo(() => {
        return inventories.filter((inventory) => {
            const matchesSearch =
                inventory.product?.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inventory.inventory_id.toString().includes(searchTerm.toLowerCase()) ||
                inventory.product_id.toString().includes(searchTerm.toLowerCase())

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

    const handleAddInventory = async (data: CreateInventoryDTO) => {
        try {
            const newInventory = await addInventory(data)
            setInventories([...inventories, newInventory])
            setIsAddDialogOpen(false)
            toast.success("Thêm tồn kho thành công!")
            fetchInventories() // Refresh the list
        } catch (error) {
            console.error("Error adding inventory:", error)
            toast.error("Không thể thêm tồn kho")
            throw error
        }
    }

    const handleEditInventory = async (data: UpdateInventoryDTO) => {
        if (!selectedInventory) return

        try {
            const updatedInventory = await updateInventory(selectedInventory.inventory_id, data)
            setInventories(inventories.map((i) =>
                i.inventory_id === selectedInventory.inventory_id ? updatedInventory : i
            ))
            setIsEditDialogOpen(false)
            setSelectedInventory(null)
            toast.success("Cập nhật tồn kho thành công!")
            fetchInventories() // Refresh the list
        } catch (error) {
            console.error("Error updating inventory:", error)
            toast.error("Không thể cập nhật tồn kho")
        }
    }

    const handleDeleteInventory = async (inventoryId: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa tồn kho này?")) return

        try {
            await deleteInventory(inventoryId)
            setInventories(inventories.filter((i) => i.inventory_id !== inventoryId))
            toast.success("Xóa tồn kho thành công!")
            fetchInventories() // Refresh the list
        } catch (error) {
            console.error("Error deleting inventory:", error)
            toast.error("Không thể xóa tồn kho")
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
                    handleAddInventory={handleAddInventory}
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
                    handleDeleteInventory={handleDeleteInventory}
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
                    onSubmit={async (data: UpdateInventoryDTO) => {
                        await handleEditInventory(data)
                        setSelectedInventory(null)
                    }}
                />
            </div>
        </div>
    )
}

