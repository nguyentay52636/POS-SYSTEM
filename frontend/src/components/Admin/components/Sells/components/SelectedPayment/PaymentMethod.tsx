import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { CreditCard, Wallet, Globe, ChevronDown } from 'lucide-react';
import { PaymentMethod as PaymentMethodType } from '@/types/paymentType';
import QRPaymentDialog from './QRPaymentDialog';

interface PaymentMethodProps {
    paymentMethod: string;
    onPaymentMethodChange: (method: string) => void;
    paymentMethods: PaymentMethodType[];
    amount?: number;
    orderId?: string;
    onPayment?: () => void;
    customerInfo?: {
        fullName: string;
        phone: string;
        email: string;
    };
}


export default function PaymentMethod({
    paymentMethod,
    onPaymentMethodChange,
    paymentMethods,
    amount = 100000,
    orderId = '123',
    onPayment,
    customerInfo,
}: PaymentMethodProps) {
    const [showQRDialog, setShowQRDialog] = useState(false);

    const offlineMethods = paymentMethods.filter((method) => method.category === 'offline');
    const onlineMethods = paymentMethods.filter((method) => method.category === 'online');
    const selectedMethod = paymentMethods.find(
        (method) => method.type === paymentMethod,
    ) as PaymentMethodType | undefined;

    const getPaymentIcon = (method: PaymentMethodType) => {
        if (method.logoUrl) {
            return <img src={method.logoUrl} alt={`${method.label} logo`} className="h-5 w-5 object-contain" />;
        }

        switch (method.type) {
            case 'momo':
                return <img src="/images/payment/momo.png" alt="Momo" className="h-full w-full object-cover p-0.5 rounded-full" />;
            case 'zalopay':
                return <img src="/images/payment/zalopay.jpeg" alt="ZaloPay" className="h-full w-full object-cover p-0.5 rounded-full" />;
            case 'vnpay':
                return <img src="/images/payment/vnpay.png" alt="VNPay" className="h-full w-full object-cover p-0.5 rounded-full" />;
            case 'banking':
                return <img src="/images/payment/banking" alt="Banking" className="h-full w-full object-cover p-0.5 rounded-full" />;
            case 'cod':
                return <img src="/images/payment/cash.png" alt="Cash" className="h-full w-full object-cover p-0.5 rounded-full" />;
            case 'card':
                return <CreditCard className="h-5 w-5 text-blue-600" />;
            default:
                return null;
        }
    };

    const getPaymentIconBg = (method: PaymentMethodType) => {
        switch (method.type) {
            case 'card':
                return 'bg-blue-100';
            case 'momo':
            case 'vnpay':
            case 'banking':
            case 'cod':
            case 'zalopay':
                return 'bg-transparent';
            default:
                return 'bg-gray-100';
        }
    };

    const getPaymentIconText = (method: PaymentMethodType) => {
        switch (method.type) {
            case 'momo':
                return 'M';
            case 'zalopay':
                return 'Z';
            case 'vnpay':
                return '₫';
            case 'banking':
                return 'B';
            default:
                return '';
        }
    };


    const handlePayment = () => {
        if (selectedMethod?.category === 'online') {
            setShowQRDialog(true);
        } else {
            console.log('Xử lý thanh toán offline:', selectedMethod?.label);
            // Call parent payment handler for offline payments
            if (onPayment) {
                onPayment();
            }
        }
    };

    // Auto show QR dialog when online payment method is selected
    React.useEffect(() => {
        if (selectedMethod?.category === 'online') {
            setShowQRDialog(true);
        }
    }, [selectedMethod]);

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-gray-900">
                    <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                    Phương thức thanh toán
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Label htmlFor="payment-method" className="font-medium text-gray-900">
                        Chọn phương thức thanh toán
                    </Label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full h-12 justify-between text-gray-900 border-2 hover:border-green-300 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                            >
                                <div className="flex items-center space-x-3">
                                    {selectedMethod ? (
                                        <>
                                            <div
                                                className={`w-8 h-8 ${getPaymentIconBg(selectedMethod)} rounded-full flex items-center justify-center`}
                                            >
                                                {getPaymentIcon(selectedMethod) || (
                                                    <span className="text-white text-sm font-bold">
                                                        {getPaymentIconText(selectedMethod)}
                                                    </span>
                                                )}
                                            </div>
                                            <span>{selectedMethod.label}</span>
                                        </>
                                    ) : (
                                        <span>Chọn phương thức</span>
                                    )}
                                </div>
                                <ChevronDown className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] p-2">
                            {offlineMethods.length > 0 && (
                                <>
                                    <DropdownMenuLabel className="flex items-center text-gray-900">
                                        <Wallet className="h-4 w-4 mr-2 text-green-600" />
                                        Thanh toán khi nhận hàng
                                    </DropdownMenuLabel>
                                    {offlineMethods.map((method) => (
                                        <DropdownMenuItem
                                            key={method.type}
                                            onSelect={() => onPaymentMethodChange(method.type)}
                                            className={`flex items-center space-x-3 p-3 ${paymentMethod === method.type ? 'bg-green-50' : ''
                                                }`}
                                        >
                                            <div
                                                className={`w-8 h-8 ${getPaymentIconBg(method)} rounded-full flex items-center justify-center`}
                                            >
                                                {getPaymentIcon(method) || (
                                                    <span className="text-white text-sm font-bold">
                                                        {getPaymentIconText(method)}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{method.label}</div>
                                                <p className="text-sm text-gray-600">{method.description}</p>
                                            </div>
                                        </DropdownMenuItem>
                                    ))}
                                </>
                            )}
                            {offlineMethods.length > 0 && onlineMethods.length > 0 && <DropdownMenuSeparator />}
                            {onlineMethods.length > 0 && (
                                <>
                                    <DropdownMenuLabel className="flex items-center text-gray-900">
                                        <Globe className="h-4 w-4 mr-2 text-green-600" />
                                        Thanh toán trực tuyến
                                    </DropdownMenuLabel>
                                    {onlineMethods.map((method) => (
                                        <DropdownMenuItem
                                            key={method.type}
                                            onSelect={() => onPaymentMethodChange(method.type)}
                                            className={`flex items-center space-x-3 p-3 ${paymentMethod === method.type ? 'bg-green-50' : ''
                                                }`}
                                        >
                                            <div
                                                className={`w-8 h-8 ${getPaymentIconBg(method)} rounded-full flex items-center justify-center`}
                                            >
                                                {getPaymentIcon(method) || (
                                                    <span className="text-white text-sm font-bold">
                                                        {getPaymentIconText(method)}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{method.label}</div>
                                                <p className="text-sm text-gray-600">{method.description}</p>
                                            </div>
                                        </DropdownMenuItem>
                                    ))}
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>


                </div>
            </CardContent>

            {/* QR Payment Dialog */}
            {selectedMethod && (
                <QRPaymentDialog
                    isOpen={showQRDialog}
                    onClose={() => setShowQRDialog(false)}
                    paymentMethod={selectedMethod}
                    amount={amount}
                    orderId={orderId}
                    onPaymentComplete={onPayment}
                    customerInfo={customerInfo}
                />
            )}
        </Card>
    );
}