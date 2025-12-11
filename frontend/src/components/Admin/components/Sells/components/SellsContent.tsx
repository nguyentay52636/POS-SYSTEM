"use client"
import React, { useState } from "react"
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
import { ICustomer, IInventory } from "@/types/types"
import DialogCustomer from "./DialogCustomer"
import DialogPayment from "./DialogPayment"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ChoiceCustomerPayment from "./ChoiceCustomerPayment/ChoiceCustomerPayment"
import CustomerPoints from "./CustomerPoints/CustomerPoints"
import FormNewCustomerPayment from "./CustomerPoints/FormNewCustomerPayment"
import { CustomerInfo } from "./CustomerForm"
import { createCustomer } from "@/apis/customerApi"
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
    selectSelectedCustomerId,
    selectShowCustomerForm,
    selectIsPaymentOpen,
    selectSelectedPaymentMethod,
    selectReceivedAmount,
    selectSelectedEWallet,
    setCustomerInfo,
    setSelectedCustomerId,
    type IPromotion,
    type CartItem,
} from "@/redux/Slice/cartSlice"
import type { AppDispatch } from "@/redux/store"
import { useInventory } from "@/hooks/useInventory"
import { useCategory } from "@/hooks/useCategory"
import { getConfigCustomerPoints } from "@/apis/configCustomerPoints"
import { addPointsToCustomer } from "@/apis/customerApi"
import { toast } from "sonner"
import { mockPaymentMethods } from "@/utils/MethodPayment"

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



export default function SellsContent() {
    const dispatch = useDispatch<AppDispatch>()
    const { inventories, loading, fetchInventories } = useInventory()
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
    const selectedCustomerId = useSelector(selectSelectedCustomerId)
    const showCustomerForm = useSelector(selectShowCustomerForm)
    const isPaymentOpen = useSelector(selectIsPaymentOpen)
    const selectedPaymentMethod = useSelector(selectSelectedPaymentMethod)
    const receivedAmount = useSelector(selectReceivedAmount)

    // Local state for UI
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<number | "all">("all")
    const [isChoiceDialogOpen, setIsChoiceDialogOpen] = useState(false)
    const [isCustomerPointsOpen, setIsCustomerPointsOpen] = useState(false)
    const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = useState(false)
    const [configPoints, setConfigPoints] = useState<{ pointsPerUnit: number; moneyPerUnit: number; isActive: boolean } | null>(null)

    // Load config customer points
    React.useEffect(() => {
        const loadConfig = async () => {
            try {
                const configs = await getConfigCustomerPoints()
                const activeConfig = configs.find(c => c.isActive) || configs[0]
                if (activeConfig) {
                    setConfigPoints({
                        pointsPerUnit: activeConfig.pointsPerUnit,
                        moneyPerUnit: activeConfig.moneyPerUnit,
                        isActive: activeConfig.isActive,
                    })
                }
            } catch (error) {
                console.error("Error loading config customer points:", error)
            }
        }
        loadConfig()
    }, [])

    const filteredInventories: IInventory[] = inventories.filter((inventory) => {
        const name =
            inventory.product?.productName ??
            inventory.productName ??
            ""
        const barcode = inventory.product?.barcode ?? ""
        const categoryId = inventory.product?.categoryId
        const status = inventory.product?.status

        // Chỉ hiển thị sản phẩm có status "active"
        const isActive = status === "active"

        const matchesSearch =
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            barcode.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesCategory =
            selectedCategory === "all" ||
            (categoryId !== undefined && categoryId === selectedCategory)

        return isActive && matchesSearch && matchesCategory
    })

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

    const handlePayment = () => {
        if (cart.length === 0) return
        setIsChoiceDialogOpen(true)
    }

    const handleChoiceCustomer = () => {
        setIsChoiceDialogOpen(false)
        setIsCustomerPointsOpen(true)
    }

    const handleChoiceSkip = () => {
        // Reset customer info when skipping
        dispatch(setCustomerInfo({
            fullName: "",
            phone: "",
            email: "",
        }))
        dispatch(setSelectedCustomerId(null))
        setIsChoiceDialogOpen(false)
        dispatch(setIsPaymentOpen(true))
    }

    const handleSelectCustomerFromPoints = (customer: ICustomer) => {
        const info: CustomerInfo = {
            fullName: customer.name,
            phone: customer.phone || "",
            email: customer.email || "",
        }
        dispatch(setCustomerInfo(info))
        dispatch(setSelectedCustomerId(customer.customerId))
        setIsCustomerPointsOpen(false)
        dispatch(setShowCustomerForm(true))
    }

    const handleAddNewCustomer = () => {
        setIsNewCustomerDialogOpen(true)
    }

    const handleCustomerCreated = (customer: { customerId: number; name: string; phone: string; email: string }) => {
        const info: CustomerInfo = {
            fullName: customer.name,
            phone: customer.phone || "",
            email: customer.email || "",
        }
        dispatch(setCustomerInfo(info))
        dispatch(setSelectedCustomerId(customer.customerId))
        setIsNewCustomerDialogOpen(false)
        setIsCustomerPointsOpen(false)
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
    const completeTransaction = async () => {
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

        // Close all dialogs
        setIsChoiceDialogOpen(false)
        setIsCustomerPointsOpen(false)
        dispatch(setShowCustomerForm(false))
        dispatch(setIsPaymentOpen(false))

        // Clear cart and reset payment state
        dispatch(clearCart())
        dispatch(resetPaymentState())

        // Reload inventory data after successful payment
        try {
            await fetchInventories()
            console.log("✅ Đã cập nhật lại danh sách tồn kho sau khi thanh toán")
        } catch (error) {
            console.error("❌ Lỗi khi tải lại danh sách tồn kho:", error)
            // Không hiển thị toast error vì thanh toán đã thành công
        }
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

            {/* Choice products & customer dialog */}
            <Dialog open={isChoiceDialogOpen} onOpenChange={setIsChoiceDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Danh sách sản phẩm trước khi chọn khách hàng</DialogTitle>
                    </DialogHeader>
                    <ChoiceCustomerPayment
                        onChooseCustomer={handleChoiceCustomer}
                        onSkip={handleChoiceSkip}
                    />
                </DialogContent>
            </Dialog>

            {/* Customer points / list dialog */}
            <Dialog open={isCustomerPointsOpen} onOpenChange={setIsCustomerPointsOpen}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Danh sách khách hàng tích điểm</DialogTitle>
                    </DialogHeader>
                    <CustomerPoints
                        onSelectCustomer={handleSelectCustomerFromPoints}
                        onAddNewCustomer={handleAddNewCustomer}
                    />
                </DialogContent>
            </Dialog>

            {/* New Customer Dialog */}
            <Dialog open={isNewCustomerDialogOpen} onOpenChange={setIsNewCustomerDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Thêm khách hàng mới</DialogTitle>
                    </DialogHeader>
                    <FormNewCustomerPayment
                        onCustomerCreated={handleCustomerCreated}
                        onCancel={() => setIsNewCustomerDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

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
                subtotal={subtotal}
                discountAmount={discountAmount}
                customerInfo={customerInfo}
                appliedPromotions={appliedPromotions}
                onPaymentComplete={completeTransaction}
            />
        </div>
    )
}
