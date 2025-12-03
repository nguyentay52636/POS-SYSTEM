import baseApi from "./baseApi"
import { IImportReceipt, IImportItem, IProduct } from "@/types/types"

// DTOs
export interface CreateImportReceiptDTO {
    supplierId: number
    userId: number
    status: string
    note?: string
    items: CreateImportItemDTO[]
}

export interface CreateImportItemDTO {
    productId: number
    quantity: number
    unitPrice: number
}

export interface UpdateImportReceiptDTO {
    supplierId?: number
    userId?: number
    importDate?: string
    totalAmount?: number
    status?: string
    note?: string
}

const getAllImportReceipts = async (): Promise<IImportReceipt[]> => {
    try {
        const { data } = await baseApi.get('/imports')
        return data
    } catch (error) {
        console.error('Error fetching import receipts:', error)
        throw error
    }
}

const addImportReceipt = async (receiptData: CreateImportReceiptDTO): Promise<IImportReceipt> => {
    try {
        const { data } = await baseApi.post('/imports', receiptData)
        return data
    } catch (error) {
        console.error('Error adding import receipt:', error)
        throw error
    }
}

const updateImportReceipt = async (receiptId: number, receiptData: UpdateImportReceiptDTO): Promise<IImportReceipt> => {
    try {
        const { data } = await baseApi.put(`/imports/${receiptId}`, receiptData)
        return data
    } catch (error) {
        console.error('Error updating import receipt:', error)
        throw error
    }
}

const deleteImportReceipt = async (receiptId: number): Promise<void> => {
    try {
        await baseApi.delete(`/imports/${receiptId}`)
    } catch (error) {
        console.error('Error deleting import receipt:', error)
        throw error
    }
}

const getImportReceiptById = async (receiptId: number): Promise<IImportReceipt> => {
    try {
        const { data } = await baseApi.get(`/imports/${receiptId}`)
        return data
    } catch (error) {
        console.error('Error fetching import receipt:', error)
        throw error
    }
}
const  getAllProductBySupplierId = async (supplierId: number) =>{
    try {
        const {data}  = await baseApi.get(`/Product/supplier/${supplierId}`)
        return data
    }catch(error) {
        console.error('Error fetching products by supplier:', error)
        throw error
    }
}
const updateStatusImportReceipt = async (receiptId: number, status: string): Promise<IImportReceipt> => {
    try {
        const { data } = await baseApi.patch(`/imports/${receiptId}/status`, { status })
        return data
    } catch (error: any) {
        console.error('Error updating status import receipt:', error)
        throw error
    }
}

export {updateStatusImportReceipt,getAllProductBySupplierId, getAllImportReceipts, addImportReceipt, updateImportReceipt, deleteImportReceipt, getImportReceiptById }

