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
        // Map backend camelCase to frontend snake_case
        return data.map((item: any) => ({
            inventory_id: item.inventoryId,
            product_id: item.productId,
            quantity: item.quantity,
            updated_at: item.updatedAt,
            product: item.product ? {
                product_id: item.product.productId,
                category_id: item.product.categoryId,
                supplier_id: item.product.supplierId,
                product_name: item.product.productName,
                barcode: item.product.barcode,
                price: item.product.price,
                image: item.product.image,
                unit: item.product.unit,
                xuatXu: item.product.xuatXu,
                status: item.product.status,
                createdAt: item.product.createdAt,
                updatedAt: item.product.updatedAt,
                hsd: item.product.hsd
            } : undefined
        }))
    } catch (error) {
        console.error('Error fetching inventories:', error)
        throw error
    }
}

const addInventory = async (inventoryData: CreateInventoryDTO): Promise<IInventory> => {
    try {
        // Map frontend snake_case to backend camelCase
        const payload = {
            productId: inventoryData.product_id,
            quantity: inventoryData.quantity
        }
        const { data } = await baseApi.post('/Inventory', payload)
        // Map response back to frontend format
        return {
            inventory_id: data.inventoryId,
            product_id: data.productId,
            quantity: data.quantity,
            updated_at: data.updatedAt,
            product: data.product ? {
                product_id: data.product.productId,
                category_id: data.product.categoryId,
                supplier_id: data.product.supplierId,
                product_name: data.product.productName,
                barcode: data.product.barcode,
                price: data.product.price,
                image: data.product.image,
                unit: data.product.unit,
                xuatXu: data.product.xuatXu,
                status: data.product.status,
                createdAt: data.product.createdAt,
                updatedAt: data.product.updatedAt,
                hsd: data.product.hsd
            } : undefined
        }
    } catch (error) {
        console.error('Error adding inventory:', error)
        throw error
    }
}

const updateInventory = async (inventoryId: number, inventoryData: UpdateInventoryDTO): Promise<IInventory> => {
    try {
        const { data } = await baseApi.put(`/Inventory/${inventoryId}`, {
            quantity: inventoryData.quantity
        })
        // Map response back to frontend format
        return {
            inventory_id: data.inventoryId,
            product_id: data.productId,
            quantity: data.quantity,
            updated_at: data.updatedAt,
            product: data.product ? {
                product_id: data.product.productId,
                category_id: data.product.categoryId,
                supplier_id: data.product.supplierId,
                product_name: data.product.productName,
                barcode: data.product.barcode,
                price: data.product.price,
                image: data.product.image,
                unit: data.product.unit,
                xuatXu: data.product.xuatXu,
                status: data.product.status,
                createdAt: data.product.createdAt,
                updatedAt: data.product.updatedAt,
                hsd: data.product.hsd
            } : undefined
        }
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
        // Map response back to frontend format
        return {
            inventory_id: data.inventoryId,
            product_id: data.productId,
            quantity: data.quantity,
            updated_at: data.updatedAt,
            product: data.product ? {
                product_id: data.product.productId,
                category_id: data.product.categoryId,
                supplier_id: data.product.supplierId,
                product_name: data.product.productName,
                barcode: data.product.barcode,
                price: data.product.price,
                image: data.product.image,
                unit: data.product.unit,
                xuatXu: data.product.xuatXu,
                status: data.product.status,
                createdAt: data.product.createdAt,
                updatedAt: data.product.updatedAt,
                hsd: data.product.hsd
            } : undefined
        }
    } catch (error) {
        console.error('Error fetching inventory:', error)
        throw error
    }
}

const getAllProducts = async (): Promise<IProduct[]> => {
    try {
        const { data } = await baseApi.get('/Product')
        // Map backend camelCase to frontend snake_case
        return data.map((item: any) => ({
            product_id: item.productId,
            category_id: item.categoryId,
            supplier_id: item.supplierId,
            product_name: item.productName,
            barcode: item.barcode,
            price: item.price,
            image: item.image,
            unit: item.unit,
            xuatXu: item.xuatXu,
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            hsd: item.hsd
        }))
    } catch (error) {
        console.error('Error fetching products:', error)
        throw error
    }
}

const getProductById = async (productId: number): Promise<IProduct> => {
    try {
        const { data } = await baseApi.get(`/Product/${productId}`)
        // Map backend camelCase to frontend snake_case
        return {
            product_id: data.productId,
            category_id: data.categoryId,
            supplier_id: data.supplierId,
            product_name: data.productName,
            barcode: data.barcode,
            price: data.price,
            image: data.image,
            unit: data.unit,
            xuatXu: data.xuatXu,
            status: data.status,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            hsd: data.hsd
        }
    } catch (error) {
        console.error('Error fetching product:', error)
        throw error
    }
}



export {getProductById, getAllProducts, getAllInventories, addInventory, updateInventory, deleteInventory, getInventoryById }

