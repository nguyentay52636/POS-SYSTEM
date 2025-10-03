"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Percent, User } from "lucide-react"

export interface PromotionInfo {
    tenKhachHangKhuyenMai: string
    phanTramGiamGia: number
    trangThai: "active" | "inactive" | "expired"
}

export interface PromotionInfoProps {
    value: PromotionInfo
    onChange: (value: PromotionInfo) => void
    priceAfterDiscount?: string
}

export function PromotionInfoCard({ value, onChange, priceAfterDiscount }: PromotionInfoProps) {
    return (
        <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader className="pb-3">
                <CardTitle className="text-blue-800 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Thông tin khuyến mãi
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="tenKhachHangKhuyenMai" className="text-blue-700">
                        Tên chương trình *
                    </Label>
                    <Input
                        id="tenKhachHangKhuyenMai"
                        value={value.tenKhachHangKhuyenMai}
                        onChange={(e) => onChange({ ...value, tenKhachHangKhuyenMai: e.target.value })}
                        placeholder="Nhập tên chương trình khuyến mãi"
                        className="border-blue-300 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="phanTramGiamGia" className="text-blue-700 flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        Phần trăm giảm giá (%) *
                    </Label>
                    <Input
                        id="phanTramGiamGia"
                        type="number"
                        min="0"
                        max="100"
                        value={value.phanTramGiamGia}
                        onChange={(e) => onChange({ ...value, phanTramGiamGia: Number(e.target.value) })}
                        placeholder="0"
                        className="border-blue-300 focus:border-blue-500"
                        required
                    />
                    {priceAfterDiscount && (
                        <div className="mt-2 p-2 bg-blue-100 rounded-md">
                            <p className="text-sm text-blue-700">
                                Giá sau giảm: <span className="font-semibold">{priceAfterDiscount}</span>
                            </p>
                        </div>
                    )}
                </div>

                <div>
                    <Label htmlFor="trangThai" className="text-blue-700">
                        Trạng thái
                    </Label>
                    <Select
                        value={value.trangThai}
                        onValueChange={(v: "active" | "inactive" | "expired") => onChange({ ...value, trangThai: v })}
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
    )
}

export default PromotionInfoCard
