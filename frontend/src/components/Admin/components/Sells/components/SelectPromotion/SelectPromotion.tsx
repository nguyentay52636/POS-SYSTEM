import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { usePromotions } from '@/hooks/usePromotions'
import type { Promotion } from '@/apis/promotionsApi'
import { Gift, Calendar, Tag, Loader2 } from 'lucide-react'

interface SelectPromotionProps {
    onSelect: (promotion: Promotion) => void
}

export default function SelectPromotion({ onSelect }: SelectPromotionProps) {
    const { promotions, loading, error } = usePromotions()
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')

    // Lọc chỉ hiển thị khuyến mãi đang active và còn hiệu lực
    const activePromotions = useMemo(() => {
        const now = new Date()
        return promotions.filter((p) => {
            if (p.status !== 'active') return false
            const startDate = new Date(p.startDate)
            const endDate = new Date(p.endDate)
            // Chỉ hiển thị khuyến mãi đang trong thời gian hiệu lực
            return startDate <= now && endDate >= now
        })
    }, [promotions])

    const filteredPromotions = useMemo(() => {
        const q = search.toLowerCase().trim()
        if (!q) return activePromotions
        return activePromotions.filter((p) => {
            const code = p.promoCode?.toLowerCase() || ''
            const desc = p.description?.toLowerCase() || ''
            return code.includes(q) || desc.includes(q)
        })
    }, [activePromotions, search])

    const handleSelect = (promo: Promotion) => {
        onSelect(promo)
        setOpen(false)
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }

    return (
        <>
            <Button
                type="button"
                variant="outline"
                className="h-10 gap-2 border-green-300 hover:bg-green-50 hover:border-green-400"
                onClick={() => setOpen(true)}
            >
                <Gift className="h-4 w-4 text-green-600" />
                Chọn KM
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-green-700">
                            <Gift className="h-5 w-5" />
                            Chọn mã khuyến mãi ({activePromotions.length} khuyến mãi đang hoạt động)
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Input
                            placeholder="Tìm theo mã hoặc mô tả..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border-green-200 focus:border-green-500 focus:ring-green-500"
                        />

                        {loading && (
                            <div className="flex items-center justify-center gap-2 text-gray-500 py-8">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Đang tải danh sách khuyến mãi...
                            </div>
                        )}

                        {error && !loading && (
                            <div className="text-center text-red-600 py-6 bg-red-50 rounded-lg">
                                {error}
                            </div>
                        )}

                        {!loading && !error && (
                            <div className="space-y-3">
                                {filteredPromotions.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
                                        <Gift className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                                        <p>Không tìm thấy khuyến mãi phù hợp</p>
                                    </div>
                                ) : (
                                    filteredPromotions.map((promo) => (
                                        <button
                                            key={promo.promoId}
                                            type="button"
                                            onClick={() => handleSelect(promo)}
                                            className="w-full text-left border border-green-200 rounded-lg p-4 hover:bg-green-50 hover:border-green-400 transition-all duration-200 group"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge className="bg-green-600 text-white font-bold px-3 py-1">
                                                            {promo.promoCode}
                                                        </Badge>
                                                        <Badge variant="outline" className="border-orange-300 text-orange-600 font-semibold">
                                                            {promo.discountType === 'percentage'
                                                                ? `Giảm ${promo.discountValue}%`
                                                                : `Giảm ${promo.discountValue?.toLocaleString('vi-VN')}đ`}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-700 mb-2">{promo.description}</p>
                                                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {formatDate(promo.startDate)} - {formatDate(promo.endDate)}
                                                        </span>
                                                        {promo.minOrderAmount > 0 && (
                                                            <span className="flex items-center gap-1">
                                                                <Tag className="h-3 w-3" />
                                                                Đơn tối thiểu: {promo.minOrderAmount.toLocaleString('vi-VN')}đ
                                                            </span>
                                                        )}
                                                        {promo.usageLimit > 0 && (
                                                            <span>
                                                                Còn {promo.usageLimit - promo.usedCount}/{promo.usageLimit} lượt
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-sm font-medium">Chọn →</span>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
