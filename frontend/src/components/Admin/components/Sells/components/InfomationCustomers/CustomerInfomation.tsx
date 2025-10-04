import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import { ICustomer } from '@/types/types';

interface CustomerInformationProps {
    customerInfo: ICustomer;
    onCustomerInfoChange: (field: keyof ICustomer, value: string) => void;
}

export default function CustomerInformation({
    customerInfo,
    onCustomerInfoChange
}: CustomerInformationProps) {
    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-gray-900">
                    <User className="h-5 w-5 mr-2 text-green-600" />
                    Thông tin khách hàng
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="fullName" className="text-gray-700">
                            Họ và tên *
                        </Label>
                        <Input
                            id="fullName"
                            value={customerInfo.name}
                            onChange={(e) => onCustomerInfoChange('name', e.target.value)}
                            placeholder="Nhập họ và tên"
                            className="mt-1 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div>
                        <Label htmlFor="phone" className="text-gray-700">
                            Số điện thoại *
                        </Label>
                        <Input
                            id="phone"
                            value={customerInfo.phone}
                            onChange={(e) => onCustomerInfoChange('phone', e.target.value)}
                            placeholder="Nhập số điện thoại"
                            className="mt-1 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                </div>
                <div>
                    <Label htmlFor="email" className="text-gray-700">
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => onCustomerInfoChange('email', e.target.value)}
                        placeholder="Nhập email (không bắt buộc)"
                        className="mt-1 focus:ring-green-500 focus:border-green-500"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
