import { useState, useEffect } from "react"
import { IInventory } from "@/types/types"
import { getAllInventory, addInventory as apiAddInventory, updateInventory as apiUpdateInventory, deleteInventory as apiDeleteInventory, getInventoryById } from "@/apis/inventoryApi"
import { toast } from "sonner"

export const useInventory = () => {
    const [inventories, setInventories] = useState<IInventory[]>([])
    const [loading, setLoading] = useState(true)

    const fetchInventories = async () => {
        try {
            setLoading(true)
            const data = await getAllInventory()
            setInventories(data)
        } catch (error) {
            console.error("Error fetching inventories:", error)
            toast.error("Không thể tải danh sách tồn kho")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchInventories()
    }, [])

    const addInventory = async (data: IInventory) => {
        try {
            const newInventory = await apiAddInventory(data)
            setInventories((prev) => [...prev, newInventory])
            toast.success("Thêm tồn kho thành công!")
            return newInventory
        } catch (error) {
            console.error("Error adding inventory:", error)
            toast.error("Không thể thêm tồn kho")
            throw error
        }
    }

    const updateInventory = async (id: number, data: IInventory) => {
        try {
            const updatedInventory = await apiUpdateInventory(data)
            setInventories((prev) => prev.map((i) =>
                i.inventoryId === id ? updatedInventory : i
            ))
            toast.success("Cập nhật tồn kho thành công!")
            return updatedInventory
        } catch (error) {
            console.error("Error updating inventory:", error)
            toast.error("Không thể cập nhật tồn kho")
            throw error
        }
    }

    const deleteInventory = async (inventoryId: number) => {
        try {
            await apiDeleteInventory(inventoryId)
            setInventories((prev) => prev.filter((i) => i.inventoryId !== inventoryId))
            toast.success("Xóa tồn kho thành công!")
        } catch (error) {
            console.error("Error deleting inventory:", error)
            toast.error("Không thể xóa tồn kho")
            throw error
        }
    }

    return {
        inventories,
        loading,
        fetchInventories,
        addInventory,
        updateInventory,
        deleteInventory
    }
}