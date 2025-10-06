import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { KhuyenMai } from '../../ManagerPromotionsContent'
// Using a minimal product shape for details view
interface BasicProduct {
    maSanPham: string
    tenSanPham: string
    hinhAnh: string
    giaBan: number
}

interface DialogViewDetailPromotionsProps {
    isDetailOpen: boolean
    setIsDetailOpen: (open: boolean) => void
    selectedPromotion: KhuyenMai | null
    getProductInfo: (maSanPham: string) => BasicProduct | undefined
    getStatusBadge: (status: string) => React.ReactNode
}
export default function DialogViewDetailPromotions({ isDetailOpen, setIsDetailOpen, selectedPromotion, getProductInfo, getStatusBadge }: DialogViewDetailPromotionsProps) {
    return (
        <>
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
                                    <p className="text-lg font-semibold">{selectedPromotion.maKhuyenMai}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Trạng thái</Label>
                                    <div className="mt-1">{getStatusBadge(selectedPromotion.trangThai)}</div>
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-gray-500">Tên chương trình</Label>
                                <p className="text-lg">{selectedPromotion.tenKhachHangKhuyenMai}</p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-gray-500">Sản phẩm áp dụng</Label>
                                {(() => {
                                    const product = getProductInfo(selectedPromotion.maSanPham)
                                    return product ? (
                                        <div className="flex items-center gap-3 mt-2">
                                            <img
                                                src={product.hinhAnh || "/placeholder.svg"}
                                                alt={product.tenSanPham}
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                            <div>
                                                <p className="font-medium">{product.tenSanPham}</p>
                                                <p className="text-sm text-gray-500">Giá gốc: {product.giaBan.toLocaleString("vi-VN")}đ</p>
                                                <p className="text-sm text-green-600 font-medium">
                                                    Giá sau giảm:{" "}
                                                    {(product.giaBan * (1 - selectedPromotion.phanTramGiamGia / 100)).toLocaleString("vi-VN")}đ
                                                </p>
                                            </div>
                                        </div>
                                    ) : null
                                })()}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Phần trăm giảm giá</Label>
                                    <p className="text-2xl font-bold text-orange-600">{selectedPromotion.phanTramGiamGia}%</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Thời gian áp dụng</Label>
                                    <p className="text-sm">
                                        {new Date(selectedPromotion.ngayBatDau).toLocaleString("vi-VN")}
                                        <br />
                                        đến {new Date(selectedPromotion.ngayKetThuc).toLocaleString("vi-VN")}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-gray-500">Mô tả</Label>
                                <p className="mt-1 text-gray-700">{selectedPromotion.moTa}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
