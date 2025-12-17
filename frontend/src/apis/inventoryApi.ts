import { IInventory } from "@/types/types"
import baseApi from "./baseApi"

export interface updateStatusProductInventory {
}
export const getAllInventory = async () => {
    try {
        const { data } = await baseApi.get('/Inventory')
        return data
    } catch (error: any) {
        throw error
    }
}

export const addInventory = async (inventory: IInventory) => {
    try {
        const { data } = await baseApi.post('/Inventory', inventory)
        return data
    } catch (error: any) {
        throw error
    }
}

export const updateInventory = async (inventory: IInventory) => {
    try {
        const { data } = await baseApi.put(`/Inventory/${inventory.inventoryId}`, inventory)
        return data
    } catch (error: any) {
        throw error
    }
}
export const getInventoryById = async (inventoryId: number) => {
    try {
        const { data } = await baseApi.get(`/Inventory/${inventoryId}`)
        return data
    } catch (error: any) {
        throw error
    }
}
export const deleteInventory = async (inventoryId: number) => {
    try {
        const { data } = await baseApi.delete(`/Inventory/${inventoryId}`)
        return data
    } catch (error: any) {
        throw error
    }
}
export const updateInventoryQuantity = async (inventoryId: number, quantity: number, productId: number) => {
    try {
        const { data } = await baseApi.put(`/Inventory/${inventoryId}`, {
            quantity: quantity,
            productId: productId
        })
        return data
    } catch (error: any) {
        throw error
    }
}
export const updateStatusProductInventory = async (productId: number) => {
    try {
        const { data } = await baseApi.put(`/Inventory/${productId}/status`)
        return data
    } catch (error: any) {
        throw error
    }
}