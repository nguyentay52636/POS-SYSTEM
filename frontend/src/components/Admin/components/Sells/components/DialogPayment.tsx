import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Receipt } from 'lucide-react';
import PaymentMethod from './SelectedPayment/PaymentMethod';
import { PaymentMethod as PaymentMethodType } from '@/types/paymentType';
import { CustomerInfo } from './CustomerForm';
import { useSelector } from 'react-redux';
import { selectSelectedCustomerId, selectCartItems, type CartItem } from '@/redux/Slice/cartSlice';
import { Promotion } from '@/apis/promotionsApi';
import { getConfigCustomerPoints, ConfigCustomerPoints } from '@/apis/configCustomerPoints';
import { getCustomerById, UpdatePointsToCustomer, getCustomers, createCustomer } from '@/apis/customerApi';
import { createOrder, getOrderById, type Order, type OrderItem, type CreateOrderDto } from '@/apis/orderApi';
import { create as createPayment, type IPayment, type CreatePaymentDto } from '@/apis/paymentApi';
import { buildInvoiceHtml } from '@/lib/Invoice';
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
    appliedPromotions: Promotion[];
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
                let activeConfig: ConfigCustomerPoints | null = null

                if (Array.isArray(configs)) {
                    activeConfig = configs.find(c => c.isActive) || configs[0]
                } else if (configs) {
                    const configObj = configs as unknown as ConfigCustomerPoints
                    activeConfig = configObj.isActive ? configObj : null
                }
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

    // Check if current customer is a guest/walk-in (Khách vãng lai)
    const isGuestCustomer = !selectedCustomerId ||
        (customerInfo?.fullName && ['khách vãng lai', 'khách lẻ'].includes(customerInfo.fullName.toLowerCase().trim()));

    const isProcessingRef = React.useRef(false);

    // Handle payment complete - create order, payment, then add points
    const handlePaymentComplete = async () => {
        if (!selectedPaymentMethod) return
        if (isProcessingRef.current) return;

        isProcessingRef.current = true;
        setIsProcessing(true)
        try {
            const currentUser = getCurrentUser()
            console.log("Current user from localStorage:", currentUser)

            // Try multiple possible user ID fields
            const userId = currentUser?.userId || null

            // 0. Fetch Initial Points (Before any transaction)
            let initialPoints = 0;
            if (selectedCustomerId && !isGuestCustomer) {
                try {
                    const customer = await getCustomerById(selectedCustomerId);
                    initialPoints = customer.customerPoint || 0;
                    console.log(`[Points Logic] Initial Points fetched: ${initialPoints}`);
                } catch (err) {
                    console.error("Failed to fetch initial points", err);
                }
            }

            // Validate required fields
            if (!userId || userId === 0) {
                toast.error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!")
                setIsProcessing(false)
                isProcessingRef.current = false;
                return
            }

            console.log("Using userId:", userId)
            console.log("Current Cart:", cart);

            if (cart.length === 0) {
                toast.error("Giỏ hàng trống!")
                setIsProcessing(false)
                isProcessingRef.current = false;
                return
            }


            const promoId = appliedPromotions.length > 0 ? (appliedPromotions[0].promoId ?? null) : null
            const promoCode = appliedPromotions.length > 0 ? appliedPromotions[0].promoCode || null : null
            console.log("Applying Promotion to Order:", { promoId, promoCode, fullPromo: appliedPromotions[0] });

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

            console.log("Sending OrderItems to API:", orderItems);

            if (orderItems.length === 0) {
                toast.error("Không có sản phẩm hợp lệ trong giỏ hàng!")
                setIsProcessing(false)
                isProcessingRef.current = false;
                return
            }

            // Determine final customer ID - force null if guest
            const finalCustomerId = isGuestCustomer ? null : selectedCustomerId;

            if (!finalCustomerId) {
                console.log("Creating guest order (no customer ID linked)");
            }
            // ---------------------------

            const orderData: CreateOrderDto = {
                customerId: finalCustomerId,
                userId: userId,
                promoId: promoId,
                promoCode: promoCode,
                status: 'paid',
                orderItems: orderItems,
            }



            const createdOrder = await createOrder(orderData)
            console.log("Order created successfully:", createdOrder)
            toast.success("Tạo đơn hàng thành công!")

            // 1.1 Check points logic - SKIPPED FOR GUEST
            // Logic moved to step 4 (after inventory update) to match original flow

            // 2. Create Payment
            const paymentData: CreatePaymentDto = {
                orderId: createdOrder.orderId,
                amount: total,
                paymentMethod: selectedPaymentMethod,
                paymentDate: new Date().toISOString(),
            }

            let createdPayment;
            try {
                createdPayment = await createPayment(paymentData)
                toast.success("Thanh toán thành công!")
            } catch (error: any) {
                const errorMsg = error?.response?.data?.message || error?.message || "";
                if (errorMsg.includes("exceeds remaining order amount")) {
                    console.warn("Payment amount adjustment warning:", errorMsg);
                    // Treat as success or ignore, allowing flow to continue
                } else {
                    throw error; // Rethrow other errors
                }
            }

            // 3. Update inventory quantities (subtract sold quantities)
            try {
                // console.log("=== Updating Inventory ===")
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
                            // console.warn(`Warning: Insufficient inventory for product ${cartItem.product.productName}. Current: ${inventory.quantity}, Requested: ${cartItem.quantity}`)
                            toast.warning(`Cảnh báo: Tồn kho không đủ cho sản phẩm ${cartItem.product.productName}`)
                        }

                        console.log(`Updating inventory ${inventory.inventoryId}: ${inventory.quantity} -> ${newQuantity} (sold ${cartItem.quantity})`)

                        await updateInventoryQuantity(
                            inventory.inventoryId,
                            Math.max(0, newQuantity), // Ensure quantity is not negative
                            inventory.productId
                        )
                    } else {
                        // console.warn(`Inventory not found for product ${cartItem.product.productName} (ID: ${cartItem.product.productId})`)
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
            }


            // console.log("=== Kiểm tra điều kiện tích điểm ===")
            console.log("total:", total)

            // ONLY ADD POINTS IF NOT GUEST
            if (finalCustomerId && !isGuestCustomer && total > 0) {
                try {
                    // Load config mới nhất từ API trước khi tính điểm
                    const configsData = await getConfigCustomerPoints()

                    // API có thể trả về object hoặc array
                    let activeConfig: ConfigCustomerPoints | null = null
                    if (Array.isArray(configsData)) {
                        // Nếu là array, tìm config active
                        activeConfig = configsData.find(c => c.isActive) || configsData[0] || null
                    } else {
                        // Nếu là object (trường hợp API trả về single object)
                        const configObj = configsData as unknown as ConfigCustomerPoints
                        activeConfig = configObj?.isActive ? configObj : null
                    }
                    console.log("📥 Active config:", activeConfig)

                    if (!activeConfig || !activeConfig.isActive) {
                    } else if (activeConfig.moneyPerUnit <= 0) {
                    } else {
                        const pointsFromOrder = Math.floor((total / activeConfig.moneyPerUnit) * activeConfig.pointsPerUnit)

                        if (pointsFromOrder > 0) {
                            // 2. Tính tổng điểm mới = Điểm cũ (lấy từ trước khi tạo đơn) + Điểm mới từ đơn hàng
                            const finalPoints = initialPoints + pointsFromOrder;

                            console.log(`[Points Logic] Initial (Pre-Order): ${initialPoints}, From Order: ${pointsFromOrder} (Total: ${total} / ${activeConfig.moneyPerUnit} * ${activeConfig.pointsPerUnit})`);
                            console.log(`[Points Logic] Updating Customer ${finalCustomerId} to NEW Total: ${finalPoints}`);

                            // 3. Gọi API cập nhật điểm
                            const result = await UpdatePointsToCustomer(finalCustomerId!, { points: finalPoints }) // finalCustomerId is checked above

                            toast.success(`Đã tích ${pointsFromOrder} điểm cho khách hàng! (Tổng: ${finalPoints})`)
                        } else {
                            // console.log("⚠️ Điểm tính được = 0, bỏ qua...")
                        }
                    }
                } catch (error: any) {
                    console.error("❌ Lỗi khi cộng điểm cho khách hàng:", error)
                    const errorMessage = error?.response?.data?.message ||
                        error?.response?.data?.error ||
                        error?.message ||
                        "Không thể tích điểm cho khách hàng"
                    toast.error(`Lỗi tích điểm: ${errorMessage}`)
                    // Không throw error - thanh toán đã thành công, chỉ log lỗi
                }
            } else {
            }



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
            isProcessingRef.current = false;
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
                        onPayment={handlePaymentComplete}
                        customerInfo={customerInfo}
                    />

                    {!isGuestCustomer && selectedCustomerId && configPoints?.isActive && (
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
