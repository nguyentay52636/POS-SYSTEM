import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from 'lucide-react';
import CustomerForm, { CustomerInfo } from './CustomerForm';

interface DialogCustomerProps {
    isOpen: boolean;
    onClose: () => void;
    customerInfo: CustomerInfo;
    onCustomerInfoChange: (field: keyof CustomerInfo, value: string) => void;
    onNext: () => void;
    total: number;
}

export default function DialogCustomer({
    isOpen,
    onClose,
    customerInfo,
    onCustomerInfoChange,
    onNext,
    total,
}: DialogCustomerProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold flex items-center gap-3">
                        <div className="p-2.5 bg-green-100 rounded-xl">
                            <User className="h-5 w-5 text-green-700" />
                        </div>
                        Thông tin khách hàng
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 shadow-sm">
                        <p className="text-sm font-medium text-gray-600 mb-2">Tổng thanh toán</p>
                        <p className="text-3xl font-bold text-green-700">{total.toLocaleString("vi-VN")}đ</p>
                    </div>

                    <CustomerForm
                        customerInfo={customerInfo}
                        onCustomerInfoChange={onCustomerInfoChange}
                        onNext={onNext}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
