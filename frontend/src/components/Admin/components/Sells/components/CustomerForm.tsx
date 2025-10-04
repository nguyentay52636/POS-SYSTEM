import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Phone, Mail } from 'lucide-react';

export interface CustomerInfo {
    fullName: string;
    phone: string;
    email: string;
}

interface CustomerFormProps {
    customerInfo: CustomerInfo;
    onCustomerInfoChange: (field: keyof CustomerInfo, value: string) => void;
    onNext: () => void;
    disabled?: boolean;
}

export default function CustomerForm({
    customerInfo,
    onCustomerInfoChange,
    onNext,
    disabled = false,
}: CustomerFormProps) {
    const isFormValid = customerInfo.fullName.trim() && customerInfo.phone.trim();

    return (
        <Card className="shadow-sm border border-green-200">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-gray-900">
                    <User className="h-5 w-5 mr-2 text-green-600" />
                    Thông tin khách hàng
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                            Họ và tên *
                        </Label>
                        <div className="relative mt-1">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                id="fullName"
                                type="text"
                                value={customerInfo.fullName}
                                onChange={(e) => onCustomerInfoChange('fullName', e.target.value)}
                                placeholder="Nhập họ và tên khách hàng"
                                className="pl-10 h-11 border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                disabled={disabled}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                            Số điện thoại *
                        </Label>
                        <div className="relative mt-1">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                id="phone"
                                type="tel"
                                value={customerInfo.phone}
                                onChange={(e) => onCustomerInfoChange('phone', e.target.value)}
                                placeholder="Nhập số điện thoại"
                                className="pl-10 h-11 border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                disabled={disabled}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email (tùy chọn)
                        </Label>
                        <div className="relative mt-1">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                id="email"
                                type="email"
                                value={customerInfo.email}
                                onChange={(e) => onCustomerInfoChange('email', e.target.value)}
                                placeholder="Nhập email khách hàng"
                                className="pl-10 h-11 border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                disabled={disabled}
                            />
                        </div>
                    </div>

                    <Button
                        onClick={onNext}
                        disabled={!isFormValid || disabled}
                        className="w-full bg-green-600 hover:bg-green-700 text-white h-11 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Tiếp tục thanh toán
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
