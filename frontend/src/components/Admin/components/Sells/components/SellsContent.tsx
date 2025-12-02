"use client"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CreditCard } from "lucide-react"
import HeaderSells from "./HeaderSells"
import LeftPanelSells from "./LeftPanelSells"
import HeaderCartSells from "./HeaderCartSells"
import CartItemComponent from "./CartSells/CartItem"
import PromotionCodeSells from "@/app/admin/orders/PromotionCodeSells"
import { PaymentMethod as PaymentMethodType } from "@/types/paymentType"
import { IInventory } from "@/types/types"
import DialogCustomer from "./DialogCustomer"
import DialogPayment from "./DialogPayment"
import { useInventory } from "@/hooks/useInventory"
import { useCategory } from "@/hooks/useCategory"
import { CustomerInfo } from "./CustomerForm"
import {
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
    updateCustomerInfo,
    setShowCustomerForm,
    setIsPaymentOpen,
    resetPaymentState,
    selectCartItems,
    selectCartTotal,
    selectCartStats,
    selectAppliedPromotions,
    selectPromoCode,
    selectPromoError,
    selectCustomerInfo,
    selectShowCustomerForm,
    selectIsPaymentOpen,
    selectSelectedPaymentMethod,
    selectReceivedAmount,
    selectSelectedEWallet,
    type IPromotion,
    type CartItem,
} from "@/redux/Slice/cartSlice"
import type { AppDispatch } from "@/redux/store"



export interface Transaction {
    transaction_id: string
    items: CartItem[]
    total: number
    discount: number
    finalTotal: number
    paymentMethod: string
    receivedAmount: number
    changeAmount: number
    createdAt: string
    cashier: string
    appliedPromotions?: IPromotion[]
    selectedEWallet?: string
    customerInfo?: CustomerInfo
}



const mockPromotions: IPromotion[] = [
    {
        promo_id: 1,
        promo_code: "SUMMER2024",
        description: "Giảm 10% cho đơn hàng mùa hè",
        discount_type: "percentage",
        discount_value: 10,
    },
    {
        promo_id: 2,
        promo_code: "NEWYEAR",
        description: "Giảm 50.000đ cho đơn hàng năm mới",
        discount_type: "fixed",
        discount_value: 50000,
    },
    {
        promo_id: 3,
        promo_code: "VIP20",
        description: "Giảm 20% cho khách hàng VIP",
        discount_type: "percentage",
        discount_value: 20,
    },
]

const mockPaymentMethods: PaymentMethodType[] = [
    {
        type: "cash",
        label: "Tiền mặt",
        description: "Thanh toán bằng tiền mặt khi nhận hàng",
        category: "offline",
    },
    {
        type: "card",
        label: "Thẻ tín dụng",
        description: "Thanh toán bằng thẻ Visa, Mastercard",
        category: "offline",
    },
    {
        type: "momo",
        label: "MoMo",
        description: "Thanh toán qua ví điện tử MoMo",
        category: "online",
        accountInfo: {
            bankId: "MOMO",
            bankAccount: "0123456789",
            phoneNumber: "789",
        },
    },
    {
        type: "zalopay",
        label: "ZaloPay",
        description: "Thanh toán qua ví điện tử ZaloPay",
        category: "online",
        accountInfo: {
            bankId: "ZALOPAY",
            bankAccount: "0987654321",
        },
    },
    {
        type: "vnpay",
        label: "VNPay",
        description: "Thanh toán qua cổng VNPay",
        category: "online",
        vnpayInfo: {
            merchantId: "VNPAY001",
            merchantName: "Cửa hàng ABC",
            store: "Store 001",
            terminal: "Terminal 001",
        },
    },
]

