import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { IProduct } from "@/types/types"
import { CustomerInfo } from "@/components/Admin/components/Sells/components/CustomerForm"

export interface IPromotion {
    promo_id: number
    promo_code: string
    description: string
    discount_type: string // "percentage" or "fixed"
    discount_value?: number
}

export interface CartItem {
    product: IProduct
    quantity: number
    subtotal: number
}

interface CartState {
    items: CartItem[]
    appliedPromotions: IPromotion[]
    promoCode: string
    promoError: string
    selectedEWallet: string
    selectedPaymentMethod: string
    receivedAmount: number
    customerInfo: CustomerInfo
    showCustomerForm: boolean
    isPaymentOpen: boolean
}

const initialState: CartState = {
    items: [],
    appliedPromotions: [],
    promoCode: "",
    promoError: "",
    selectedEWallet: "",
    selectedPaymentMethod: "",
    receivedAmount: 0,
    customerInfo: {
        fullName: "",
        phone: "",
        email: "",
    },
    showCustomerForm: false,
    isPaymentOpen: false,
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<{ product: IProduct }>) => {
            const { product } = action.payload
            if (!product || !product.productId) return

            const existingItem = state.items.find((item) => item.product.productId === product.productId)
            if (existingItem) {
                existingItem.quantity += 1
                existingItem.subtotal = existingItem.product.price * existingItem.quantity
            } else {
                state.items.push({
                    product,
                    quantity: 1,
                    subtotal: product.price,
                })
            }
        },
        updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
            const { productId, quantity } = action.payload
            if (quantity <= 0) {
                state.items = state.items.filter((item) => item.product.productId !== productId)
            } else {
                const item = state.items.find((item) => item.product.productId === productId)
                if (item) {
                    item.quantity = quantity
                    item.subtotal = item.product.price * quantity
                }
            }
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((item) => item.product.productId !== action.payload)
        },
        clearCart: (state) => {
            state.items = []
            state.appliedPromotions = []
            state.promoCode = ""
            state.promoError = ""
            state.selectedEWallet = ""
            state.selectedPaymentMethod = ""
            state.receivedAmount = 0
            state.customerInfo = {
                fullName: "",
                phone: "",
                email: "",
            }
            state.showCustomerForm = false
            state.isPaymentOpen = false
        },
        setPromoCode: (state, action: PayloadAction<string>) => {
            state.promoCode = action.payload
            state.promoError = ""
        },
        applyPromotion: (state, action: PayloadAction<IPromotion>) => {
            const exists = state.appliedPromotions.some(
                (p) => p.promo_id === action.payload.promo_id
            )
            if (!exists) {
                state.appliedPromotions.push(action.payload)
            }
            state.promoError = ""
        },
        removePromotion: (state, action: PayloadAction<number | undefined>) => {
            const promoId = action.payload
            if (promoId != null) {
                state.appliedPromotions = state.appliedPromotions.filter(
                    (p) => p.promo_id !== promoId
                )
            } else {
                state.appliedPromotions = []
                state.promoCode = ""
            }
            state.promoError = ""
        },
        setPromoError: (state, action: PayloadAction<string>) => {
            state.promoError = action.payload
        },
        setSelectedEWallet: (state, action: PayloadAction<string>) => {
            state.selectedEWallet = action.payload
        },
        setSelectedPaymentMethod: (state, action: PayloadAction<string>) => {
            state.selectedPaymentMethod = action.payload
        },
        setReceivedAmount: (state, action: PayloadAction<number>) => {
            state.receivedAmount = action.payload
        },
        setCustomerInfo: (state, action: PayloadAction<CustomerInfo>) => {
            state.customerInfo = action.payload
        },
        updateCustomerInfo: (state, action: PayloadAction<{ field: keyof CustomerInfo; value: string }>) => {
            const { field, value } = action.payload
            state.customerInfo[field] = value
        },
        setShowCustomerForm: (state, action: PayloadAction<boolean>) => {
            state.showCustomerForm = action.payload
        },
        setIsPaymentOpen: (state, action: PayloadAction<boolean>) => {
            state.isPaymentOpen = action.payload
        },
        resetPaymentState: (state) => {
            state.isPaymentOpen = false
            state.receivedAmount = 0
            state.selectedPaymentMethod = ""
        },
    },
})

export const {
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    setPromoCode,
    applyPromotion,
    removePromotion,
    setPromoError,
    setSelectedEWallet,
    setSelectedPaymentMethod,
    setReceivedAmount,
    setCustomerInfo,
    updateCustomerInfo,
    setShowCustomerForm,
    setIsPaymentOpen,
    resetPaymentState,
} = cartSlice.actions

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartTotal = (state: RootState) => {
    const subtotal = state.cart.items.reduce((sum, item) => sum + item.subtotal, 0)
    let discountAmount = 0

    if (state.cart.appliedPromotions.length > 0) {
        let percentTotal = 0
        let fixedTotal = 0

        state.cart.appliedPromotions.forEach((promo) => {
            if (promo.discount_type === "percentage") {
                percentTotal += promo.discount_value || 0
            } else if (promo.discount_type === "fixed") {
                fixedTotal += promo.discount_value || 0
            }
        })

        // Giới hạn tổng % tối đa 100%
        percentTotal = Math.min(percentTotal, 100)

        const percentDiscount = (subtotal * percentTotal) / 100
        discountAmount = percentDiscount + fixedTotal

        // Không cho giảm quá subtotal
        if (discountAmount > subtotal) {
            discountAmount = subtotal
        }
    }

    return {
        subtotal,
        discountAmount,
        total: subtotal - discountAmount,
    }
}
export const selectCartStats = (state: RootState) => {
    const items = state.cart.items
    return {
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalProducts: items.length,
    }
}
export const selectAppliedPromotions = (state: RootState) => state.cart.appliedPromotions
export const selectPromoCode = (state: RootState) => state.cart.promoCode
export const selectPromoError = (state: RootState) => state.cart.promoError
export const selectCustomerInfo = (state: RootState) => state.cart.customerInfo
export const selectShowCustomerForm = (state: RootState) => state.cart.showCustomerForm
export const selectIsPaymentOpen = (state: RootState) => state.cart.isPaymentOpen
export const selectSelectedPaymentMethod = (state: RootState) => state.cart.selectedPaymentMethod
export const selectReceivedAmount = (state: RootState) => state.cart.receivedAmount
export const selectSelectedEWallet = (state: RootState) => state.cart.selectedEWallet

export default cartSlice.reducer

