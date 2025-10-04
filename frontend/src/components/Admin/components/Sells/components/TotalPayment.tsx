import React from 'react'
import { Separator } from '@/components/ui/separator'
export default function TotalPayment({ subtotal, appliedPromotion, discountAmount, total }: { subtotal: number, appliedPromotion: any, discountAmount: number, total: number }) {
    return (
        <>
            <div className="space-y-3 mb-5 bg-white p-4 rounded-xl border-2 border-gray-200">
                <div className="flex justify-between text-base">
                    <span className="text-gray-600 font-semibold">Tạm tính:</span>
                    <span className="font-bold text-gray-900">{subtotal.toLocaleString("vi-VN")}đ</span>
                </div>
                {appliedPromotion && discountAmount > 0 && (
                    <div className="flex justify-between text-base text-orange-600">
                        <span className="font-semibold">
                            Giảm giá (
                            {appliedPromotion.discount_type === "percentage"
                                ? `${appliedPromotion.discount_value}%`
                                : "Cố định"}
                            ):
                        </span>
                        <span className="font-bold">-{discountAmount.toLocaleString("vi-VN")}đ</span>
                    </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between text-xl font-bold bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg">
                    <span className="text-gray-900">Tổng cộng:</span>
                    <span className="text-green-700">{total.toLocaleString("vi-VN")}đ</span>
                </div>
            </div>
        </>
    )
}
