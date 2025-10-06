"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, MapPin, Phone, Mail, FileText } from "lucide-react"
import { ISupplier } from "@/types/types"


interface SupplierFormProps {
    supplier?: ISupplier
    onSubmit: (data: Partial<ISupplier>) => void
    onCancel: () => void
}

export function SupplierForm({ supplier, onSubmit, onCancel }: SupplierFormProps) {
    const [formData, setFormData] = useState<Partial<ISupplier>>({
        supplier_id: supplier?.supplier_id || 0,
        name: supplier?.name || "",
        address: supplier?.address || "",
        phone: supplier?.phone || "",
        email: supplier?.email || "",
        createdAt: supplier?.createdAt || "",
        updatedAt: supplier?.updatedAt || "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const handleChange = (field: keyof ISupplier, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pt-4 rounded-lg">
            {/* Thông tin cơ bản */}
            <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="bg-blue-50">
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                        <Building2 className="h-5 w-5" />
                        Thông tin cơ bản
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="maNhaCungCap">Mã nhà cung cấp *</Label>
                            <Input
                                id="maNhaCungCap"
                                value={formData.supplier_id}
                                onChange={(e) => handleChange("supplier_id", e.target.value)}
                                placeholder="VD: NCC001"
                                disabled={!!supplier}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tenNhaCungCap">Tên nhà cung cấp *</Label>
                            <Input
                                id="tenNhaCungCap"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                placeholder="Nhập tên nhà cung cấp"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="trangThai">Trạng thái</Label>
                        <Select value={formData.trangThai} onValueChange={(value) => handleChange("trangThai", value as "active" | "inactive")}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Đang hoạt động</SelectItem>
                                <SelectItem value="inactive">Tạm ngưng</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Thông tin liên hệ */}
            <Card className="border-l-4 border-l-green-500">
                <CardHeader className="bg-green-50">
                    <CardTitle className="flex items-center gap-2 text-green-700">
                        <Phone className="h-5 w-5" />
                        Thông tin liên hệ
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="soDienThoai" className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Số điện thoại *
                            </Label>
                            <Input
                                id="soDienThoai"
                                value={formData.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                placeholder="VD: 0123456789"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email *
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder="VD: supplier@example.com"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="diaChi" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Địa chỉ *
                        </Label>
                        <Textarea
                            id="diaChi"
                            value={formData.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            placeholder="Nhập địa chỉ đầy đủ"
                            rows={3}
                            required
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Mô tả */}
            <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="bg-orange-50">
                    <CardTitle className="flex items-center gap-2 text-orange-700">
                        <FileText className="h-5 w-5" />
                        Thông tin bổ sung
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            placeholder="Mô tả về nhà cung cấp..."
                            rows={4}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Hủy
                </Button>
                <Button type="submit" className="bg-green-700 hover:bg-green-800">
                    {supplier ? "Cập nhật" : "Thêm mới"}
                </Button>
            </div>
        </form>
    )
}
