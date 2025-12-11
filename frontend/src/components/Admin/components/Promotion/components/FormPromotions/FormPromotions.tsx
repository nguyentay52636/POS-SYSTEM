"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Tag, Percent, Clock } from "lucide-react"

// DTO để tạo mới promotion (không có promoId, usedCount)
export interface CreatePromotionDto {
    promoCode: string
    description: string
    discountType: "fixed" | "percentage"
    discountValue: number
    startDate: string
    endDate: string
    minOrderAmount: number
    usageLimit: number
    status: "active" | "inactive" | "expired"
}

// DTO để cập nhật promotion (có promoId)
export interface UpdatePromotionDto extends CreatePromotionDto {
    promoId: number
}

interface PromotionFormProps {
    promotion?: UpdatePromotionDto
    onSubmit: (promotion: CreatePromotionDto | UpdatePromotionDto) => void
    onCancel: () => void
    isLoading?: boolean
}

// Helper để convert datetime-local sang ISO string
const toISOString = (dateTimeLocal: string): string => {
    if (!dateTimeLocal) return ""
    return new Date(dateTimeLocal).toISOString()
}

// Helper để convert ISO string sang datetime-local format
const toDateTimeLocal = (isoString: string): string => {
    if (!isoString) return ""
    const date = new Date(isoString)
    return date.toISOString().slice(0, 16)
}

