import baseApi from "./baseApi"
import { IImportReceipt, IImportItem } from "@/types/types"

// DTOs
export interface CreateImportReceiptDTO {
    supplier_id: number
    user_id: number
    import_date: string
    total_amount: number
    status: string
    note?: string
    import_items: CreateImportItemDTO[]
}

export interface CreateImportItemDTO {
    product_id: number
    quantity: number
    unit_price: number
    subtotal: number
}

export interface UpdateImportReceiptDTO {
    supplier_id?: number
    user_id?: number
    import_date?: string
    total_amount?: number
    status?: string
    note?: string
}

const getAllImportReceipts = async (): Promise<IImportReceipt[]> => {
    try {
        const { data } = await baseApi.get('/ImportReceipt')
        return data
    } catch (error) {
        console.error('Error fetching import receipts:', error)
        throw error
    }
}

const addImportReceipt = async (receiptData: CreateImportReceiptDTO): Promise<IImportReceipt> => {
    try {
        const { data } = await baseApi.post('/ImportReceipt', receiptData)
        return data
    } catch (error) {
        console.error('Error adding import receipt:', error)
        throw error
    }
}

const updateImportReceipt = async (receiptId: number, receiptData: UpdateImportReceiptDTO): Promise<IImportReceipt> => {
    try {
        const { data } = await baseApi.put(`/ImportReceipt/${receiptId}`, receiptData)
        return data
    } catch (error) {
        console.error('Error updating import receipt:', error)
        throw error
    }
}

const deleteImportReceipt = async (receiptId: number): Promise<void> => {
    try {
        await baseApi.delete(`/ImportReceipt/${receiptId}`)
    } catch (error) {
        console.error('Error deleting import receipt:', error)
        throw error
    }
}

const getImportReceiptById = async (receiptId: number): Promise<IImportReceipt> => {
    try {
        const { data } = await baseApi.get(`/ImportReceipt/${receiptId}`)
        return data
    } catch (error) {
        console.error('Error fetching import receipt:', error)
        throw error
    }
}

export { getAllImportReceipts, addImportReceipt, updateImportReceipt, deleteImportReceipt, getImportReceiptById }

