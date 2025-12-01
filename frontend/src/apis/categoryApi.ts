import baseApi from "./baseApi"
import { ICategory } from "@/types/types"

export const getCategories = async ():Promise<ICategory[]> => {
try {
const {data} = await baseApi.get('/Category')
return data
}catch (error) {
    console.error('Error fetching categories:', error)
    throw error
}
}
export const createCategory = async (category: ICategory):Promise<ICategory> => {
        try {
            const { data } = await baseApi.post('/Category', category)
            return data
        } catch (error) {
            console.error('Error creating category:', error)
            throw error
        }
    }
export const updateCategory = async (category: ICategory):Promise<ICategory> => {
    try {
        const { data } = await baseApi.put('/Category', category)
        return data
    } catch (error) {
        console.error('Error updating category:', error)
        throw error
    }
}
export const deleteCategory = async (categoryId: number):Promise<void> => { 
    try {
        const { data } = await baseApi.delete(`/Category/${categoryId}`)
        return data;
    } catch (error) {
        console.error('Error deleting category:', error)
        throw error
    }
} 
export const getCategoryById = async (id: number):Promise<ICategory> => {
    try {
        const { data } = await baseApi.get(`/Category/${id}`)
        return data
    } catch (error) {
        console.error('Error fetching category by id:', error)
        throw error
    }
}