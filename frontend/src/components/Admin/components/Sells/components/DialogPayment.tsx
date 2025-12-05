import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Receipt } from 'lucide-react';
import PaymentMethod from './SelectedPayment/PaymentMethod';
import { PaymentMethod as PaymentMethodType } from '@/types/paymentType';
import { CustomerInfo } from './CustomerForm';
import { useSelector } from 'react-redux';
import { selectSelectedCustomerId, selectCartItems, type CartItem, type IPromotion } from '@/redux/Slice/cartSlice';
import { getConfigCustomerPoints, ConfigCustomerPoints } from '@/apis/configCustomerPoints';
import { addPointsToCustomer } from '@/apis/customerApi';
import { createOrder, getOrderById, type Order, type OrderItem, type CreateOrderDto } from '@/apis/orderApi';
import { create as createPayment, type IPayment } from '@/apis/paymentApi';
import { buildInvoiceHtml } from '@/lib/invoice';
import { updateInventoryQuantity } from '@/apis/inventoryApi';
import { getAllInventory } from '@/apis/inventoryApi';
import { IInventory } from '@/types/types';
import { toast } from 'sonner';

interface DialogPaymentProps {
    isOpen: boolean;
    onClose: () => void;
    selectedPaymentMethod: string;
    onPaymentMethodChange: (method: string) => void;
    paymentMethods: PaymentMethodType[];
    total: number;
    subtotal: number;
    discountAmount: number;
    customerInfo: CustomerInfo;
    appliedPromotions: IPromotion[];
    onPaymentComplete: () => void;
}

