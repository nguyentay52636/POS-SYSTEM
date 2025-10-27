import baseApi from "./baseApi"
import { IInventory } from "@/types/types"
import { IProduct } from "@/types/types"


// DTOs
export interface CreateInventoryDTO {
    product_id: number
    quantity: number
}

export interface UpdateInventoryDTO {
    quantity?: number
}

const getAllInventories = async (): Promise<IInventory[]> => {
    try {
        const { data } = await baseApi.get('/Inventory')
        return data
    } catch (error) {
        console.error('Error fetching inventories:', error)
        throw error
    }
}

const addInventory = async (inventoryData: CreateInventoryDTO): Promise<IInventory> => {
    try {
        const { data } = await baseApi.post('/Inventory', inventoryData)
        return data
    } catch (error) {
        console.error('Error adding inventory:', error)
        throw error
    }
}

const updateInventory = async (inventoryId: number, inventoryData: UpdateInventoryDTO): Promise<IInventory> => {
    try {
        const { data } = await baseApi.put(`/Inventory/${inventoryId}`, inventoryData)
        return data
    } catch (error) {
        console.error('Error updating inventory:', error)
        throw error
    }
}

const deleteInventory = async (inventoryId: number): Promise<void> => {
    try {
        await baseApi.delete(`/Inventory/${inventoryId}`)
    } catch (error) {
        console.error('Error deleting inventory:', error)
        throw error
    }
}

const getInventoryById = async (inventoryId: number): Promise<IInventory> => {
    try {
        const { data } = await baseApi.get(`/Inventory/${inventoryId}`)
        return data
    } catch (error) {
        console.error('Error fetching inventory:', error)
        throw error
    }
}

const getAllProducts = async (): Promise<IProduct[]> => {
    try {
        const { data } = await baseApi.get('/Product')
        return data
    } catch (error) {
        console.error('Error fetching products:', error)
        throw error
    }
}

const getProductById = async (productId: number): Promise<IProduct> => {
    try {
        const { data } = await baseApi.get(`/Product/${productId}`)
        return data
    } catch (error) {
        console.error('Error fetching product:', error)
        throw error
    }
}



export {getProductById, getAllProducts, getAllInventories, addInventory, updateInventory, deleteInventory, getInventoryById }

