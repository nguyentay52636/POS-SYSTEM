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
        image_url: apiProduct.imageUrl || apiProduct.image_url || apiProduct.image || "",
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

const createProductFormData = (
    product: IProduct,
    imageFile?: File | null,
    imageUrl?: string
): FormData => {
    const formData = new FormData();
    
    if (product.product_id) {
        formData.append("productId", product.product_id.toString());
    }
    formData.append("productName", product.product_name.trim());
    formData.append("barcode", (product.barcode || "").trim());
    formData.append("price", String(product.price));
    formData.append("unit", String(product.unit || 0));
    formData.append("status", product.status || "active");
    
    const categoryId = typeof product.category_id === 'object' 
        ? product.category_id.category_id 
        : product.category_id;
    const supplierId = typeof product.supplier_id === 'object' 
        ? product.supplier_id.supplier_id 
        : product.supplier_id;
    
    if (categoryId) {
        formData.append("categoryId", String(categoryId));
    }
    if (supplierId) {
        formData.append("supplierId", String(supplierId));
    }
    
    if (imageFile) {
        formData.append("imageFile", imageFile);
    } else if (imageUrl) {
        formData.append("imageUrl", imageUrl.trim());
    }
    
    return formData;
};

// Create product with file upload support
export const createProductWithFormData = async (
    product: IProduct,
    imageFile?: File | null,
    imageUrl?: string
): Promise<IProduct> => {
    try {
        const formData = createProductFormData(product, imageFile, imageUrl);
        
        // Use fetch directly for FormData to avoid axios issues with multipart/form-data
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch('/api/product', {
            method: 'POST',
            body: formData,
            headers,
        });
        
        if (!response.ok) {
            let errorMessage = "Lỗi tạo sản phẩm";
            try {
                const errorData = await response.json();
                if (errorData.errors) {
                    const errors = Object.values(errorData.errors).flat() as string[];
                    errorMessage = errors.join(", ");
                } else {
                    errorMessage = errorData.message || errorData.title || errorMessage;
                }
            } catch {
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        return mapApiProductToComponent(data);
    } catch (error) {
        console.error('Error creating product with file:', error);
        throw error;
    }
};

// Update product with file upload support
export const updateProductWithFormData = async (
    productId: number,
    product: IProduct,
    imageFile?: File | null,
    imageUrl?: string
): Promise<IProduct> => {
    try {
        const formData = createProductFormData(product, imageFile, imageUrl);
        
        // Use fetch directly for FormData
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`/api/product/${productId}`, {
            method: 'PUT',
            body: formData,
            headers,
        });
        
        if (!response.ok) {
            let errorMessage = "Lỗi cập nhật sản phẩm";
            try {
                const errorData = await response.json();
                if (errorData.errors) {
                    const errors = Object.values(errorData.errors).flat() as string[];
                    errorMessage = errors.join(", ");
                } else {
                    errorMessage = errorData.message || errorData.title || errorMessage;
                }
            } catch {
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        return mapApiProductToComponent(data);
    } catch (error) {
        console.error('Error updating product with file:', error);
        throw error;
    }
};

