import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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
        if (method.type === 'card') {
            return <CreditCard className="h-5 w-5 text-blue-600" />;
        }
        if (method.type === 'cod') {
            return <Wallet className="h-5 w-5 text-green-600" />;
        }
        return null;
    };

    const getPaymentIconBg = (method: PaymentMethodType) => {
        switch (method.type) {
            case 'card':
                return 'bg-blue-100';
            case 'momo':
                return 'bg-pink-500';
            case 'zalopay':
                return 'bg-blue-500';
            case 'vnpay':
                return 'bg-green-500';
            case 'banking':
                return 'bg-green-100';
            case 'cod':
                return 'bg-green-100';
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

                    {selectedMethod && (
                        <>
                            <Separator />
                            <div className="mt-4">
                                <h4 className="font-medium text-gray-900 mb-2">Chi tiết phương thức</h4>
                                <div className="flex items-center space-x-3 p-4 border-2 rounded-lg border-green-500 bg-green-50">
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{selectedMethod.label}</div>
                                        <p className="text-sm text-gray-600">{selectedMethod.description}</p>
                                    </div>
                                    <div
                                        className={`w-10 h-10 ${getPaymentIconBg(selectedMethod)} rounded-full flex items-center justify-center`}
                                    >
                                        {getPaymentIcon(selectedMethod) || (
                                            <span className="text-white text-sm font-bold">
                                                {getPaymentIconText(selectedMethod)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {/* Payment button */}
                                <Button
                                    onClick={handlePayment}
                                    className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white"
                                    disabled={!selectedMethod}
                                >
                                    Thanh toán
                                </Button>
                            </div>
                        </>
                    )}
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