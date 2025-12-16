import { IProduct, ICategory } from "@/types/types";
import baseApi from "./baseApi";

export const getProducts = async (): Promise<IProduct[]> => {
    try {
        const { data } = await baseApi.get('/Product')
        console.log(data);
        return data;

    } catch (error) {
        console.error('Error fetching products:', error)
        throw error
    }
}

export const getProductById = async (productId: number): Promise<IProduct> => {
    try {
        const { data } = await baseApi.get(`/Product/${productId}`)
        return data
    } catch (error) {
        console.error('Error fetching product:', error)
        throw error
    }
}

export const createProduct = async (product: IProduct): Promise<IProduct> => {
    try {
        const { data } = await baseApi.post('/Product', product)
        return data;
    } catch (error) {
        console.error('Error creating product:', error)
        throw error
    }
}

export const updateProduct = async (productId: number, product: IProduct): Promise<IProduct> => {
    try {
        const { data } = await baseApi.put(`/Product/${productId}`, product)
        return data;
    } catch (error) {
        console.error('Error updating product:', error)
        throw error
    }
}

export const deleteProduct = async (productId: number): Promise<void> => {
    try {
        await baseApi.delete(`/Product/${productId}`)
    } catch (error) {
        console.error('Error deleting product:', error)
        throw error
    }
}

export const updateProductStatus = async (productId: number): Promise<void> => {
    try {
        const { data } = await baseApi.patch(`/Product/${productId}/status`);
        return data
    } catch (error) {
        console.error('Error updating product status:', error)
        throw error
    }

}
export const updateStatusProduct = async (productId: number): Promise<void> => {
    try {
        const { data } = await baseApi.patch(`/Product/${productId}/toggle-status`);
        return data
    } catch (error) {
        console.error('Error updating product status:', error)
        throw error
    }
}
