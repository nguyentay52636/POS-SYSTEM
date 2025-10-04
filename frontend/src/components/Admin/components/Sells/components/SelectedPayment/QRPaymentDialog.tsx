import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import QRCode from 'react-qr-code';
import { QRPay } from 'vietnam-qr-pay';
import { PaymentMethod as PaymentMethodType } from '@/types/paymentType';
import { X, Smartphone, Clock, CheckCircle } from 'lucide-react';

interface QRPaymentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    paymentMethod: PaymentMethodType;
    amount: number;
    orderId: string;
    onPaymentComplete?: () => void;
    customerInfo?: {
        fullName: string;
        phone: string;
        email: string;
    };
}

export default function QRPaymentDialog({
    isOpen,
    onClose,
    paymentMethod,
    amount,
    orderId,
    onPaymentComplete,
    customerInfo,
}: QRPaymentDialogProps) {
    const generateQRCode = (method: PaymentMethodType) => {
        try {
            if (method.type === 'vnpay' && method.vnpayInfo) {
                const qr = QRPay.initVNPayQR({
                    merchantId: method.vnpayInfo.merchantId,
                    merchantName: method.vnpayInfo.merchantName,
                    store: method.vnpayInfo.store,
                    terminal: method.vnpayInfo.terminal,
                    amount: amount.toString(),
                    purpose: `Thanh toán ${method.label} #${orderId}`,
                });
                return qr.build();
            } else if (method.accountInfo) {
                const qr = QRPay.initVietQR({
                    bankBin: method.accountInfo.bankId,
                    bankNumber: method.accountInfo.bankAccount,
                    amount: amount.toString(),
                    purpose: `Thanh toán ${method.label} #${orderId}`,
                });
                if (method.type === 'momo' && method.accountInfo.phoneNumber) {
                    qr.additionalData.reference = 'MOMOW2W' + method.accountInfo.bankAccount.slice(10);
                    qr.setUnreservedField('80', method.accountInfo.phoneNumber.slice(-3));
                }
                return qr.build();
            }
            return `https://example.com/payment/${method.type}?amount=${amount}&purpose=Thanh%20to%C3%A1n%20${encodeURIComponent(method.label)}%20%23${orderId}`;
        } catch (error) {
            return `https://example.com/payment/${method.type}?amount=${amount}&purpose=Thanh%20to%C3%A1n%20${encodeURIComponent(method.label)}%20%23${orderId}`;
        }
    };

    const qrValue = generateQRCode(paymentMethod);

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg font-semibold text-gray-900">
                            Thanh toán qua {paymentMethod.label}
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <DialogDescription className="text-gray-600">
                        Quét mã QR bằng ứng dụng {paymentMethod.label} để thanh toán
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Order Info */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 space-y-3 border border-green-200">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Mã đơn hàng:</span>
                            <span className="font-medium text-gray-900">#{orderId}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Số tiền:</span>
                            <span className="font-semibold text-green-700 text-lg">
                                {formatAmount(amount)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Phương thức:</span>
                            <span className="font-medium text-gray-900">{paymentMethod.label}</span>
                        </div>
                        {customerInfo && (
                            <>
                                <div className="border-t border-green-200 pt-3 mt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Khách hàng:</span>
                                        <span className="font-medium text-gray-900">{customerInfo.fullName}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-sm text-gray-600">SĐT:</span>
                                        <span className="font-medium text-gray-900">{customerInfo.phone}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-sm">
                            {qrValue ? (
                                <QRCode
                                    value={qrValue}
                                    size={200}
                                    bgColor="#ffffff"
                                    fgColor="#000000"
                                    level="M"
                                />
                            ) : (
                                <div className="w-[200px] h-[200px] bg-gray-100 rounded flex items-center justify-center">
                                    <p className="text-sm text-red-600 text-center">
                                        Không thể tạo mã QR
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="text-center space-y-2">
                            <p className="text-sm text-gray-600">
                                Quét mã QR bằng ứng dụng {paymentMethod.label}
                            </p>
                            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                                <div className="flex items-center space-x-1">
                                    <Smartphone className="h-3 w-3" />
                                    <span>Mở app</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3" />
                                    <span>15 phút</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Instructions */}
                    <div className="space-y-3">
                        <h4 className="font-medium text-gray-900 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Hướng dẫn thanh toán
                        </h4>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-start space-x-2">
                                <span className="font-medium text-gray-900">1.</span>
                                <span>Mở ứng dụng {paymentMethod.label} trên điện thoại</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <span className="font-medium text-gray-900">2.</span>
                                <span>Chọn chức năng quét mã QR</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <span className="font-medium text-gray-900">3.</span>
                                <span>Quét mã QR ở trên để thanh toán</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <span className="font-medium text-gray-900">4.</span>
                                <span>Xác nhận thanh toán trong ứng dụng</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Đóng
                        </Button>
                        <Button
                            onClick={() => {
                                // Handle payment completion
                                console.log('Payment completed');
                                if (onPaymentComplete) {
                                    onPaymentComplete();
                                }
                                onClose();
                            }}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                            Đã thanh toán
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
