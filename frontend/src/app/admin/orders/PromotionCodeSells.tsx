import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface IPromotion {
    promo_id: number
    promo_code: string
    description: string
    discount_type: string
    discount_value?: number
}

interface PromotionCodeSellsProps {
    promoCode: string
    setPromoCode: (code: string) => void
    promoError: string
    setPromoError: (error: string) => void
    appliedPromotion: IPromotion | null
    applyPromoCode: () => void
    removePromotion: () => void
}

export default function PromotionCodeSells({
    promoCode,
    setPromoCode,
    promoError,
    setPromoError,
    appliedPromotion,
    applyPromoCode,
    removePromotion
}: PromotionCodeSellsProps) {
    return (
        <>
            <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-3 block">
                    Mã khuyến mãi
                </label>
                {!appliedPromotion ? (
                    <div className="flex gap-3">
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
                        <Button
                            onClick={applyPromoCode}
                            className="bg-green-600 hover:bg-green-700 h-10 px-4 font-medium"
                            disabled={!promoCode}
                        >
                            Áp dụng
                        </Button>
                    </div>
                ) : (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge className="bg-green-600 text-white font-semibold px-3 py-1">
                                        {appliedPromotion.promo_code}
                                    </Badge>
                                    <span className="text-xs font-medium text-green-700 bg-white px-2 py-1 rounded-full border border-green-200">
                                        {appliedPromotion.discount_type === "percentage"
                                            ? `Giảm ${appliedPromotion.discount_value}%`
                                            : `Giảm ${appliedPromotion.discount_value?.toLocaleString("vi-VN")}đ`}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-gray-700">{appliedPromotion.description}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={removePromotion}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
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
