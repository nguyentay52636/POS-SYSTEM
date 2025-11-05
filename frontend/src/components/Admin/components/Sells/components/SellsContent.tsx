"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
    Search,
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    CreditCard,
    X,
    Barcode,
    Package,
    Store,
    TrendingUp,
} from "lucide-react"
import HeaderSells from "./HeaderSells"
import LeftPanelSells from "./LeftPanelSells"
import HeaderCartSells from "./HeaderCartSells"
import CartItem from "./CartSells/CartItem"
import PromotionCodeSells from "@/app/admin/orders/PromotionCodeSells"
import { PaymentMethod as PaymentMethodType } from "@/types/paymentType"
import { CustomerInfo } from "./CustomerForm"
import DialogCustomer from "./DialogCustomer"
import DialogPayment from "./DialogPayment"


export interface ICategory {
    category_id: number
    category_name: string
    createdAt: string
    updatedAt: string
}

export interface IProduct {
    product_id: number
    category_id: number
    supplier_id: number
    product_name: string
    barcode: string
    price: number
    unit: string
    createdAt: string
    updatedAt: string
    image?: string
    stock?: number
}

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
    appliedPromotion?: IPromotion
    selectedEWallet?: string
    customerInfo?: CustomerInfo
}

// Mock data
const mockCategories: ICategory[] = [
    { category_id: 1, category_name: "Trái cây", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
    { category_id: 2, category_name: "Rau củ", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
    { category_id: 3, category_name: "Thịt", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
    { category_id: 4, category_name: "Hải sản", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
    { category_id: 5, category_name: "Sữa", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
]

const mockProducts: IProduct[] = [
    {
        product_id: 1,
        category_id: 1,
        supplier_id: 1,
        product_name: "Táo Gala mini",
        barcode: "8934567890123",
        price: 33600,
        unit: "kg",
        image: "/placeholder.svg",
        stock: 150,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
    },
    {
        product_id: 2,
        category_id: 1,
        supplier_id: 1,
        product_name: "Nho mẫu đơn",
        barcode: "8934567890124",
        price: 49000,
        unit: "kg",
        image: "/placeholder.svg",
        stock: 80,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
    },
    {
        product_id: 3,
        category_id: 1,
        supplier_id: 1,
        product_name: "Cà chua cherry",
        barcode: "8934567890125",
        price: 25000,
        unit: "kg",
        image: "/placeholder.svg",
        stock: 100,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
    },
    {
        product_id: 4,
        category_id: 3,
        supplier_id: 2,
        product_name: "Thịt ba chỉ",
        barcode: "8934567890126",
        price: 180000,
        unit: "kg",
        image: "/placeholder.svg",
        stock: 50,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
    },
    {
        product_id: 5,
        category_id: 5,
        supplier_id: 3,
        product_name: "Sữa tươi TH True Milk",
        barcode: "8934567890127",
        price: 32000,
        unit: "hộp",
        image: "/placeholder.svg",
        stock: 200,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
    },
    {
        product_id: 6,
        category_id: 1,
        supplier_id: 1,
        product_name: "Bánh mì Việt Nam",
        barcode: "8934567890128",
        price: 15000,
        unit: "ổ",
        image: "/placeholder.svg",
        stock: 120,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
    },
]

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
    const [cart, setCart] = useState<CartItem[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<number | "all">("all")
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("")
    const [receivedAmount, setReceivedAmount] = useState<number>(0)
    const [promoCode, setPromoCode] = useState("")
    const [appliedPromotion, setAppliedPromotion] = useState<IPromotion | null>(null)
    const [promoError, setPromoError] = useState("")
    const [selectedEWallet, setSelectedEWallet] = useState<string>("")
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        fullName: "",
        phone: "",
        email: "",
    })
    const [showCustomerForm, setShowCustomerForm] = useState(false)

    // Filter products
    const filteredProducts = mockProducts.filter((product) => {
        const matchesSearch =
            product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) || product.barcode.includes(searchTerm)
        const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory
        return matchesSearch && matchesCategory
    })

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0)
    let discountAmount = 0
    if (appliedPromotion) {
        if (appliedPromotion.discount_type === "percentage") {
            discountAmount = (subtotal * (appliedPromotion.discount_value || 0)) / 100
        } else if (appliedPromotion.discount_type === "fixed") {
            discountAmount = appliedPromotion.discount_value || 0
        }
    }
    const total = subtotal - discountAmount

    // Add to cart
    const addToCart = (product: IProduct) => {
        const existingItem = cart.find((item) => item.product.product_id === product.product_id)
        if (existingItem) {
            updateQuantity(product.product_id, existingItem.quantity + 1)
        } else {
            setCart([
                ...cart,
                {
                    product,
                    quantity: 1,
                    subtotal: product.price,
                },
            ])
        }
    }

    // Update quantity
    const updateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(productId)
            return
        }
        setCart(
            cart.map((item) =>
                item.product.product_id === productId
                    ? { ...item, quantity: newQuantity, subtotal: item.product.price * newQuantity }
                    : item,
            ),
        )
    }

    // Remove from cart
    const removeFromCart = (productId: number) => {
        setCart(cart.filter((item) => item.product.product_id !== productId))
    }

    // Clear cart
    const clearCart = () => {
        setCart([])
        setAppliedPromotion(null)
        setPromoCode("")
        setPromoError("")
        setSelectedEWallet("")
        setSelectedPaymentMethod("")
        setCustomerInfo({ fullName: "", phone: "", email: "" })
        setShowCustomerForm(false)
    }

    // Handle payment
    const handlePayment = () => {
        if (cart.length === 0) return
        setShowCustomerForm(true)
    }

    // Handle customer form next
    const handleCustomerFormNext = () => {
        setShowCustomerForm(false)
        setIsPaymentOpen(true)
    }

    // Handle customer info change
    const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
        setCustomerInfo(prev => ({ ...prev, [field]: value }))
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
            appliedPromotion: appliedPromotion || undefined,
            selectedEWallet: selectedEWallet || undefined,
            customerInfo: customerInfo,
        }

        console.log("Transaction completed:", transaction)
        // Here you would save the transaction to database

        // Clear cart and close dialog
        clearCart()
        setIsPaymentOpen(false)
        setReceivedAmount(0)
        setSelectedPaymentMethod("")

        // Show success message or print receipt
        alert("Thanh toán thành công!")
    }

    // Apply promotion code
    const applyPromoCode = () => {
        setPromoError("")
        const promotion = mockPromotions.find((p) => p.promo_code.toUpperCase() === promoCode.toUpperCase())
        if (promotion) {
            setAppliedPromotion(promotion)
            setPromoError("")
        } else {
            setPromoError("Mã khuyến mãi không hợp lệ")
            setAppliedPromotion(null)
        }
    }

    // Remove promotion
    const removePromotion = () => {
        setAppliedPromotion(null)
        setPromoCode("")
        setPromoError("")
    }

    // Stats
    const stats = {
        totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
        totalProducts: cart.length,
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
                        filteredProducts={filteredProducts}
                        mockCategories={mockCategories}
                        addToCart={addToCart}
                    />
                </div>

                {/* Right Panel - Cart */}
                <div className="w-[480px]  border-l border-green-200 shadow-xl flex flex-col">
                    {/* Cart Header */}
                    <HeaderCartSells cart={cart} total={total} stats={stats} clearCart={clearCart} />

                    {/* Cart Items */}
                    <CartItem cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />

                    <div className="p-6 border-t border-green-200 bg-gradient-to-br from-green-50 to-white">
                        {/* Promotion Code */}
                        <PromotionCodeSells
                            promoCode={promoCode}
                            setPromoCode={setPromoCode}
                            promoError={promoError}
                            setPromoError={setPromoError}
                            appliedPromotion={appliedPromotion}
                            applyPromoCode={applyPromoCode}
                            removePromotion={removePromotion}
                        />

                        <div className="space-y-3 mb-6 bg-white p-5 rounded-xl border border-green-200 shadow-sm">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 font-medium">Tạm tính:</span>
                                <span className="font-semibold text-gray-900">{subtotal.toLocaleString("vi-VN")}đ</span>
                            </div>
                            {appliedPromotion && discountAmount > 0 && (
                                <div className="flex justify-between text-sm text-orange-600">
                                    <span className="font-medium">
                                        Giảm giá (
                                        {appliedPromotion.discount_type === "percentage"
                                            ? `${appliedPromotion.discount_value}%`
                                            : "Cố định"}
                                        ):
                                    </span>
                                    <span className="font-semibold">-{discountAmount.toLocaleString("vi-VN")}đ</span>
                                </div>
                            )}
                            <Separator className="my-3" />
                            <div className="flex justify-between text-lg font-bold bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                                <span className="text-gray-900">Tổng cộng:</span>
                                <span className="text-green-700">{total.toLocaleString("vi-VN")}đ</span>
                            </div>
                        </div>

                        <Button
                            onClick={handlePayment}
                            disabled={cart.length === 0}
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                onClose={() => setShowCustomerForm(false)}
                customerInfo={customerInfo}
                onCustomerInfoChange={handleCustomerInfoChange}
                onNext={handleCustomerFormNext}
                total={total}
            />

            {/* Payment Method Dialog */}
            <DialogPayment
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                selectedPaymentMethod={selectedPaymentMethod}
                onPaymentMethodChange={setSelectedPaymentMethod}
                paymentMethods={mockPaymentMethods}
                total={total}
                customerInfo={customerInfo}
                onPaymentComplete={completeTransaction}
            />
        </div>
    )
}

