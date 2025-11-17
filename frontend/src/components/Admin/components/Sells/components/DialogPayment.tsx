import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Receipt } from 'lucide-react';
import PaymentMethod from './SelectedPayment/PaymentMethod';
import { PaymentMethod as PaymentMethodType } from '@/types/paymentType';
import { CustomerInfo } from './CustomerForm';

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

                    <div className="flex gap-4 pt-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 h-12 border-2 font-semibold hover:bg-gray-50"
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={onPaymentComplete}
                            disabled={!selectedPaymentMethod}
                            className="flex-1 h-12 bg-green-700 hover:bg-green-800 font-bold shadow-lg"
                        >
                            <Receipt className="mr-2 h-5 w-5" />
                            Hoàn tất thanh toán
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
