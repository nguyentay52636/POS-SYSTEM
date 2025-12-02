"use client"

import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, MapPin, Phone, Mail, FileText } from "lucide-react"
import { ISupplier } from "@/types/types"
import { CreateSupplierDTO } from "@/apis/supplierApi"

// Zod validation schema
const supplierSchema = z.object({
    name: z.string().min(2, "Tên nhà cung cấp phải có ít nhất 2 ký tự"),
    phone: z.string()
        .min(10, "Số điện thoại phải có ít nhất 10 số")
        .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số"),
    email: z.string().email("Email không hợp lệ"),
    address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
})

type SupplierFormData = z.infer<typeof supplierSchema>

export type { SupplierFormData }

interface SupplierFormProps {
    supplier?: ISupplier
    onSubmit: (data: CreateSupplierDTO) => void | Promise<void>
    onCancel: () => void
}

export function SupplierForm({ supplier, onSubmit, onCancel }: SupplierFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch
    } = useForm<SupplierFormData>({
        resolver: zodResolver(supplierSchema),
        defaultValues: {
            name: supplier?.name || "",
            phone: supplier?.phone || "",
            email: supplier?.email || "",
            address: supplier?.address || "",

        }
    })


    const onSubmitForm = async (data: SupplierFormData) => {
        await onSubmit(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6 pt-4 rounded-lg">
            {/* Thông tin cơ bản */}
            <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="bg-blue-50">
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                        <Building2 className="h-5 w-5" />
                        Thông tin cơ bản
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6 ">
                    <div className="space-y-2">
                        <Label htmlFor="tenNhaCungCap">Tên nhà cung cấp *</Label>
                        <Input
                            id="tenNhaCungCap"
                            {...register("name")}
                            placeholder="Nhập tên nhà cung cấp"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600">{errors.name.message}</p>
                        )}
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
                                {...register("phone")}
                                placeholder="VD: 0123456789"
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-600">{errors.phone.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email *
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                {...register("email")}
                                placeholder="VD: supplier@example.com"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="diaChi" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Địa chỉ *
                        </Label>
                        <Textarea
                            id="diaChi"
                            {...register("address")}
                            placeholder="Nhập địa chỉ đầy đủ"
                            rows={3}
                        />
                        {errors.address && (
                            <p className="text-sm text-red-600">{errors.address.message}</p>
                        )}
                    </div>
                </CardContent>
            </Card>



            {/* Buttons */}
            <div className="flex gap-3 justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Hủy
                </Button>
                <Button
                    type="submit"
                    className="bg-green-700 hover:bg-green-800"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Đang xử lý..." : (supplier ? "Cập nhật" : "Thêm mới")}
                </Button>
            </div>
        </form>
    )
}
