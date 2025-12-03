import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { IProduct } from "@/types/types"

export interface ReceiptItem {
    productId: number
    quantity: number
    unitPrice: number
    subtotal: number
}

interface ReceiptState {
    items: ReceiptItem[]
    products: IProduct[]
    supplierProducts: IProduct[]
    isProductImportDialogOpen: boolean
}

const initialState: ReceiptState = {
    items: [],
    products: [],
    supplierProducts: [],
    isProductImportDialogOpen: false,
}

const receiptSlice = createSlice({
    name: "receipt",
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<IProduct>) => {
            const product = action.payload
            if (!product.productId) return

            const productId: number = product.productId
            const existingIndex = state.items.findIndex(item => item.productId === productId)

            if (existingIndex !== -1) {
                // Nếu đã tồn tại, tăng số lượng
                const item = state.items[existingIndex]
                item.quantity += 1
                item.subtotal = item.quantity * item.unitPrice
            } else {
                // Nếu chưa tồn tại, thêm mới
                const quantity = 1
                const unitPrice = product.price
                state.items.push({
                    productId: productId,
                    quantity,
                    unitPrice,
                    subtotal: quantity * unitPrice
                })
            }
        },
        updateItem: (state, action: PayloadAction<{ index: number; field: 'quantity' | 'unitPrice'; value: number }>) => {
            const { index, field, value } = action.payload
            if (index < 0 || index >= state.items.length) return

            const item = state.items[index]
            if (field === 'quantity') {
                item.quantity = value
                item.subtotal = value * item.unitPrice
            } else {
                item.unitPrice = value
                item.subtotal = item.quantity * value
            }
        },
        removeItem: (state, action: PayloadAction<number>) => {
            const index = action.payload
            if (index >= 0 && index < state.items.length) {
                state.items.splice(index, 1)
            }
        },
        clearItems: (state) => {
            state.items = []
        },
        setProducts: (state, action: PayloadAction<IProduct[]>) => {
            state.products = action.payload
        },
        addProducts: (state, action: PayloadAction<IProduct[]>) => {
            const newProducts = action.payload
            const existingIds = new Set(
                state.products
                    .map((p) => p.productId)
                    .filter((id): id is number => typeof id === "number"),
            )
            newProducts.forEach((p) => {
                if (
                    typeof p.productId === "number" &&
                    !existingIds.has(p.productId)
                ) {
                    state.products.push(p)
                }
            })
        },
        setSupplierProducts: (state, action: PayloadAction<IProduct[]>) => {
            state.supplierProducts = action.payload
        },
        setIsProductImportDialogOpen: (state, action: PayloadAction<boolean>) => {
            state.isProductImportDialogOpen = action.payload
        },
        resetReceipt: (state) => {
            state.items = []
            state.products = []
            state.supplierProducts = []
            state.isProductImportDialogOpen = false
        },
    },
})

export const {
    addItem,
    updateItem,
    removeItem,
    clearItems,
    setProducts,
    addProducts,
    setSupplierProducts,
    setIsProductImportDialogOpen,
    resetReceipt,
} = receiptSlice.actions

// Selectors
export const selectReceiptItems = (state: RootState) => state.receipt.items
export const selectReceiptProducts = (state: RootState) => state.receipt.products
export const selectSupplierProducts = (state: RootState) => state.receipt.supplierProducts
export const selectIsProductImportDialogOpen = (state: RootState) => state.receipt.isProductImportDialogOpen
export const selectReceiptTotalAmount = (state: RootState) => {
    return state.receipt.items.reduce((sum, item) => sum + item.subtotal, 0)
}
export const selectReceiptStats = (state: RootState) => {
    const items = state.receipt.items
    return {
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalProducts: items.length,
    }
}

export default receiptSlice.reducer
