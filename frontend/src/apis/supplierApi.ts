import baseApi from "./baseApi"
import { ISupplier } from "@/types/types"



// DTOs
export interface CreateSupplierDTO {
    name: string
    phone: string
    email: string
    address: string
    description?: string
    trangThai?: "active" | "inactive"
}

export interface UpdateSupplierDTO {
    name?: string
    phone?: string
    email?: string
    address?: string
    description?: string
    trangThai?: "active" | "inactive"
}

const getAllSuppliers = async (): Promise<ISupplier[]> => {
    try {
        const { data } = await baseApi.get('/Supplier')
        return data
    } catch (error) {
        console.error('Error fetching suppliers:', error)
        throw error
    }
}

const addSupplier = async (supplierData: CreateSupplierDTO): Promise<ISupplier> => {
    try {
        const { data } = await baseApi.post('/Supplier', supplierData)
        return data
    } catch (error) {
        console.error('Error adding supplier:', error)
        throw error
    }
}

    const updateSupplier = async (supplierId: number, supplierData: UpdateSupplierDTO): Promise<ISupplier> => {
    try {
        const { data } = await baseApi.put(`/Supplier/${supplierId}`, supplierData)
        return data
    } catch (error) {
        console.error('Error updating supplier:', error)
        throw error
    }
}

const deleteSupplier = async (supplierId: number): Promise<void> => {
    try {
        await baseApi.delete(`/Supplier/${supplierId}`)
    } catch (error) {
        console.error('Error deleting supplier:', error)
        throw error
    }
}

export { getAllSuppliers, addSupplier, updateSupplier, deleteSupplier }