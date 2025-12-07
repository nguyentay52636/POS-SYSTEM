import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Phone, Mail, Loader2 } from 'lucide-react';
import { createCustomer } from '@/apis/customerApi';
import { toast } from 'sonner';

export interface CustomerInfo {
    fullName: string;
    phone: string;
    email: string;
}

interface FormNewCustomerPaymentProps {
    onCustomerCreated: (customer: { customerId: number; name: string; phone: string; email: string }) => void;
    onCancel: () => void;
}

export default function FormNewCustomerPayment({
    onCustomerCreated,
    onCancel,
}: FormNewCustomerPaymentProps) {
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        fullName: '',
        phone: '',
        email: '',
    });
    const [isCreating, setIsCreating] = useState(false);

    const isFormValid = customerInfo.fullName.trim() && customerInfo.phone.trim();

    const handleFieldChange = (field: keyof CustomerInfo, value: string) => {
        setCustomerInfo(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!isFormValid) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        setIsCreating(true);
        try {
            const newCustomer = await createCustomer({
                name: customerInfo.fullName.trim(),
                phone: customerInfo.phone.trim(),
                email: customerInfo.email.trim() || '',
                address: '',
                customerPoint: 0,
            });

            console.log('✅ Customer created:', newCustomer);
            toast.success('Đã tạo khách hàng mới thành công!');

            // Callback với thông tin customer đã tạo
            onCustomerCreated({
                customerId: newCustomer.customerId,
                name: newCustomer.name,
                phone: newCustomer.phone || customerInfo.phone,
                email: newCustomer.email || customerInfo.email,
            });
        } catch (error: any) {
            console.error('❌ Error creating customer:', error);
            const errorMessage = error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                'Không thể tạo khách hàng mới. Vui lòng thử lại.';
            toast.error(errorMessage);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Card className="shadow-sm border border-green-200">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-gray-900">
                    <User className="h-5 w-5 mr-2 text-green-600" />
                    Thêm khách hàng mới
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
                                onChange={(e) => handleFieldChange('fullName', e.target.value)}
                                placeholder="Nhập họ và tên khách hàng"
                                className="pl-10 h-11 border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                disabled={isCreating}
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
                                onChange={(e) => handleFieldChange('phone', e.target.value)}
                                placeholder="Nhập số điện thoại"
                                className="pl-10 h-11 border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                disabled={isCreating}
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
                                onChange={(e) => handleFieldChange('email', e.target.value)}
                                placeholder="Nhập email khách hàng"
                                className="pl-10 h-11 border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                disabled={isCreating}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={onCancel}
                            disabled={isCreating}
                            className="flex-1 h-11 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!isFormValid || isCreating}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white h-11 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCreating ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Đang tạo...
                                </>
                            ) : (
                                'Tạo khách hàng'
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
