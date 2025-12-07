import React, { useState, useEffect, useRef } from 'react';
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
import { X, Smartphone, Clock, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getOrderPayments } from '@/apis/orderApi';

interface QRPaymentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    paymentMethod: PaymentMethodType;
    amount: number;
    orderId: string | number;
    onPaymentComplete?: () => void;
    customerInfo?: {
        fullName: string;
        phone: string;
        email: string;
    };
}

type PaymentStatus = 'pending' | 'checking' | 'completed' | 'failed';

export default function QRPaymentDialog({
    isOpen,
    onClose,
    paymentMethod,
    amount,
    orderId,
    onPaymentComplete,
    customerInfo,
}: QRPaymentDialogProps) {
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
    const [checkingCount, setCheckingCount] = useState(0);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const maxChecks = 60; // Tối đa 60 lần check (5 phút nếu mỗi 5 giây)

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
            console.error('Error generating QR code:', error);
            return `https://example.com/payment/${method.type}?amount=${amount}&purpose=Thanh%20to%C3%A1n%20${encodeURIComponent(method.label)}%20%23${orderId}`;
        }
    };

    const qrValue = generateQRCode(paymentMethod);

    /**
     * Kiểm tra trạng thái thanh toán từ API
     * Sử dụng getOrderPayments để kiểm tra xem order đã có payment chưa
     * Trả về payment info nếu tìm thấy, null nếu chưa có
     */
    const checkPaymentStatus = async (): Promise<{ found: boolean; payment?: any; orderId?: number }> => {
        try {
            // Convert orderId to number if it's a string
            const orderIdNum = typeof orderId === 'string' ? parseInt(orderId, 10) : orderId;

            if (isNaN(orderIdNum)) {
                console.error('Invalid orderId:', orderId);
                return { found: false };
            }

            // Gọi API để lấy danh sách payments của order
            const payments = await getOrderPayments(orderIdNum);

            console.log(`[QR Payment] Checking payment status for order ${orderIdNum}:`, payments);

            // Kiểm tra xem có payment nào với amount khớp và paymentMethod khớp không
            if (payments && Array.isArray(payments) && payments.length > 0) {
                // Tìm payment khớp với amount và paymentMethod
                const matchingPayment = payments.find((payment: any) => {
                    const amountMatch = Math.abs(payment.amount - amount) < 0.01; // Cho phép sai số nhỏ
                    const methodMatch = payment.paymentMethod?.toLowerCase().includes(paymentMethod.type.toLowerCase()) ||
                        payment.paymentMethod?.toLowerCase().includes(paymentMethod.label.toLowerCase());
                    return amountMatch && methodMatch;
                });

                if (matchingPayment) {
                    console.log('[QR Payment] Payment found:', matchingPayment);
                    return { found: true, payment: matchingPayment, orderId: orderIdNum };
                }
            }

            return { found: false };
        } catch (error: any) {
            console.error('[QR Payment] Error checking payment status:', error);
            // Không throw error để polling tiếp tục
            return { found: false };
        }
    };

    // Start polling for payment status
    useEffect(() => {
        if (isOpen && paymentStatus === 'pending') {
            // Delay 2 seconds before starting to check (give user time to scan)
            const startDelay = setTimeout(() => {
                setPaymentStatus('checking');
                setCheckingCount(0);

                pollingIntervalRef.current = setInterval(async () => {
                    setCheckingCount((prev) => {
                        const newCount = prev + 1;

                        // Stop polling after max checks
                        if (newCount >= maxChecks) {
                            if (pollingIntervalRef.current) {
                                clearInterval(pollingIntervalRef.current);
                            }
                            setPaymentStatus('failed');
                            toast.error('Hết thời gian chờ thanh toán. Vui lòng thử lại.');
                            return newCount;
                        }

                        // Check payment status
                        checkPaymentStatus().then((result) => {
                            if (result.found) {
                                if (pollingIntervalRef.current) {
                                    clearInterval(pollingIntervalRef.current);
                                    pollingIntervalRef.current = null;
                                }
                                setPaymentStatus('completed');
                                toast.success('Thanh toán thành công! Đã phát hiện giao dịch thanh toán.');

                                // Gọi callback để xử lý thanh toán thành công
                                // onPaymentComplete sẽ xử lý: tạo order (nếu chưa có), update inventory, add points, etc.
                                if (onPaymentComplete) {
                                    console.log('[QR Payment] ✅ Payment detected successfully!');
                                    console.log('[QR Payment] Payment info:', result.payment);
                                    console.log('[QR Payment] Order ID:', result.orderId);
                                    console.log('[QR Payment] Calling onPaymentComplete callback to process order...');

                                    // Gọi callback để xử lý: tạo order, update inventory, add points, etc.
                                    // Note: Payment đã được tạo rồi, nhưng vẫn cần xử lý order và inventory
                                    onPaymentComplete();
                                }

                                // Đóng dialog sau 2 giây để người dùng thấy thông báo thành công
                                setTimeout(() => {
                                    onClose();
                                }, 2000);
                            }
                        }).catch((error) => {
                            console.error('[QR Payment] Error in payment check:', error);
                        });

                        return newCount;
                    });
                }, 5000); // Check every 5 seconds
            }, 2000); // Start checking after 2 seconds

            return () => {
                clearTimeout(startDelay);
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                    pollingIntervalRef.current = null;
                }
            };
        }

        // Cleanup on unmount or close
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
        };
    }, [isOpen, paymentStatus, orderId, amount, paymentMethod, onPaymentComplete, onClose]);

    // Reset state when dialog opens
    useEffect(() => {
        if (isOpen) {
            setPaymentStatus('pending');
            setCheckingCount(0);
        } else {
            // Cleanup when dialog closes
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
        }
    }, [isOpen]);

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const getStatusMessage = () => {
        switch (paymentStatus) {
            case 'checking':
                return {
                    text: 'Đang kiểm tra thanh toán...',
                    icon: <Loader2 className="h-4 w-4 animate-spin text-blue-600" />,
                    color: 'text-blue-600',
                };
            case 'completed':
                return {
                    text: 'Thanh toán thành công!',
                    icon: <CheckCircle className="h-4 w-4 text-green-600" />,
                    color: 'text-green-600',
                };
            case 'failed':
                return {
                    text: 'Thanh toán thất bại hoặc hết thời gian',
                    icon: <AlertCircle className="h-4 w-4 text-red-600" />,
                    color: 'text-red-600',
                };
            default:
                return {
                    text: 'Chờ quét mã QR',
                    icon: <Clock className="h-4 w-4 text-gray-600" />,
                    color: 'text-gray-600',
                };
        }
    };

    const statusMessage = getStatusMessage();

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
                            disabled={paymentStatus === 'checking'}
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

                    {/* Payment Status */}
                    {paymentStatus !== 'pending' && (
                        <div className={`flex items-center justify-center gap-2 p-3 rounded-lg border ${paymentStatus === 'completed' ? 'bg-green-50 border-green-200' :
                            paymentStatus === 'failed' ? 'bg-red-50 border-red-200' :
                                'bg-blue-50 border-blue-200'
                            }`}>
                            {statusMessage.icon}
                            <span className={`text-sm font-medium ${statusMessage.color}`}>
                                {statusMessage.text}
                            </span>
                        </div>
                    )}

                    {/* QR Code */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className={`bg-white p-6 rounded-lg border-2 shadow-sm transition-all ${paymentStatus === 'completed' ? 'border-green-500 ring-2 ring-green-200' :
                            paymentStatus === 'failed' ? 'border-red-300 opacity-50' :
                                'border-gray-200'
                            }`}>
                            {qrValue ? (
                                <QRCode
                                    value={qrValue}
                                    size={200}
                                    bgColor="#ffffff"
                                    fgColor={paymentStatus === 'failed' ? "#cccccc" : "#000000"}
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
                            {paymentStatus === 'checking' && (
                                <div className="space-y-1">
                                    <p className="text-xs text-blue-600 font-medium">
                                        Đang kiểm tra thanh toán... ({checkingCount}/{maxChecks})
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Vui lòng quét mã và xác nhận thanh toán trong ứng dụng
                                    </p>
                                </div>
                            )}
                            {paymentStatus === 'completed' && (
                                <p className="text-xs text-green-600 font-medium">
                                    ✓ Đã phát hiện giao dịch thanh toán thành công
                                </p>
                            )}
                            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                                <div className="flex items-center space-x-1">
                                    <Smartphone className="h-3 w-3" />
                                    <span>Mở app</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3" />
                                    <span>5 phút</span>
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
                            <div className="flex items-start space-x-2">
                                <span className="font-medium text-gray-900">5.</span>
                                <span className="font-semibold text-green-700">Hệ thống sẽ tự động phát hiện và xác nhận khi thanh toán thành công</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={paymentStatus === 'checking' || paymentStatus === 'completed'}
                        >
                            {paymentStatus === 'checking' ? 'Đang kiểm tra...' :
                                paymentStatus === 'completed' ? 'Đã hoàn tất' : 'Hủy'}
                        </Button>
                        <Button
                            onClick={() => {
                                // Khi người dùng click "Hoàn tất" sau khi thanh toán thành công
                                if (paymentStatus === 'completed' && onPaymentComplete) {
                                    console.log('[QR Payment] User clicked complete button, calling onPaymentComplete');
                                    onPaymentComplete();
                                }
                                onClose();
                            }}
                            className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={paymentStatus !== 'completed'}
                        >
                            {paymentStatus === 'completed' ? 'Hoàn tất' :
                                paymentStatus === 'checking' ? 'Đang kiểm tra...' :
                                    'Chờ thanh toán'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