export function FormPromotions({ promotion, onSubmit, onCancel, isLoading = false }: PromotionFormProps) {
    const isEditing = !!promotion?.promoId

    const [formData, setFormData] = useState<CreatePromotionDto>({
        promoCode: promotion?.promoCode || "",
        description: promotion?.description || "",
        discountType: (promotion?.discountType as "fixed" | "percentage") || "percentage",
        discountValue: promotion?.discountValue || 0,
        startDate: promotion?.startDate ? toDateTimeLocal(promotion.startDate) : "",
        endDate: promotion?.endDate ? toDateTimeLocal(promotion.endDate) : "",
        minOrderAmount: promotion?.minOrderAmount || 0,
        usageLimit: promotion?.usageLimit || 100,
        status: (promotion?.status as "active" | "inactive" | "expired") || "active",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Convert dates to ISO format for API
        const submitData: CreatePromotionDto = {
            ...formData,
            startDate: toISOString(formData.startDate),
            endDate: toISOString(formData.endDate),
        }

        if (isEditing && promotion?.promoId) {
            // Cập nhật: thêm promoId
            onSubmit({ ...submitData, promoId: promotion.promoId })
        } else {
            // Tạo mới: không có promoId
            onSubmit(submitData)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Promotion Code Card */}
                <Card className="border-blue-200 bg-blue-50/30 dark:bg-blue-950/20 dark:border-blue-800">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-blue-800 dark:text-blue-300 flex items-center gap-2">
                            <Tag className="h-5 w-5" />
                            Thông tin mã khuyến mãi
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="promoCode" className="text-blue-700 dark:text-blue-300">
                                Mã khuyến mãi *
                            </Label>
                            <Input
                                id="promoCode"
                                value={formData.promoCode}
                                onChange={(e) => setFormData({ ...formData, promoCode: e.target.value.toUpperCase() })}
                                placeholder="VD: SALE50, FREESHIP"
                                className="border-blue-300 focus:border-blue-500 uppercase"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <Label htmlFor="description" className="text-blue-700 dark:text-blue-300">
                                Mô tả *
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Nhập mô tả chương trình khuyến mãi"
                                className="border-blue-300 focus:border-blue-500 min-h-[100px]"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <Label htmlFor="status" className="text-blue-700 dark:text-blue-300">
                                Trạng thái
                            </Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: "active" | "inactive" | "expired") =>
                                    setFormData({ ...formData, status: value })
                                }
                                disabled={isLoading}
                            >
                                <SelectTrigger className="border-blue-300 focus:border-blue-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            Đang hoạt động
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                            Tạm ngưng
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="expired">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                            Hết hạn
                                        </span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Discount Info Card */}
                <Card className="border-orange-200 bg-orange-50/30 dark:bg-orange-950/20 dark:border-orange-800">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-orange-800 dark:text-orange-300 flex items-center gap-2">
                            <Percent className="h-5 w-5" />
                            Thông tin giảm giá
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="discountType" className="text-orange-700 dark:text-orange-300">
                                Loại giảm giá *
                            </Label>
                            <Select
                                value={formData.discountType}
                                onValueChange={(value: "fixed" | "percentage") =>
                                    setFormData({ ...formData, discountType: value })
                                }
                                disabled={isLoading}
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
                            <Label htmlFor="discountValue" className="text-orange-700 dark:text-orange-300">
                                Giá trị giảm * {formData.discountType === "percentage" ? "(%)" : "(VNĐ)"}
                            </Label>
                            <Input
                                id="discountValue"
                                type="number"
                                step={formData.discountType === "percentage" ? "0.01" : "1000"}
                                min="0"
                                max={formData.discountType === "percentage" ? "100" : undefined}
                                value={formData.discountValue}
                                onChange={(e) =>
                                    setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })
                                }
                                placeholder={formData.discountType === "percentage" ? "10" : "50000"}
                                className="border-orange-300 focus:border-orange-500"
                                required
                                disabled={isLoading}
                            />
                            {formData.discountType === "percentage" && formData.discountValue > 0 && (
                                <p className="text-sm text-orange-600 mt-1">
                                    Giảm {formData.discountValue}% trên tổng đơn hàng
                                </p>
                            )}
                            {formData.discountType === "fixed" && formData.discountValue > 0 && (
                                <p className="text-sm text-orange-600 mt-1">
                                    Giảm {formData.discountValue.toLocaleString("vi-VN")}đ trên tổng đơn hàng
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="minOrderAmount" className="text-orange-700 dark:text-orange-300">
                                Giá trị đơn hàng tối thiểu (VNĐ)
                            </Label>
                            <Input
                                id="minOrderAmount"
                                type="number"
                                min="0"
                                step="1000"
                                value={formData.minOrderAmount}
                                onChange={(e) =>
                                    setFormData({ ...formData, minOrderAmount: parseInt(e.target.value) || 0 })
                                }
                                placeholder="100000"
                                className="border-orange-300 focus:border-orange-500"
                                disabled={isLoading}
                            />
                            {formData.minOrderAmount > 0 && (
                                <p className="text-sm text-orange-600 mt-1">
                                    Áp dụng cho đơn từ {formData.minOrderAmount.toLocaleString("vi-VN")}đ
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Date Range Card */}
            <Card className="border-green-200 bg-green-50/30 dark:bg-green-950/20 dark:border-green-800">
                <CardHeader className="pb-3">
                    <CardTitle className="text-green-800 dark:text-green-300 flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Thời gian áp dụng
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="startDate" className="text-green-700 dark:text-green-300">
                                Ngày bắt đầu *
                            </Label>
                            <Input
                                id="startDate"
                                type="datetime-local"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="border-green-300 focus:border-green-500"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <Label htmlFor="endDate" className="text-green-700 dark:text-green-300">
                                Ngày kết thúc *
                            </Label>
                            <Input
                                id="endDate"
                                type="datetime-local"
                                value={formData.endDate}
                                min={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="border-green-300 focus:border-green-500"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Usage Limit Card */}
            <Card className="border-purple-200 bg-purple-50/30 dark:bg-purple-950/20 dark:border-purple-800">
                <CardHeader className="pb-3">
                    <CardTitle className="text-purple-800 dark:text-purple-300 flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Giới hạn sử dụng
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <Label htmlFor="usageLimit" className="text-purple-700 dark:text-purple-300">
                            Số lần sử dụng tối đa *
                        </Label>
                        <Input
                            id="usageLimit"
                            type="number"
                            min="1"
                            value={formData.usageLimit}
                            onChange={(e) =>
                                setFormData({ ...formData, usageLimit: parseInt(e.target.value) || 1 })
                            }
                            placeholder="100"
                            className="border-purple-300 focus:border-purple-500"
                            required
                            disabled={isLoading}
                        />
                        <p className="text-sm text-purple-600 mt-1">
                            Mã có thể được sử dụng tối đa {formData.usageLimit.toLocaleString("vi-VN")} lần
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="border-gray-300 hover:bg-gray-50 bg-transparent"
                    disabled={isLoading}
                >
                    Hủy
                </Button>
                <Button
                    type="submit"
                    className="bg-green-700 hover:bg-green-800 text-white min-w-[120px]"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Đang xử lý...
                        </span>
                    ) : (
                        isEditing ? "Cập nhật" : "Tạo mới"
                    )}
                </Button>
            </div>
        </form>
    )
}
