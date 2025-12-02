import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { usePromotions } from '@/hooks/usePromotions'
import type { Promotion } from '@/apis/promotionsApi'

interface SelectPromotionProps {
    onSelect: (promotion: Promotion) => void
}

export default function SelectPromotion({ onSelect }: SelectPromotionProps) {
    const { promotions, loading, error } = usePromotions()
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')

    const filteredPromotions = useMemo(() => {
        const q = search.toLowerCase().trim()
        if (!q) return promotions
        return promotions.filter((p) => {
            const code = p.promoCode?.toLowerCase() || ''
            const desc = p.description?.toLowerCase() || ''
            return code.includes(q) || desc.includes(q)
        })
    }, [promotions, search])

    const handleSelect = (promo: Promotion) => {
        onSelect(promo)
        setOpen(false)
    }

    return (
        <>
            <Button
                type="button"
                variant="outline"
                className="h-10"
                onClick={() => setOpen(true)}
            >
                Chọn KM
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chọn mã khuyến mãi</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Input
                            placeholder="Tìm theo mã hoặc mô tả..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        {loading && (
                            <div className="text-center text-gray-500 py-6">
                                Đang tải danh sách khuyến mãi...
                            </div>
                        )}

                        {error && !loading && (
                            <div className="text-center text-red-600 py-6">
                                {error}
                            </div>
                        )}

                        {!loading && !error && (
                            <div className="space-y-2">
                                {filteredPromotions.length === 0 ? (
                                    <div className="text-center text-gray-500 py-6">
                                        Không tìm thấy khuyến mãi phù hợp
                                    </div>
                                ) : (
                                    filteredPromotions.map((promo) => (
                                        <button
                                            key={promo.promoId}
                                            type="button"
                                            onClick={() => handleSelect(promo)}
                                            className="w-full text-left border rounded-md p-3 hover:bg-gray-50 flex items-center justify-between gap-3"
                                        >
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge className="bg-green-600 text-white">
                                                        {promo.promoCode}
                                                    </Badge>
                                                    <span className="text-xs text-gray-600">
                                                        {promo.discountType === 'percentage'
                                                            ? `Giảm ${promo.discountValue}%`
                                                            : `Giảm ${promo.discountValue?.toLocaleString('vi-VN')}đ`}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-700">{promo.description}</p>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {promo.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                                            </span>
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
