import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import SelectPromotion from '@/components/Admin/components/Sells/components/SelectPromotion/SelectPromotion'
import type { Promotion } from '@/apis/promotionsApi'
import type { IPromotion } from "@/redux/Slice/cartSlice"

interface PromotionCodeSellsProps {
    promoCode: string
    setPromoCode: (code: string) => void
    promoError: string
    setPromoError: (error: string) => void
    appliedPromotions: IPromotion[]
    applyPromoCode: () => void
    removePromotion: (promoId?: number) => void
}

export default function PromotionCodeSells({
    promoCode,
    setPromoCode,
    promoError,
    setPromoError,
    appliedPromotions,
    applyPromoCode,
    removePromotion
}: PromotionCodeSellsProps) {
    return (
        <>
            <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-3 block">
                    Mã khuyến mãi
                </label>
                <div className="flex gap-3 mb-3">
                    <Input
                        value={promoCode}
                        onChange={(e) => {
                            setPromoCode(e.target.value)
                            setPromoError("")
                        }}
                        placeholder="Nhập mã khuyến mãi"
                        className="flex-1 h-10 border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                applyPromoCode()
                            }
                        }}
                    />
                    <SelectPromotion
                        onSelect={(promo: Promotion) => {
                            if (promo.promoCode) {
                                setPromoCode(promo.promoCode)
                                setPromoError("")
                                // Áp dụng ngay khi chọn từ danh sách
                                applyPromoCode()
                            }
                        }}
                    />
                    <Button
                        onClick={applyPromoCode}
                        className="bg-green-600 hover:bg-green-700 h-10 px-4 font-medium"
                        disabled={!promoCode}
                    >
                        Áp dụng
                    </Button>
                </div>

                {appliedPromotions.length > 0 && (
                    <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-gray-700">
                                Đang áp dụng ({appliedPromotions.length}) khuyến mãi:
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                                onClick={() => removePromotion(undefined)}
                            >
                                Xóa tất cả
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {appliedPromotions.map((p) => (
                                <div
                                    key={p.promo_id}
                                    className="flex items-center gap-2 border border-green-200 rounded-full px-3 py-1 bg-green-50"
                                >
                                    <Badge className="bg-green-600 text-white font-semibold px-2 py-0.5">
                                        {p.promo_code}
                                    </Badge>
                                    <span className="text-xs text-green-700">
                                        {p.discount_type === "percentage"
                                            ? `Giảm ${p.discount_value}%`
                                            : `Giảm ${p.discount_value?.toLocaleString("vi-VN")}đ`}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removePromotion(p.promo_id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {promoError && (
                    <p className="text-sm text-red-600 mt-2 font-medium flex items-center gap-1">
                        <X className="h-4 w-4" />
                        {promoError}
                    </p>
                )}
            </div>
        </>
    )
}
