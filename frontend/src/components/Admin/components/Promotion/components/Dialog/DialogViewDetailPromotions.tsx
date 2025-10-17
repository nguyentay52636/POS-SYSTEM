import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Promotion } from '@/apis/promotionsApi'

interface DialogViewDetailPromotionsProps {
    isDetailOpen: boolean
    setIsDetailOpen: (open: boolean) => void
    selectedPromotion: Promotion | null
    getStatusBadge: (status: string) => React.ReactNode
}

export default function DialogViewDetailPromotions({
    isDetailOpen,
    setIsDetailOpen,
    selectedPromotion,
    getStatusBadge
}: DialogViewDetailPromotionsProps) {
    return (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Chi tiết khuyến mãi</DialogTitle>
                </DialogHeader>
                {selectedPromotion && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Mã khuyến mãi</Label>
                                <p className="text-lg font-semibold">{selectedPromotion.promoId}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Trạng thái</Label>
                                <div className="mt-1">{getStatusBadge(selectedPromotion.status)}</div>
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-gray-500">Mã code khuyến mãi</Label>
                            <p className="text-lg font-semibold text-blue-600">{selectedPromotion.promoCode}</p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-gray-500">Mô tả chương trình</Label>
                            <p className="text-lg">{selectedPromotion.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Loại giảm giá</Label>
                                <p className="text-lg font-medium">
                                    {selectedPromotion.discountType === 'percentage' ? 'Phần trăm' : 'Cố định'}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Giá trị giảm</Label>
                                <p className="text-2xl font-bold text-orange-600">
                                    {selectedPromotion.discountType === 'percentage'
                                        ? `${selectedPromotion.discountValue}%`
                                        : `${selectedPromotion.discountValue.toLocaleString("vi-VN")}đ`}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Thời gian bắt đầu</Label>
                                <p className="text-sm">
                                    {new Date(selectedPromotion.startDate).toLocaleString("vi-VN")}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Thời gian kết thúc</Label>
                                <p className="text-sm">
                                    {new Date(selectedPromotion.endDate).toLocaleString("vi-VN")}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Giá trị đơn hàng tối thiểu</Label>
                                <p className="text-lg font-medium">
                                    {selectedPromotion.minOrderAmount.toLocaleString("vi-VN")}đ
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Số lần sử dụng</Label>
                                <p className="text-lg">
                                    <span className="font-bold text-green-600">{selectedPromotion.usedCount}</span>
                                    <span className="text-gray-500"> / {selectedPromotion.usageLimit}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