export default function DialogPayment({
    isOpen,
    onClose,
    selectedPaymentMethod,
    onPaymentMethodChange,
    paymentMethods,
    total,
    subtotal,
    discountAmount,
    customerInfo,
    appliedPromotions,
    onPaymentComplete,
}: DialogPaymentProps) {
    const selectedCustomerId = useSelector(selectSelectedCustomerId)
    const cart = useSelector(selectCartItems)
    const [configPoints, setConfigPoints] = useState<ConfigCustomerPoints | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    // Get current user from localStorage
    const getCurrentUser = () => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('currentUser')
            if (userStr) {
                try {
                    return JSON.parse(userStr)
                } catch {
                    return null
                }
            }
        }
        return null
    }

    // Load config customer points
    useEffect(() => {
        const loadConfig = async () => {
            try {
                const configs = await getConfigCustomerPoints()
                const activeConfig = configs.find(c => c.isActive) || configs[0]
                if (activeConfig) {
                    setConfigPoints(activeConfig)
                }
            } catch (error) {
                console.error("Error loading config customer points:", error)
            }
        }
        if (isOpen) {
            loadConfig()
        }
    }, [isOpen])

    // Handle payment complete - create order, payment, then add points
    const handlePaymentComplete = async () => {
        if (!selectedPaymentMethod) return

        setIsProcessing(true)
        try {
            const currentUser = getCurrentUser()
            console.log("Current user from localStorage:", currentUser)

            // Try multiple possible user ID fields
            const userId = currentUser?.userId || currentUser?.user_id || currentUser?.id || null

            // Validate required fields
            if (!userId || userId === 0) {
                console.error("Invalid userId:", userId)
                toast.error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!")
                setIsProcessing(false)
                return
            }

            console.log("Using userId:", userId)

            if (cart.length === 0) {
                toast.error("Giỏ hàng trống!")
                return
            }

            // 1. Create Order
            // Use null instead of 0 for promoId to avoid foreign key constraint violation
            const promoId = appliedPromotions.length > 0 ? appliedPromotions[0].promo_id : null
            const promoCode = appliedPromotions.length > 0 ? appliedPromotions[0].promo_code || null : null

            // Validate order items
            const orderItems = cart.map((item) => {
                if (!item.product.productId) {
                    throw new Error(`Sản phẩm ${item.product.productName} không có ID hợp lệ`)
                }
                if (item.quantity <= 0) {
                    throw new Error(`Số lượng sản phẩm ${item.product.productName} phải lớn hơn 0`)
                }
                if (item.product.price <= 0) {
                    throw new Error(`Giá sản phẩm ${item.product.productName} phải lớn hơn 0`)
                }
                return {
                    productId: item.product.productId,
                    quantity: item.quantity,
                    price: item.product.price,
                }
            })

            if (orderItems.length === 0) {
                toast.error("Không có sản phẩm hợp lệ trong giỏ hàng!")
                return
            }

            const orderData: CreateOrderDto = {
                customerId: selectedCustomerId || 0, // 0 means no customer (guest)
                userId: userId,
                promoId: promoId, // null if no promotion (to avoid FK constraint violation)
                promoCode: promoCode, // null if no promotion
                status: 'paid',
                orderItems: orderItems,
            }

            console.log("=== Order Data to Send ===")
            console.log("Full order data:", JSON.stringify(orderData, null, 2))
            console.log("Order items count:", orderItems.length)
            console.log("Customer ID:", orderData.customerId)
            console.log("User ID:", orderData.userId)
            console.log("Promo ID:", orderData.promoId)
            console.log("Promo Code:", orderData.promoCode)
            console.log("Status:", orderData.status)

            const createdOrder = await createOrder(orderData)
            console.log("Order created successfully:", createdOrder)
            toast.success("Tạo đơn hàng thành công!")

            // 2. Create Payment
            const paymentData: Omit<IPayment, "paymentId"> = {
                orderId: createdOrder.orderId,
                amount: total,
                paymentMethod: selectedPaymentMethod,
                paymentDate: new Date().toISOString(),
            }

            const createdPayment = await createPayment(paymentData)
            toast.success("Thanh toán thành công!")

            // 3. Update inventory quantities (subtract sold quantities)
            try {
                console.log("=== Updating Inventory ===")
                // Get all inventories to find inventoryId by productId
                const allInventories = await getAllInventory()

                // Update inventory for each item in cart
                for (const cartItem of cart) {
                    if (!cartItem.product.productId) continue

                    // Find inventory by productId
                    const inventory = allInventories.find(
                        (inv: IInventory) => inv.productId === cartItem.product.productId
                    )

                    if (inventory) {
                        const newQuantity = inventory.quantity - cartItem.quantity

                        if (newQuantity < 0) {
                            console.warn(`Warning: Insufficient inventory for product ${cartItem.product.productName}. Current: ${inventory.quantity}, Requested: ${cartItem.quantity}`)
                            toast.warning(`Cảnh báo: Tồn kho không đủ cho sản phẩm ${cartItem.product.productName}`)
                        }

                        console.log(`Updating inventory ${inventory.inventoryId}: ${inventory.quantity} -> ${newQuantity} (sold ${cartItem.quantity})`)

                        await updateInventoryQuantity(
                            inventory.inventoryId,
                            Math.max(0, newQuantity), // Ensure quantity is not negative
                            inventory.productId
                        )
                    } else {
                        console.warn(`Inventory not found for product ${cartItem.product.productName} (ID: ${cartItem.product.productId})`)
                    }
                }
                console.log("Inventory updated successfully")
            } catch (error: any) {
                console.error("Error updating inventory:", error)
                const errorMessage = error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    error?.message ||
                    "Không thể cập nhật tồn kho"
                toast.error(`Lỗi cập nhật tồn kho: ${errorMessage}`)
                // Don't throw error - payment is already successful
            }

            // 4. Add points to customer if customer is selected and config is active
            if (selectedCustomerId && configPoints?.isActive && total > 0) {
                try {
                    // Calculate points based on total amount and config
                    // Formula: (total / moneyPerUnit) * pointsPerUnit
                    // Example: 128000 / 10000 * 1 = 12.8 -> 12 points
                    const pointsToAdd = Math.floor((total / configPoints.moneyPerUnit) * configPoints.pointsPerUnit)

                    console.log("=== Adding Points to Customer ===")
                    console.log("Customer ID:", selectedCustomerId)
                    console.log("Total amount:", total)
                    console.log("Config - moneyPerUnit:", configPoints.moneyPerUnit)
                    console.log("Config - pointsPerUnit:", configPoints.pointsPerUnit)
                    console.log("Calculated points:", pointsToAdd)

                    if (pointsToAdd > 0) {
                        await addPointsToCustomer(selectedCustomerId, { points: pointsToAdd })
                        console.log(`Successfully added ${pointsToAdd} points to customer ${selectedCustomerId}`)
                        toast.success(`Đã tích ${pointsToAdd} điểm cho khách hàng!`)
                    } else {
                        console.log("Points to add is 0, skipping...")
                    }
                } catch (error: any) {
                    console.error("Error adding points to customer:", error)
                    const errorMessage = error?.response?.data?.message ||
                        error?.response?.data?.error ||
                        error?.message ||
                        "Không thể tích điểm cho khách hàng"
                    toast.error(errorMessage)
                }
            } else {
                console.log("=== Skipping Points Addition ===")
                console.log("Selected Customer ID:", selectedCustomerId)
                console.log("Config Active:", configPoints?.isActive)
                console.log("Total:", total)
            }

            // 5. Show success message
            toast.success("Thanh toán thành công!")

            // 6. Generate and open invoice in new tab
            try {
                // Get full order details from API
                const fullOrder = await getOrderById(createdOrder.orderId)
                const invoiceHtml = buildInvoiceHtml(fullOrder)

                // Open invoice in new tab/window
                const invoiceWindow = window.open("", "_blank", "width=900,height=700")
                if (invoiceWindow) {
                    invoiceWindow.document.write(invoiceHtml)
                    invoiceWindow.document.close()
                    invoiceWindow.focus()
                    // Auto print after a short delay
                    setTimeout(() => {
                        invoiceWindow.print()
                    }, 500)
                } else {
                    toast.warning("Không thể mở cửa sổ in hóa đơn. Vui lòng cho phép popup.")
                }
            } catch (error) {
                console.error("Error generating invoice:", error)
                toast.error("Không thể tạo hóa đơn")
            }

            // 7. Close all dialogs and reset state
            onClose() // Close payment dialog
            onPaymentComplete() // Clear cart and reset payment state
        } catch (error: any) {
            console.error("Error processing payment:", error)
            const errorMessage = error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Thanh toán thất bại. Vui lòng thử lại!"
            console.error("Error details:", {
                status: error?.response?.status,
                data: error?.response?.data,
                message: errorMessage
            })
            toast.error(errorMessage)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold flex items-center gap-3">
                        <div className="p-2.5 bg-green-100 rounded-xl">
                            <Receipt className="h-5 w-5 text-green-700" />
                        </div>
                        Thanh toán
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className=" p-6 rounded-xl border border-green-200 shadow-sm">
                        <p className="text-sm font-medium text-gray-600 mb-2">Tổng thanh toán</p>
                        <p className="text-3xl font-bold text-green-700">{total.toLocaleString("vi-VN")}đ</p>
                    </div>

                    <PaymentMethod
                        paymentMethod={selectedPaymentMethod}
                        onPaymentMethodChange={onPaymentMethodChange}
                        paymentMethods={paymentMethods}
                        amount={total}
                        orderId={`TXN${Date.now()}`}
                        onPayment={onPaymentComplete}
                        customerInfo={customerInfo}
                    />

                    {selectedCustomerId && configPoints?.isActive && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <span className="font-semibold">Tích điểm:</span> Khách hàng sẽ nhận được{' '}
                                <span className="font-bold text-blue-900">
                                    {Math.floor((total / configPoints.moneyPerUnit) * configPoints.pointsPerUnit)}
                                </span>{' '}
                                điểm khi thanh toán thành công
                            </p>
                        </div>
                    )}

                    <div className="flex gap-4 pt-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isProcessing}
                            className="flex-1 h-12 border-2 font-semibold hover:bg-gray-50"
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handlePaymentComplete}
                            disabled={!selectedPaymentMethod || isProcessing}
                            className="flex-1 h-12 bg-green-700 hover:bg-green-800 font-bold shadow-lg"
                        >
                            <Receipt className="mr-2 h-5 w-5" />
                            {isProcessing ? 'Đang xử lý...' : 'Hoàn tất thanh toán'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
