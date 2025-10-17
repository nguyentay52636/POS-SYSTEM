"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Promotion } from "@/apis/promotionsApi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "lucide-react"

interface PromotionFormProps {
    promotion?: Promotion
    onSubmit: (promotion: Omit<Promotion, "promotionId"> | Promotion) => void
    onCancel: () => void
}

export function FormPromotions({ promotion, onSubmit, onCancel }: PromotionFormProps) {
    const [formData, setFormData] = useState<Promotion>({
        promoId: promotion?.promoId,
        promoCode: promotion?.promoCode || "",
        description: promotion?.description || "",
        discountType: promotion?.discountType || "percentage",
        discountValue: promotion?.discountValue || 0,
        startDate: promotion?.startDate || "",
        endDate: promotion?.endDate || "",
        minOrderAmount: promotion?.minOrderAmount || 0,
        usageLimit: promotion?.usageLimit || 1,
        usedCount: promotion?.usedCount || 0,
        status: promotion?.status || "active",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (promotion?.promoId) {
            onSubmit(formData)
        } else {
            const { promoId, ...newPromotion } = formData
            onSubmit(newPromotion)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Promotion Code Card */}
                <Card className="border-blue-200 bg-blue-50/30">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-blue-800">Thông tin mã khuyến mãi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="promoCode" className="text-blue-700">
                                Mã khuyến mãi *
                            </Label>
                            <Input
                                id="promoCode"
                                value={formData.promoCode}
                                onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                                placeholder="VD: SALE50, FREESHIP"
                                className="border-blue-300 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="description" className="text-blue-700">
                                Mô tả *
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Nhập mô tả chương trình khuyến mãi"
                                className="border-blue-300 focus:border-blue-500 min-h-[100px]"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="status" className="text-blue-700">
                                Trạng thái
                            </Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger className="border-blue-300 focus:border-blue-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Đang hoạt động</SelectItem>
                                    <SelectItem value="inactive">Tạm ngưng</SelectItem>
                                    <SelectItem value="expired">Hết hạn</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Discount Info Card */}
                <Card className="border-orange-200 bg-orange-50/30">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-orange-800">Thông tin giảm giá</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="discountType" className="text-orange-700">
                                Loại giảm giá *
                            </Label>
                            <Select
                                value={formData.discountType}
                                onValueChange={(value) => setFormData({ ...formData, discountType: value })}
                            >
                                <SelectTrigger className="border-orange-300 focus:border-orange-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                                    <SelectItem value="fixed">Cố định (VNĐ)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="discountValue" className="text-orange-700">
                                Giá trị giảm *
                            </Label>
                            <Input
                                id="discountValue"
                                type="number"
                                min="0"
                                value={formData.discountValue}
                                onChange={(e) =>
                                    setFormData({ ...formData, discountValue: Number(e.target.value) })
                                }
                                placeholder={formData.discountType === "percentage" ? "0-100" : "0"}
                                className="border-orange-300 focus:border-orange-500"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="minOrderAmount" className="text-orange-700">
                                Giá trị đơn hàng tối thiểu (VNĐ)
                            </Label>
                            <Input
                                id="minOrderAmount"
                                type="number"
                                min="0"
                                value={formData.minOrderAmount}
                                onChange={(e) =>
                                    setFormData({ ...formData, minOrderAmount: Number(e.target.value) })
                                }
                                placeholder="0"
                                className="border-orange-300 focus:border-orange-500"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Date Range Card */}
            <Card className="border-green-200 bg-green-50/30">
                <CardHeader className="pb-3">
                    <CardTitle className="text-green-800 flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Thời gian áp dụng
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="startDate" className="text-green-700">
                                Ngày bắt đầu *
                            </Label>
                            <Input
                                id="startDate"
                                type="datetime-local"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="border-green-300 focus:border-green-500"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="endDate" className="text-green-700">
                                Ngày kết thúc *
                            </Label>
                            <Input
                                id="endDate"
                                type="datetime-local"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="border-green-300 focus:border-green-500"
                                required
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Usage Limit Card */}
            <Card className="border-purple-200 bg-purple-50/30">
                <CardHeader className="pb-3">
                    <CardTitle className="text-purple-800">Giới hạn sử dụng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="usageLimit" className="text-purple-700">
                                Số lần sử dụng tối đa *
                            </Label>
                            <Input
                                id="usageLimit"
                                type="number"
                                min="1"
                                value={formData.usageLimit}
                                onChange={(e) =>
                                    setFormData({ ...formData, usageLimit: Number(e.target.value) })
                                }
                                placeholder="1"
                                className="border-purple-300 focus:border-purple-500"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="usedCount" className="text-purple-700">
                                Đã sử dụng (chỉ đọc)
                            </Label>
                            <Input
                                id="usedCount"
                                type="number"
                                value={formData.usedCount}
                                disabled
                                className="border-purple-300 bg-gray-100"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="border-gray-300 hover:bg-gray-50 bg-transparent"
                >
                    Hủy
                </Button>
                <Button type="submit" className="bg-green-700 hover:bg-green-800 text-white">
                    {promotion ? "Cập nhật" : "Tạo mới"}
                </Button>
            </div>
        </form>
    )
}
