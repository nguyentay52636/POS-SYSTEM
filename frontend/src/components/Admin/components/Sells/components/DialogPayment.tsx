import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Receipt } from 'lucide-react';
import PaymentMethod from './SelectedPayment/PaymentMethod';
import { PaymentMethod as PaymentMethodType } from '@/types/paymentType';
import { CustomerInfo } from './CustomerForm';
import { useSelector } from 'react-redux';
import { selectSelectedCustomerId } from '@/redux/Slice/cartSlice';
import { getConfigCustomerPoints, ConfigCustomerPoints } from '@/apis/configCustomerPoints';
import { addPointsToCustomer } from '@/apis/customerApi';
import { toast } from 'sonner';

interface DialogPaymentProps {
    isOpen: boolean;
    onClose: () => void;
    selectedPaymentMethod: string;
    onPaymentMethodChange: (method: string) => void;
    paymentMethods: PaymentMethodType[];
    total: number;
    customerInfo: CustomerInfo;
    onPaymentComplete: () => void;
}

export default function DialogPayment({
    isOpen,
    onClose,
    selectedPaymentMethod,
    onPaymentMethodChange,
    paymentMethods,
    total,
    customerInfo,
    onPaymentComplete,
}: DialogPaymentProps) {
    const selectedCustomerId = useSelector(selectSelectedCustomerId)
    const [configPoints, setConfigPoints] = useState<ConfigCustomerPoints | null>(null)
    const [isAddingPoints, setIsAddingPoints] = useState(false)

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

    // Handle payment complete with points calculation
    const handlePaymentComplete = async () => {
        // Add points to customer if customer is selected and config is active
        if (selectedCustomerId && configPoints?.isActive && total > 0) {
            try {
                setIsAddingPoints(true)
                const pointsToAdd = Math.floor((total / configPoints.moneyPerUnit) * configPoints.pointsPerUnit)
                if (pointsToAdd > 0) {
                    await addPointsToCustomer(selectedCustomerId, { points: pointsToAdd })
                    toast.success(`Đã tích ${pointsToAdd} điểm cho khách hàng!`)
                }
            } catch (error) {
                console.error("Error adding points to customer:", error)
                toast.error("Không thể tích điểm cho khách hàng")
            } finally {
                setIsAddingPoints(false)
            }
        }
        // Call original payment complete handler
        onPaymentComplete()
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
                            disabled={isAddingPoints}
                            className="flex-1 h-12 border-2 font-semibold hover:bg-gray-50"
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handlePaymentComplete}
                            disabled={!selectedPaymentMethod || isAddingPoints}
                            className="flex-1 h-12 bg-green-700 hover:bg-green-800 font-bold shadow-lg"
                        >
                            <Receipt className="mr-2 h-5 w-5" />
                            {isAddingPoints ? 'Đang tích điểm...' : 'Hoàn tất thanh toán'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