export default function SellsContent() {
    const dispatch = useDispatch<AppDispatch>()
    const { inventories, loading } = useInventory()
    const { categories, loading: categoryLoading } = useCategory()

    // Redux state
    const cart = useSelector(selectCartItems)
    const { subtotal, discountAmount, total } = useSelector(selectCartTotal)
    const stats = useSelector(selectCartStats)
    const appliedPromotions = useSelector(selectAppliedPromotions)
    const promoCode = useSelector(selectPromoCode)
    const promoError = useSelector(selectPromoError)
    const selectedEWallet = useSelector(selectSelectedEWallet)
    const customerInfo = useSelector(selectCustomerInfo)
    const showCustomerForm = useSelector(selectShowCustomerForm)
    const isPaymentOpen = useSelector(selectIsPaymentOpen)
    const selectedPaymentMethod = useSelector(selectSelectedPaymentMethod)
    const receivedAmount = useSelector(selectReceivedAmount)

    // Local state for UI
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<number | "all">("all")

    const filteredInventories: IInventory[] = inventories.filter((inventory) => {
        const name =
            inventory.product?.productName ??
            inventory.productName ??
            ""
        const barcode = inventory.product?.barcode ?? ""
        const categoryId = inventory.product?.categoryId

        const matchesSearch =
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            barcode.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesCategory =
            selectedCategory === "all" ||
            (categoryId !== undefined && categoryId === selectedCategory)

        return matchesSearch && matchesCategory
    })

    // Add to cart handler
    const handleAddToCart = (inventory: IInventory) => {
        const product = inventory.product
        if (!product || !product.productId) return

        const existingItem = cart.find((item) => item.product.productId === product.productId)
        if (existingItem) {
            dispatch(updateQuantity({ productId: product.productId, quantity: existingItem.quantity + 1 }))
        } else {
            dispatch(addToCart({ product }))
        }
    }

    // Update quantity handler
    const handleUpdateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            dispatch(removeFromCart(productId))
            return
        }
        dispatch(updateQuantity({ productId, quantity: newQuantity }))
    }

    // Remove from cart handler
    const handleRemoveFromCart = (productId: number) => {
        dispatch(removeFromCart(productId))
    }

    // Clear cart handler
    const handleClearCart = () => {
        dispatch(clearCart())
    }

    // Handle payment
    const handlePayment = () => {
        if (cart.length === 0) return
        dispatch(setShowCustomerForm(true))
    }

    // Handle customer form next
    const handleCustomerFormNext = () => {
        dispatch(setShowCustomerForm(false))
        dispatch(setIsPaymentOpen(true))
    }

    // Handle customer info change
    const handleCustomerInfoChange = (field: keyof typeof customerInfo, value: string) => {
        dispatch(updateCustomerInfo({ field, value }))
    }

    // Complete transaction
    const completeTransaction = () => {
        const transaction: Transaction = {
            transaction_id: `TXN${Date.now()}`,
            items: cart,
            total: subtotal,
            discount: discountAmount,
            finalTotal: total,
            paymentMethod: selectedPaymentMethod,
            receivedAmount,
            changeAmount: receivedAmount - total,
            createdAt: new Date().toISOString(),
            cashier: "Admin",
            appliedPromotions: appliedPromotions.length ? appliedPromotions : undefined,
            selectedEWallet: selectedEWallet || undefined,
            customerInfo: customerInfo,
        }

        console.log("Transaction completed:", transaction)
        // Here you would save the transaction to database

        // Clear cart and close dialog
        dispatch(clearCart())
        dispatch(resetPaymentState())

        // Show success message or print receipt
        alert("Thanh toán thành công!")
    }

    // Apply promotion code
    const handleApplyPromoCode = () => {
        dispatch(setPromoError(""))
        const promotion = mockPromotions.find((p) => p.promo_code.toUpperCase() === promoCode.toUpperCase())
        if (promotion) {
            dispatch(applyPromotion(promotion))
        } else {
            dispatch(setPromoError("Mã khuyến mãi không hợp lệ"))
        }
    }

    // Remove promotion handler
    const handleRemovePromotion = (promoId?: number) => {
        dispatch(removePromotion(promoId))
    }

    // Stats (already computed from Redux selectors)
    const cartStats = {
        ...stats,
        subtotal,
        total,
    }

    return (
        <div className="min-h-screen ">
            <HeaderSells cart={cart} total={total} />

            <div className="flex h-[calc(100vh-100px)] overflow-hidden">
                {/* Left Panel - Products */}
                <div className="flex-1 min-w-0">
                    <LeftPanelSells
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        filteredInventories={filteredInventories}
                        mockCategories={categories}
                        addToCart={handleAddToCart}
                    />
                </div>

                {/* Right Panel - Cart */}
                <div className="w-[480px]  border-l border-green-200 shadow-xl flex flex-col">
                    {/* Cart Header */}
                    <HeaderCartSells cart={cart} total={total} stats={cartStats} clearCart={handleClearCart} />

                    {/* Cart Items */}
                    <CartItemComponent cart={cart} updateQuantity={handleUpdateQuantity} removeFromCart={handleRemoveFromCart} />

                    <div className="p-6 border-t border-green-200">
                        {/* Promotion Code */}
                        <PromotionCodeSells
                            promoCode={promoCode}
                            setPromoCode={(code) => dispatch(setPromoCode(code))}
                            promoError={promoError}
                            setPromoError={(error) => dispatch(setPromoError(error))}
                            appliedPromotions={appliedPromotions}
                            applyPromoCode={handleApplyPromoCode}
                            removePromotion={handleRemovePromotion}
                        />

                        <div className="space-y-3 mb-6 bg-white p-5 rounded-xl border border-green-200 shadow-sm">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 font-medium">Tạm tính:</span>
                                <span className="font-semibold text-gray-900">{subtotal.toLocaleString("vi-VN")}đ</span>
                            </div>
                            {appliedPromotions.length > 0 && discountAmount > 0 && (
                                <div className="flex justify-between text-sm text-orange-600">
                                    <span className="font-medium">
                                        Giảm giá ({appliedPromotions.length} KM):
                                    </span>
                                    <span className="font-semibold">-{discountAmount.toLocaleString("vi-VN")}đ</span>
                                </div>
                            )}
                            <Separator className="my-3" />
                            <div className="flex justify-between text-lg font-bold p-4 rounded-lg border border-green-200">
                                <span className="text-gray-900">Tổng cộng:</span>
                                <span className="text-green-700">{total.toLocaleString("vi-VN")}đ</span>
                            </div>
                        </div>

                        <Button
                            onClick={handlePayment}
                            disabled={cart.length === 0}
                            className="w-full text-white h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200  disabled:cursor-not-allowed"
                        >
                            <CreditCard className="mr-2 h-5 w-5" />
                            Thanh toán ngay
                        </Button>
                    </div>
                </div>
            </div>

            {/* Customer Form Dialog */}
            <DialogCustomer
                isOpen={showCustomerForm}
                onClose={() => dispatch(setShowCustomerForm(false))}
                customerInfo={customerInfo}
                onCustomerInfoChange={handleCustomerInfoChange}
                onNext={handleCustomerFormNext}
                total={total}
            />

            {/* Payment Method Dialog */}
            <DialogPayment
                isOpen={isPaymentOpen}
                onClose={() => dispatch(setIsPaymentOpen(false))}
                selectedPaymentMethod={selectedPaymentMethod}
                onPaymentMethodChange={(method) => dispatch(setSelectedPaymentMethod(method))}
                paymentMethods={mockPaymentMethods}
                total={total}
                customerInfo={customerInfo}
                onPaymentComplete={completeTransaction}
            />
        </div>
    )
}

