import { IProduct, ICategory } from "@/types/types";
import baseApi from "./baseApi";

// Helper function to map API response (camelCase) to component format (snake_case)
const mapApiProductToComponent = (apiProduct: any): IProduct => {
    // Normalize category object
    let category: ICategory | undefined
    if (apiProduct.category) {
        category = {
            category_id: apiProduct.category.categoryId || apiProduct.category.category_id || 0,
            category_name: apiProduct.category.categoryName || apiProduct.category.category_name || "",
            createdAt: apiProduct.category.createdAt || apiProduct.category.created_at || "",
            updatedAt: apiProduct.category.updatedAt || apiProduct.category.updated_at || ""
        }
    } else if (apiProduct.category_id) {
        category = typeof apiProduct.category_id === 'object' 
            ? {
                category_id: apiProduct.category_id.categoryId || apiProduct.category_id.category_id || 0,
                category_name: apiProduct.category_id.categoryName || apiProduct.category_id.category_name || "",
                createdAt: apiProduct.category_id.createdAt || apiProduct.category_id.created_at || "",
                updatedAt: apiProduct.category_id.updatedAt || apiProduct.category_id.updated_at || ""
            }
            : undefined
    } else if (apiProduct.categoryId) {
        category = {
            category_id: apiProduct.categoryId,
            category_name: apiProduct.categoryName || "",
            createdAt: "",
            updatedAt: ""
        }
    }

    // Normalize supplier object
    let supplier: any
    if (apiProduct.supplier) {
        supplier = {
            supplier_id: apiProduct.supplier.supplierId || apiProduct.supplier.supplier_id || 0,
            name: apiProduct.supplier.name || "",
            phone: apiProduct.supplier.phone || "",
            email: apiProduct.supplier.email || "",
            address: apiProduct.supplier.address || "",
            updatedAt: apiProduct.supplier.updatedAt || apiProduct.supplier.updated_at || new Date().toISOString()
        }
    } else if (apiProduct.supplier_id) {
        supplier = typeof apiProduct.supplier_id === 'object' ? apiProduct.supplier_id : undefined
    } else if (apiProduct.supplierId) {
        supplier = {
            supplier_id: apiProduct.supplierId,
            name: "",
            phone: "",
            email: "",
            address: "",
            updatedAt: new Date().toISOString()
        }
    }

    return {
        product_id: apiProduct.productId || apiProduct.product_id,
        product_name: apiProduct.productName || apiProduct.product_name,
        barcode: apiProduct.barcode || "",
        price: apiProduct.price || 0,
        image_url: apiProduct.image_url || apiProduct.image || "",
        unit: apiProduct.unit || 0,
        status: apiProduct.status || "active",
        createdAt: apiProduct.createdAt || apiProduct.created_at || new Date().toISOString(),
        updatedAt: apiProduct.updatedAt || apiProduct.updated_at || new Date().toISOString(),
        category_id: category || {
            category_id: 0,
            category_name: "",
            createdAt: "",
            updatedAt: ""
        },
        supplier_id: supplier || {
            supplier_id: 0,
            name: "",
            phone: "",
            email: "",
            address: "",
            updatedAt: new Date().toISOString()
        }
    };
};

// Helper function to map component format to API format (camelCase)
const mapComponentProductToApi = (product: IProduct): any => {
    return {
        productId: product.product_id,
        productName: product.product_name,
        barcode: product.barcode,
        price: product.price,
        imageUrl: product.image_url,
        unit: product.unit,
        status: product.status,
        categoryId: typeof product.category_id === 'object' ? product.category_id.category_id : product.category_id,
        supplierId: typeof product.supplier_id === 'object' ? product.supplier_id.supplier_id : product.supplier_id,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
    };
};

export const getProducts = async (): Promise<IProduct[]> => {
    try {
        const { data } = await baseApi.get('/Product')
        // Map array of products
        if (Array.isArray(data)) {
            return data.map(mapApiProductToComponent);
        }
        return [];
    } catch (error) {
        console.error('Error fetching products:', error)
        throw error
    }
} 

export const getProductById = async (productId: number): Promise<IProduct> => {
    try {
        const { data } = await baseApi.get(`/Product/${productId}`)
        return mapApiProductToComponent(data);
    } catch (error) {
        console.error('Error fetching product:', error)
        throw error
    }
}

export const createProduct = async (product: IProduct): Promise<IProduct> => { 
    try {
        const apiProduct = mapComponentProductToApi(product);
        const { data } = await baseApi.post('/Product', apiProduct)
        return mapApiProductToComponent(data);
    } catch (error) {
        console.error('Error creating product:', error)
        throw error
    }
} 

export const updateProduct = async (productId: number, product: IProduct): Promise<IProduct> => {
    try {
        const apiProduct = mapComponentProductToApi(product);
        const { data } = await baseApi.put(`/Product/${productId}`, apiProduct)
        return mapApiProductToComponent(data);
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

